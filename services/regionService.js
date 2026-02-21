import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { formatRegion, validateRegion } from '../models/Region.js';

const collection = db.collection(COLLECTIONS.REGIONS);

export const getAllRegions = async ({ page = 1, limit = 50, countryId = '' } = {}) => {
  let query = collection.orderBy('name');

  if (countryId) {
    query = collection.where('countryId', '==', countryId).orderBy('name');
  }

  const snapshot = await query.limit(limit).offset((page - 1) * limit).get();

  const regions = [];
  snapshot.forEach((doc) => {
    regions.push({ id: doc.id, ...doc.data() });
  });

  return { regions, pagination: { page, limit } };
};

export const getRegionsByCountry = async (countryId) => {
  const snapshot = await collection
    .where('countryId', '==', countryId)
    .orderBy('name')
    .get();

  const regions = [];
  snapshot.forEach((doc) => {
    regions.push({ id: doc.id, ...doc.data() });
  });
  return regions;
};

export const getRegionById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const createRegion = async (data) => {
  const validation = validateRegion(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const formatted = formatRegion(data);
  const docRef = await collection.add(formatted);
  return { id: docRef.id, ...formatted };
};

export const updateRegion = async (id, data) => {
  const existing = await getRegionById(id);
  if (!existing) throw new Error('Region not found');

  const formatted = formatRegion({ ...existing, ...data });
  await collection.doc(id).update(formatted);
  return { id, ...formatted };
};

export const deleteRegion = async (id) => {
  const existing = await getRegionById(id);
  if (!existing) throw new Error('Region not found');
  await collection.doc(id).delete();
  return { id, deleted: true };
};

export const batchCreateRegions = async (regionsData) => {
  const batch = db.batch();
  const results = [];

  for (const data of regionsData) {
    const formatted = formatRegion(data);
    const docRef = collection.doc();
    batch.set(docRef, formatted);
    results.push({ id: docRef.id, ...formatted });
  }

  await batch.commit();
  return results;
};

export default {
  getAllRegions,
  getRegionsByCountry,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  batchCreateRegions,
};
