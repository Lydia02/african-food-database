/**
 * Enrichment Service
 * Auto-enriches existing foods in Firestore with nutrition data
 * from USDA FoodData Central and Open Food Facts.
 *
 * Strategies:
 *  - Match by food name → USDA search → pick best match
 *  - Fall back to Open Food Facts
 *  - Merge nutrition into existing food docs without overwriting user data
 */
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import {
  searchUSDA,
  searchOpenFoodFacts,
  getWikipediaFoodInfo,
} from './externalApiService.js';
import { lookupNutrition } from '../data/nutritionReference.js';
import { inferManualNutritionProfile } from './manualFallbackService.js';

const foods = db.collection(COLLECTIONS.FOODS);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// USDA circuit breaker — once rate-limited, skip USDA for a cooldown
let usdaDisabledUntil = 0;
const USDA_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown after 429

const isUsdaAvailable = () => Date.now() > usdaDisabledUntil;
const disableUsda = () => {
  usdaDisabledUntil = Date.now() + USDA_COOLDOWN_MS;
  console.warn(`  ⛔ USDA rate-limited — disabling for ${USDA_COOLDOWN_MS / 60000} minutes`);
};

// ─── Nutrition Enrichment ──────────────────────────────────────

/**
 * Enrich a single food document with nutrition data.
 * Strategy (in order):
 *   1. Local African food reference (instant, ~150 dishes)
 *   2. Open Food Facts (free, no rate limit)
 *   3. USDA FoodData Central (rate-limited)
 * Returns the enrichment result (or null if no match).
 */
export const enrichFoodNutrition = async (foodId) => {
  const doc = await foods.doc(foodId).get();
  if (!doc.exists) throw new Error('Food not found');

  const food = doc.data();
  const query = food.name.replace(/\(.*?\)/g, '').trim(); // Strip parenthetical

  let nutrition = null;
  let source = '';

  // 1. Try local African food reference first (instant, no API call)
  const localMatch = lookupNutrition(query);
  if (localMatch) {
    nutrition = localMatch;
    source = localMatch.source;
  }

  // 2. Try Open Food Facts (free, no rate limit)
  if (!nutrition) {
    try {
      const off = await searchOpenFoodFacts(query, { pageSize: 5 });
      if (off.products.length > 0) {
        const withCalories = off.products.find(
          (p) => p.nutritionPer100g?.calories && p.nutritionPer100g.calories > 0
        );
        const best = withCalories || off.products[0];
        if (best.nutritionPer100g?.calories && best.nutritionPer100g.calories > 0) {
          nutrition = best.nutritionPer100g;
          source = 'openfoodfacts';
        }
      }
    } catch (err) {
      console.warn(`OpenFoodFacts lookup failed for "${query}": ${err.message}`);
    }
  }

  // 3. Fall back to USDA (rate-limited — use sparingly)
  if (!nutrition && isUsdaAvailable()) {
    try {
      const usda = await searchUSDA(query, { pageSize: 3 });
      if (usda.foods.length > 0) {
        const best = usda.foods[0];
        nutrition = {};
        for (const [key, val] of Object.entries(best.nutrition)) {
          if (val) nutrition[key] = `${val.value}${val.unit?.toLowerCase() || ''}`;
        }
        source = 'usda';
      }
    } catch (err) {
      console.warn(`USDA lookup failed for "${query}": ${err.message}`);
      if (err.message.includes('429')) disableUsda();
    }
  }

  // 4. Manual fallback profile for traditional dishes not found in product databases
  if (!nutrition) {
    nutrition = inferManualNutritionProfile({
      name: food.name,
      tags: food.tags || [],
      categories: food.categories || [],
    });
    source = 'pantrypal-manual-profile';
  }

  if (!nutrition) return null;

  // 3. Merge into Firestore (don't overwrite existing non-empty values)
  const existing = food.nutritionInfo || {};
  const merged = {
    calories: existing.calories || Number(String(nutrition.calories).replace(/[^\d.]/g, '')) || 0,
    protein: existing.protein || nutrition.protein || '',
    carbs: existing.carbs || nutrition.carbs || '',
    fat: existing.fat || nutrition.fat || '',
    fiber: nutrition.fiber || '',
    sodium: nutrition.sodium || '',
    sugar: nutrition.sugar || '',
    iron: nutrition.iron || '',
    calcium: nutrition.calcium || '',
    vitaminA: nutrition.vitaminA || '',
    vitaminC: nutrition.vitaminC || '',
  };

  await foods.doc(foodId).update({
    nutritionInfo: merged,
    nutritionSource: source,
    nutritionEnrichedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return {
    foodId,
    name: food.name,
    nutritionInfo: merged,
    source,
  };
};

/**
 * Bulk-enrich ALL foods that have empty/zero nutrition data.
 * Goes through every food doc, checks if nutritionInfo is empty, enriches it.
 * Uses OpenFoodFacts first (no limit), then USDA fallback (rate-limited).
 */
export const bulkEnrichNutrition = async ({ dryRun = false, batchSize = 10 } = {}) => {
  const snapshot = await foods.get();
  const results = { enriched: [], skipped: [], failed: [] };

  const docs = [];
  snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));

  console.log(`📊 Found ${docs.length} foods to check`);

  // Filter to foods needing enrichment
  const needsEnrichment = docs.filter((d) => {
    const n = d.nutritionInfo || {};
    return !n.calories || n.calories === 0;
  });

  console.log(`🔍 ${needsEnrichment.length} foods need nutrition enrichment`);
  console.log(`ℹ️  Strategy: Open Food Facts first (free), USDA fallback (rate-limited)`);

  let usdaCallCount = 0;

  for (let i = 0; i < needsEnrichment.length; i++) {
    const food = needsEnrichment[i];
    try {
      if (dryRun) {
        results.skipped.push({ id: food.id, name: food.name, reason: 'dry-run' });
        continue;
      }

      const result = await enrichFoodNutrition(food.id);
      if (result) {
        results.enriched.push(result);
        if (result.source === 'usda') usdaCallCount++;
        console.log(`  ✅ [${i + 1}/${needsEnrichment.length}] ${food.name} → ${result.source}`);
      } else {
        results.skipped.push({ id: food.id, name: food.name, reason: 'no-match' });
        console.log(`  ⏭️  [${i + 1}/${needsEnrichment.length}] ${food.name} → no match`);
      }

      // Polite delay between calls (500ms)
      await sleep(500);

      // Longer pause every batch to avoid any rate limits
      if ((i + 1) % batchSize === 0) {
        console.log(`  ⏳ Pausing after batch of ${batchSize}... (USDA calls so far: ${usdaCallCount})`);
        await sleep(5000);
      }
    } catch (err) {
      results.failed.push({ id: food.id, name: food.name, error: err.message });
      console.log(`  ❌ [${i + 1}/${needsEnrichment.length}] ${food.name} → ${err.message}`);
    }
  }

  return {
    total: docs.length,
    needsEnrichment: needsEnrichment.length,
    enriched: results.enriched.length,
    skipped: results.skipped.length,
    failed: results.failed.length,
    usdaCalls: usdaCallCount,
    details: results,
  };
};

