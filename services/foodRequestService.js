import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { formatFoodRequest, FOOD_REQUEST_STATUSES } from '../models/FoodRequest.js';

const collection = db.collection(COLLECTIONS.FOOD_REQUESTS);

/**
 * Log a food request (upsert — increments count if the same query exists)
 */
export const logFoodRequest = async (query, { region = '', countryHint = '' } = {}) => {
  if (!query || query.trim().length < 2) return null;

  const normalized = query.trim().toLowerCase();

  // Check if this query was already requested
  const existing = await collection
    .where('normalizedQuery', '==', normalized)
    .limit(1)
    .get();

  if (!existing.empty) {
    const doc = existing.docs[0];
    const data = doc.data();
    await collection.doc(doc.id).update({
      count: (data.count || 0) + 1,
      lastRequestedAt: new Date().toISOString(),
      // Update region/country hints if provided
      ...(region && { region }),
      ...(countryHint && { countryHint }),
    });
    return { id: doc.id, ...data, count: data.count + 1 };
  }

  // Create new request
  const formatted = formatFoodRequest({ query, region, countryHint });
  const docRef = await collection.add(formatted);
  return { id: docRef.id, ...formatted };
};

/**
 * Get top requested foods (most wanted)
 */
export const getTopRequested = async ({ limit = 20, status = '' } = {}) => {
  let query = collection.orderBy('count', 'desc');

  if (status && FOOD_REQUEST_STATUSES.includes(status)) {
    query = collection
      .where('status', '==', status)
      .orderBy('count', 'desc');
  }

  const snapshot = await query.limit(limit).get();
  const requests = [];
  snapshot.forEach((doc) => {
    requests.push({ id: doc.id, ...doc.data() });
  });
  return requests;
};

/**
 * Get all food requests with pagination and filters
 */
export const getAllRequests = async ({ page = 1, limit = 20, status = '' } = {}) => {
  let query = collection.orderBy('lastRequestedAt', 'desc');

  if (status && FOOD_REQUEST_STATUSES.includes(status)) {
    query = collection
      .where('status', '==', status)
      .orderBy('lastRequestedAt', 'desc');
  }

  const snapshot = await query
    .limit(limit)
    .offset((page - 1) * limit)
    .get();

  const requests = [];
  snapshot.forEach((doc) => {
    requests.push({ id: doc.id, ...doc.data() });
  });

  return { requests, pagination: { page, limit } };
};

/**
 * Update a food request status (admin action)
 */
export const updateRequestStatus = async (id, status, { addedFoodId = '', notes = '' } = {}) => {
  if (!FOOD_REQUEST_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${FOOD_REQUEST_STATUSES.join(', ')}`);
  }

  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) throw new Error('Food request not found');

  const update = {
    status,
    lastRequestedAt: new Date().toISOString(),
    ...(addedFoodId && { addedFoodId }),
    ...(notes && { notes }),
  };

  await docRef.update(update);
  return { id, ...doc.data(), ...update };
};

/**
 * Delete a food request
 */
export const deleteRequest = async (id) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) throw new Error('Food request not found');
  await docRef.delete();
  return { id, deleted: true };
};

/**
 * Get request stats: total pending, total unique queries, top regions, etc.
 */
export const getRequestStats = async () => {
  const snapshot = await collection.get();

  let total = 0;
  let totalSearches = 0;
  let pendingCount = 0;
  let addedCount = 0;
  const regionCounts = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    total++;
    totalSearches += data.count || 1;
    if (data.status === 'pending') pendingCount++;
    if (data.status === 'added') addedCount++;
    if (data.region) {
      regionCounts[data.region] = (regionCounts[data.region] || 0) + (data.count || 1);
    }
  });

  const topRegions = Object.entries(regionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([region, count]) => ({ region, count }));

  return {
    totalUniqueQueries: total,
    totalSearches,
    pendingCount,
    addedCount,
    topRegions,
  };
};

export default {
  logFoodRequest,
  getTopRequested,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
  getRequestStats,
};
