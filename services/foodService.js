import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { formatFood, validateFood } from '../models/Food.js';
import * as cache from './foodCacheService.js';

const collection = db.collection(COLLECTIONS.FOODS);

// ─── Read helpers (all served from in-memory cache) ───────────────────────────

const paginate = (arr, page, limit) => {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
};

/**
 * Get all foods with filters — served from cache, zero Firestore reads.
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
  let foods = await cache.getAll();

  if (countryId)      foods = foods.filter((f) => f.countryId === countryId);
  if (tribeId)        foods = foods.filter((f) => f.tribeId === tribeId);
  if (category)       foods = foods.filter((f) => (f.categories || []).includes(category));
  if (targetAudience) foods = foods.filter((f) => (f.targetAudience || []).includes(targetAudience));
  if (difficulty)     foods = foods.filter((f) => f.difficulty === difficulty);
  if (search) {
    const q = search.toLowerCase();
    foods = foods.filter((f) => (f.name || '').toLowerCase().includes(q));
  }

  const total = foods.length;
  return {
    foods: paginate(foods, page, limit),
    pagination: { page, limit, total },
  };
};

/**
 * Get foods by country — served from cache.
 */
export const getFoodsByCountry = async (countryId, { page = 1, limit = 20 } = {}) => {
  const all = await cache.getAll();
  const filtered = all.filter((f) => f.countryId === countryId);
  return paginate(filtered, page, limit);
};

/**
 * Get foods by tribe — served from cache.
 */
export const getFoodsByTribe = async (tribeId, { page = 1, limit = 20 } = {}) => {
  const all = await cache.getAll();
  const filtered = all.filter((f) => f.tribeId === tribeId);
  return paginate(filtered, page, limit);
};

/**
 * Get foods for university students — served from cache.
 */
export const getFoodsForStudents = async ({ page = 1, limit = 20 } = {}) => {
  const all = await cache.getAll();
  const filtered = all.filter((f) => (f.targetAudience || []).includes('university-students'));
  return paginate(filtered, page, limit);
};

/**
 * Get foods for young professionals — served from cache.
 */
export const getFoodsForProfessionals = async ({ page = 1, limit = 20 } = {}) => {
  const all = await cache.getAll();
  const filtered = all.filter((f) => (f.targetAudience || []).includes('young-professionals'));
  return paginate(filtered, page, limit);
};

/**
 * Get featured foods — served from cache.
 */
export const getFeaturedFoods = async (limit = 10) => {
  const all = await cache.getAll();
  return all
    .filter((f) => f.isFeatured === true)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
};

/**
 * Get a single food by ID — served from cache.
 * View count increment is fire-and-forget (non-blocking, doesn't burn quota).
 */
export const getFoodById = async (id) => {
  const food = await cache.getById(id);
  if (!food) return null;

  // Increment view count in the background — don't await it
  const newCount = (food.viewCount || 0) + 1;
  collection.doc(id).update({ viewCount: newCount }).catch(() => {});
  // Update cache immediately so the returned doc reflects the new count
  cache.upsert(id, { ...food, viewCount: newCount });

  return { ...food, viewCount: newCount };
};

// ─── Write operations (Firestore + cache update) ──────────────────────────────

/**
 * Create a food — writes to Firestore and inserts into cache.
 */
export const createFood = async (data) => {
  const validation = validateFood(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const formatted = formatFood(data);
  const docRef = await collection.add(formatted);
  const newFood = { id: docRef.id, ...formatted };

  // Update cache immediately
  cache.upsert(docRef.id, formatted);

  // Update country food count (fire-and-forget)
  if (formatted.countryId) {
    const countryRef = db.collection(COLLECTIONS.COUNTRIES).doc(formatted.countryId);
    countryRef.get().then((countryDoc) => {
      if (countryDoc.exists) {
        countryRef.update({ foodCount: (countryDoc.data().foodCount || 0) + 1 }).catch(() => {});
      }
    }).catch(() => {});
  }

  return newFood;
};

/**
 * Update a food — writes to Firestore and updates cache.
 */
export const updateFood = async (id, data) => {
  const existing = await cache.getById(id);
  if (!existing) throw new Error('Food not found');

  const formatted = formatFood({ ...existing, ...data });
  await collection.doc(id).update(formatted);
  cache.upsert(id, formatted);
  return { id, ...formatted };
};

/**
 * Delete a food — deletes from Firestore and removes from cache.
 */
export const deleteFood = async (id) => {
  const existing = await cache.getById(id);
  if (!existing) throw new Error('Food not found');

  await collection.doc(id).delete();
  cache.remove(id);

  // Decrement country food count (fire-and-forget)
  if (existing.countryId) {
    const countryRef = db.collection(COLLECTIONS.COUNTRIES).doc(existing.countryId);
    countryRef.get().then((countryDoc) => {
      if (countryDoc.exists) {
        const current = countryDoc.data().foodCount || 0;
        countryRef.update({ foodCount: Math.max(0, current - 1) }).catch(() => {});
      }
    }).catch(() => {});
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