// ─── Wikipedia Description Enrichment ──────────────────────────

/**
 * Enrich a single food with Wikipedia description & image.
 */
export const enrichFoodFromWikipedia = async (foodId) => {
  const doc = await foods.doc(foodId).get();
  if (!doc.exists) throw new Error('Food not found');

  const food = doc.data();
  const query = food.name.replace(/\(.*?\)/g, '').trim();

  const wiki = await getWikipediaFoodInfo(query);
  if (!wiki) return null;

  const updates = { updatedAt: new Date().toISOString() };

  // Only fill in missing data
  if (!food.description && wiki.description) {
    // Take first 2 sentences as description
    const sentences = wiki.description.split('. ').slice(0, 2).join('. ');
    updates.description = sentences.endsWith('.') ? sentences : sentences + '.';
  }
  if (!food.imageUrl && wiki.imageUrl) {
    updates.imageUrl = wiki.imageUrl;
  }
  if (wiki.wikiUrl) {
    updates.wikiUrl = wiki.wikiUrl;
  }

  await foods.doc(foodId).update(updates);

  return { foodId, name: food.name, updates, source: 'wikipedia' };
};

/**
 * Bulk-enrich foods missing descriptions from Wikipedia.
 */
export const bulkEnrichFromWikipedia = async ({ dryRun = false } = {}) => {
  const snapshot = await foods.get();
  const results = { enriched: [], skipped: [], failed: [] };

  const docs = [];
  snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));

  const needsEnrichment = docs.filter(
    (d) => !d.description || d.description.length < 20 || !d.imageUrl
  );
  console.log(`📖 ${needsEnrichment.length}/${docs.length} foods need Wikipedia enrichment (description/image)`);

  for (let i = 0; i < needsEnrichment.length; i++) {
    const food = needsEnrichment[i];
    try {
      if (dryRun) {
        results.skipped.push({ id: food.id, name: food.name });
        continue;
      }

      const result = await enrichFoodFromWikipedia(food.id);
      if (result) {
        results.enriched.push(result);
        console.log(`  ✅ [${i + 1}/${needsEnrichment.length}] ${food.name}`);
      } else {
        results.skipped.push({ id: food.id, name: food.name, reason: 'no-wiki-page' });
      }

      await sleep(200);
    } catch (err) {
      results.failed.push({ id: food.id, name: food.name, error: err.message });
    }
  }

  return {
    total: docs.length,
    needsEnrichment: needsEnrichment.length,
    enriched: results.enriched.length,
    skipped: results.skipped.length,
    failed: results.failed.length,
    details: results,
  };
};

export default {
  enrichFoodNutrition,
  bulkEnrichNutrition,
  enrichFoodFromWikipedia,
  bulkEnrichFromWikipedia,
};
