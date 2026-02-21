import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { formatFood, validateFood } from '../models/Food.js';

const collection = db.collection(COLLECTIONS.FOODS);

/**
 * Get all foods with filters
 */
export const getAllFoods = async ({
  page = 1,
  limit = 20,
  countryId = '',
  tribeId = '',
  category = '',
  targetAudience = '',
  difficulty = '',
  search = '',
} = {}) => {
  let query = collection.orderBy('name');

  if (countryId) {
    query = collection.where('countryId', '==', countryId).orderBy('name');
  } else if (tribeId) {
    query = collection.where('tribeId', '==', tribeId).orderBy('name');
  } else if (category) {
    query = collection.where('categories', 'array-contains', category).orderBy('name');
  } else if (targetAudience) {
    query = collection.where('targetAudience', 'array-contains', targetAudience).orderBy('name');
  } else if (difficulty) {
    query = collection.where('difficulty', '==', difficulty).orderBy('name');
  } else if (search) {
    const end = search.slice(0, -1) + String.fromCharCode(search.charCodeAt(search.length - 1) + 1);
    query = collection
      .where('name', '>=', search)
      .where('name', '<', end)
      .orderBy('name');
  }

  const snapshot = await query.limit(limit).offset((page - 1) * limit).get();

  const foods = [];
  snapshot.forEach((doc) => {
    foods.push({ id: doc.id, ...doc.data() });
  });

  return { foods, pagination: { page, limit } };
};

/**
 * Get foods by country
 */
export const getFoodsByCountry = async (countryId, { page = 1, limit = 20 } = {}) => {
  const snapshot = await collection
    .where('countryId', '==', countryId)
    .orderBy('name')
    .limit(limit)
    .offset((page - 1) * limit)
    .get();

  const foods = [];
  snapshot.forEach((doc) => {
    foods.push({ id: doc.id, ...doc.data() });
  });
  return foods;
};

/**
 * Get foods by tribe
 */
export const getFoodsByTribe = async (tribeId, { page = 1, limit = 20 } = {}) => {
  const snapshot = await collection
    .where('tribeId', '==', tribeId)
    .orderBy('name')
    .limit(limit)
    .offset((page - 1) * limit)
    .get();

  const foods = [];
  snapshot.forEach((doc) => {
    foods.push({ id: doc.id, ...doc.data() });
  });
  return foods;
};

/**
 * Get foods for university students (quick, budget-friendly)
 */
export const getFoodsForStudents = async ({ page = 1, limit = 20 } = {}) => {
  const snapshot = await collection
    .where('targetAudience', 'array-contains', 'university-students')
    .orderBy('name')
    .limit(limit)
    .offset((page - 1) * limit)
    .get();

  const foods = [];
  snapshot.forEach((doc) => {
    foods.push({ id: doc.id, ...doc.data() });
  });
  return foods;
};

/**
 * Get foods for young professionals
 */
export const getFoodsForProfessionals = async ({ page = 1, limit = 20 } = {}) => {
  const snapshot = await collection
    .where('targetAudience', 'array-contains', 'young-professionals')
    .orderBy('name')
    .limit(limit)
    .offset((page - 1) * limit)
    .get();

  const foods = [];
  snapshot.forEach((doc) => {
    foods.push({ id: doc.id, ...doc.data() });
  });
  return foods;
};

/**
 * Get featured foods
 */
export const getFeaturedFoods = async (limit = 10) => {
  const snapshot = await collection
    .where('isFeatured', '==', true)
    .orderBy('rating', 'desc')
    .limit(limit)
    .get();

  const foods = [];
  snapshot.forEach((doc) => {
    foods.push({ id: doc.id, ...doc.data() });
  });
  return foods;
};

/**
 * Get a single food by ID
 */
export const getFoodById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;

  // Increment view count
  await collection.doc(id).update({
    viewCount: (doc.data().viewCount || 0) + 1,
  });

  return { id: doc.id, ...doc.data() };
};

/**
 * Create a food
 */
export const createFood = async (data) => {
  const validation = validateFood(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const formatted = formatFood(data);
  const docRef = await collection.add(formatted);

  // Update country food count
  if (formatted.countryId) {
    const countryRef = db.collection(COLLECTIONS.COUNTRIES).doc(formatted.countryId);
    const countryDoc = await countryRef.get();
    if (countryDoc.exists) {
      await countryRef.update({
        foodCount: (countryDoc.data().foodCount || 0) + 1,
      });
    }
  }

  return { id: docRef.id, ...formatted };
};

/**
 * Update a food
 */
export const updateFood = async (id, data) => {
  const existing = await getFoodById(id);
  if (!existing) throw new Error('Food not found');

  const formatted = formatFood({ ...existing, ...data });
  await collection.doc(id).update(formatted);
  return { id, ...formatted };
};

/**
 * Delete a food
 */
export const deleteFood = async (id) => {
  const existing = await collection.doc(id).get();
  if (!existing.exists) throw new Error('Food not found');

  const foodData = existing.data();
  await collection.doc(id).delete();

  // Decrement country food count
  if (foodData.countryId) {
    const countryRef = db.collection(COLLECTIONS.COUNTRIES).doc(foodData.countryId);
    const countryDoc = await countryRef.get();
    if (countryDoc.exists) {
      const currentCount = countryDoc.data().foodCount || 0;
      await countryRef.update({
        foodCount: Math.max(0, currentCount - 1),
      });
    }
  }

  return { id, deleted: true };
};

/**
 * Batch create foods (for seeding)
 */
export const batchCreateFoods = async (foodsData) => {
  const BATCH_SIZE = 500; // Firestore batch limit
  const results = [];

  for (let i = 0; i < foodsData.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = foodsData.slice(i, i + BATCH_SIZE);

    for (const data of chunk) {
      const formatted = formatFood(data);
      const docRef = collection.doc();
      batch.set(docRef, formatted);
      results.push({ id: docRef.id, ...formatted });
    }

    await batch.commit();
  }

  return results;
};

export default {
  getAllFoods,
  getFoodsByCountry,
  getFoodsByTribe,
  getFoodsForStudents,
  getFoodsForProfessionals,
  getFeaturedFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  batchCreateFoods,
};
