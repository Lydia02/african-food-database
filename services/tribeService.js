import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { formatTribe, validateTribe } from '../models/Tribe.js';

const collection = db.collection(COLLECTIONS.TRIBES);

/**
 * Get all tribes (with optional filters)
 */
export const getAllTribes = async ({ page = 1, limit = 20, countryId = '', search = '' } = {}) => {
  let query = collection.orderBy('name');

  if (countryId) {
    query = collection.where('countryId', '==', countryId).orderBy('name');
  }

  if (search) {
    const end = search.slice(0, -1) + String.fromCharCode(search.charCodeAt(search.length - 1) + 1);
    query = collection
      .where('name', '>=', search)
      .where('name', '<', end)
      .orderBy('name');
  }

  const snapshot = await query.limit(limit).offset((page - 1) * limit).get();

  const tribes = [];
  snapshot.forEach((doc) => {
    tribes.push({ id: doc.id, ...doc.data() });
  });

  return { tribes, pagination: { page, limit } };
};

/**
 * Get tribes by country
 */
export const getTribesByCountry = async (countryId) => {
  const snapshot = await collection
    .where('countryId', '==', countryId)
    .orderBy('name')
    .get();

  const tribes = [];
  snapshot.forEach((doc) => {
    tribes.push({ id: doc.id, ...doc.data() });
  });
  return tribes;
};

/**
 * Get a single tribe by ID
 */
export const getTribeById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

/**
 * Create a tribe
 */
export const createTribe = async (data) => {
  const validation = validateTribe(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const formatted = formatTribe(data);
  const docRef = await collection.add(formatted);
  return { id: docRef.id, ...formatted };
};

/**
 * Update a tribe
 */
export const updateTribe = async (id, data) => {
  const existing = await getTribeById(id);
  if (!existing) throw new Error('Tribe not found');

  const formatted = formatTribe({ ...existing, ...data });
  await collection.doc(id).update(formatted);
  return { id, ...formatted };
};

/**
 * Delete a tribe
 */
export const deleteTribe = async (id) => {
  const existing = await getTribeById(id);
  if (!existing) throw new Error('Tribe not found');
  await collection.doc(id).delete();
  return { id, deleted: true };
};

/**
 * Batch create tribes (for seeding)
 */
export const batchCreateTribes = async (tribesData) => {
  const batch = db.batch();
  const results = [];

  for (const data of tribesData) {
    const formatted = formatTribe(data);
    const docRef = collection.doc();
    batch.set(docRef, formatted);
    results.push({ id: docRef.id, ...formatted });
  }

  await batch.commit();
  return results;
};

export default {
  getAllTribes,
  getTribesByCountry,
  getTribeById,
  createTribe,
  updateTribe,
  deleteTribe,
  batchCreateTribes,
};
