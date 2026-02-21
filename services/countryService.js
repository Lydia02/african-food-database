import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { formatCountry, validateCountry } from '../models/Country.js';

const collection = db.collection(COLLECTIONS.COUNTRIES);

/**
 * Get all countries (with optional pagination)
 */
export const getAllCountries = async ({ page = 1, limit = 54, search = '' } = {}) => {
  let query = collection.orderBy('name');

  if (search) {
    // Firestore prefix search
    const end = search.slice(0, -1) + String.fromCharCode(search.charCodeAt(search.length - 1) + 1);
    query = collection
      .where('name', '>=', search)
      .where('name', '<', end)
      .orderBy('name');
  }

  const snapshot = await query.limit(limit).offset((page - 1) * limit).get();

  const countries = [];
  snapshot.forEach((doc) => {
    countries.push({ id: doc.id, ...doc.data() });
  });

  // Get total count
  const countSnapshot = await collection.count().get();
  const total = countSnapshot.data().count;

  return {
    countries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single country by ID
 */
export const getCountryById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

/**
 * Get country by code (e.g. "NG")
 */
export const getCountryByCode = async (code) => {
  const snapshot = await collection.where('code', '==', code.toUpperCase()).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

/**
 * Create a new country
 */
export const createCountry = async (data) => {
  const validation = validateCountry(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const formatted = formatCountry(data);

  // Check for duplicate code
  const existing = await getCountryByCode(formatted.code);
  if (existing) {
    throw new Error(`Country with code ${formatted.code} already exists`);
  }

  const docRef = await collection.add(formatted);
  return { id: docRef.id, ...formatted };
};

/**
 * Update a country
 */
export const updateCountry = async (id, data) => {
  const existing = await getCountryById(id);
  if (!existing) throw new Error('Country not found');

  const formatted = formatCountry({ ...existing, ...data });
  await collection.doc(id).update(formatted);
  return { id, ...formatted };
};

/**
 * Delete a country
 */
export const deleteCountry = async (id) => {
  const existing = await getCountryById(id);
  if (!existing) throw new Error('Country not found');
  await collection.doc(id).delete();
  return { id, deleted: true };
};

/**
 * Batch create countries (for seeding)
 */
export const batchCreateCountries = async (countriesData) => {
  const batch = db.batch();
  const results = [];

  for (const data of countriesData) {
    const formatted = formatCountry(data);
    const docRef = collection.doc();
    batch.set(docRef, formatted);
    results.push({ id: docRef.id, ...formatted });
  }

  await batch.commit();
  return results;
};

export default {
  getAllCountries,
  getCountryById,
  getCountryByCode,
  createCountry,
  updateCountry,
  deleteCountry,
  batchCreateCountries,
};
