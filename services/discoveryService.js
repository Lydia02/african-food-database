/**
 * Discovery Service
 * Finds NEW African dishes that aren't in our database yet.
 * Sources: Wikipedia categories, Open Food Facts, Spoonacular.
 *
 * The "gap finder" — compares external dishes against our Firestore foods
 * and returns only the ones we're missing.
 */
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import {
  discoverAfricanDishes,
  getWikipediaFoodInfo,
  searchOpenFoodFacts,
  searchSpoonacular,
} from './externalApiService.js';

const foods = db.collection(COLLECTIONS.FOODS);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Get all food names currently in Firestore (lowercased, for comparison).
 */
const getExistingFoodNames = async () => {
  const snapshot = await foods.select('name').get();
  const names = new Set();
  snapshot.forEach((doc) => {
    const name = doc.data().name?.toLowerCase().replace(/\(.*?\)/g, '').trim();
    if (name) names.add(name);
  });
  return names;
};

/**
 * Normalize a food title for comparison.
 */
const normalize = (title) =>
  title
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/cuisine|food|dish|recipe|list of/gi, '')
    .trim();

// ─── Discovery Quality Filters ────────────────────────────────

/** Patterns for Wikipedia articles that are NOT individual foods/dishes. */
const SKIP_PATTERNS = [
  // Meta / list pages
  /list of/i, /index of/i, /outline of/i, /category:/i,
  /template/i, /portal/i, /glossary/i, /history of/i,
  // Cuisine / culture overview articles
  /\bcuisine\b/i, /\bculture\b/i, /\bculinary\b/i,
  /food and drink/i, /agriculture/i, /\bcooking\b/i,
  /food industry/i, /food security/i, /food processing/i,
  // Geography / people / general
  /\bpeople\b/i, /\bethnic group/i, /\bdiaspora\b/i,
  /\beconomy of/i, /\breligion/i, /\bfestival\b/i,
  // Botanical / taxonomy style (genus species with lowercase second word)
  /^[A-Z][a-z]+ [a-z]+$/,      // e.g. "Amaranthus thunbergii"
  /^[A-Z][a-z]+dron\b/i,       // Ricinodendron
  /^[A-Z][a-z]+ceae\b/i,       // family names
  /\bvar\.\b/i, /\bsubsp\.\b/i, /\bsyn\.\b/i,
];

/** Non-African or too-generic items to exclude. */
const SKIP_KEYWORDS = new Set([
  'camel', 'cow lung', 'cow\'s trotter', 'cheese on toast',
  'fried plantain', 'okra', 'black-eyed pea', 'pilaf',
  'millet beer',  // too generic — we want specific brands/names
]);

/**
 * Score how likely a Wikipedia article is to be an actual African dish/food.
 * Uses Wikipedia categories to judge relevance.
 * Returns 0-100 (higher = more likely a real food).
 */
const foodConfidenceScore = (dish) => {
  let score = 50; // Base score

  const cats = (dish.wikiCategories || dish.categories || [])
    .map((c) => (typeof c === 'string' ? c : c.title || '').toLowerCase());
  const desc = (dish.description || '').toLowerCase();
  const title = (dish.title || '').toLowerCase();

  // Positive signals: food/dish/cuisine categories
  const foodSignals = [
    'foods', 'dishes', 'cuisine', 'stew', 'bread', 'soup',
    'porridge', 'beverage', 'drink', 'snack', 'dessert',
    'condiment', 'sauce', 'appetizer', 'street food', 'fermented',
  ];
  for (const sig of foodSignals) {
    if (cats.some((c) => c.includes(sig))) score += 10;
    if (desc.includes(sig)) score += 5;
  }

  // African region signals
  const africanSignals = [
    'africa', 'nigeria', 'ghana', 'kenya', 'ethiopia', 'morocco',
    'senegal', 'cameroon', 'south africa', 'egypt', 'algeria',
    'tunisia', 'tanzania', 'uganda', 'congo', 'mali', 'ivory coast',
    'madagascar', 'mozambique', 'zimbabwe', 'rwanda', 'sudan',
    'somalia', 'angola', 'yoruba', 'igbo', 'hausa', 'swahili',
    'berber', 'maghreb', 'sahel', 'west african', 'east african',
    'north african', 'southern african', 'central african',
  ];
  for (const sig of africanSignals) {
    if (cats.some((c) => c.includes(sig))) score += 8;
    if (desc.includes(sig)) score += 3;
  }

  // Negative signals
  const badSignals = ['plant', 'species', 'genus', 'family', 'taxonomy', 'botanical'];
  for (const sig of badSignals) {
    if (cats.some((c) => c.includes(sig))) score -= 15;
    if (desc.includes(sig)) score -= 8;
  }

  // Title looks like binomial nomenclature (Genus species)
  if (/^[A-Z][a-z]+ [a-z]{4,}$/.test(dish.title || '')) score -= 30;

  // Description mentions "is a dish" or "is a food" → strong positive
  if (/is a\s+(traditional\s+)?(\w+\s+)*(dish|food|stew|soup|bread|drink|beverage|snack|porridge|condiment|sauce|candy|cake|pastry|flatbread|pancake)/i.test(desc)) {
    score += 25;
  }

  return Math.max(0, Math.min(100, score));
};

/**
 * Discover African dishes from Wikipedia that we don't have yet.
 * Returns a list of missing dishes with descriptions & images,
 * filtered by food-confidence scoring to exclude non-food articles.
 *
 * @param {number} minConfidence — minimum food-confidence score (0-100, default 55)
 */
export const discoverMissingDishes = async ({
  depth = 2,
  maxResults = 300,
  enrich = true,
  minConfidence = 55,
} = {}) => {
  console.log('🔍 Fetching existing foods from Firestore...');
  const existing = await getExistingFoodNames();
  console.log(`📦 Found ${existing.size} existing foods`);

  console.log('🌍 Discovering African dishes from Wikipedia...');
  const wikiDishes = await discoverAfricanDishes({ depth, maxResults });
  console.log(`📄 Found ${wikiDishes.length} Wikipedia articles`);

  // Phase 1: Fast filter using patterns + keywords
  const missing = wikiDishes.filter((dish) => {
    const normalized = normalize(dish.title);
    if (normalized.length < 3) return false;
    if (SKIP_PATTERNS.some((p) => p.test(dish.title))) return false;
    if (SKIP_KEYWORDS.has(normalized)) return false;
    if (existing.has(normalized)) return false;
    // Also check partial match
    for (const existName of existing) {
      if (existName.includes(normalized) || normalized.includes(existName)) return false;
    }
    return true;
  });

  console.log(`🆕 ${missing.length} new dishes after pattern filter`);

  // Phase 2: Enrich top results with Wikipedia data and score them
  if (enrich && missing.length > 0) {
    console.log('📖 Enriching & scoring dishes with Wikipedia data...');
    const enriched = [];
    const limit = Math.min(missing.length, 200);

    for (let i = 0; i < limit; i++) {
      try {
        const info = await getWikipediaFoodInfo(missing[i].title);
        if (info && info.description) {
          const dish = {
            ...missing[i],
            description: info.description.split('. ').slice(0, 3).join('. ') + '.',
            imageUrl: info.imageUrl || '',
            wikiCategories: info.categories || [],
          };
          dish.confidence = foodConfidenceScore(dish);
          enriched.push(dish);
        } else {
          const dish = { ...missing[i], confidence: 40 }; // Low score for no-description
          enriched.push(dish);
        }
        await sleep(150);
      } catch {
        enriched.push({ ...missing[i], confidence: 30 });
      }
    }

    // Phase 3: Filter by confidence and sort best first
    const highConfidence = enriched
      .filter((d) => d.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence);

    console.log(`✅ ${highConfidence.length} dishes passed confidence filter (≥${minConfidence})`);
    return highConfidence;
  }

  return missing;
};

/**
 * Search all external sources for a food query and return combined results.
 * Useful when a user searches and gets no results — we check external APIs.
 */
export const searchExternalSources = async (query) => {
  const results = { query, sources: [], totalResults: 0 };

  // Run all searches in parallel
  const [offResult, usdaResult, spoonResult, wikiResult] = await Promise.allSettled([
    searchOpenFoodFacts(query, { pageSize: 5 }),
    (async () => {
      const { searchUSDA } = await import('./externalApiService.js');
      return searchUSDA(query, { pageSize: 5 });
    })(),
    searchSpoonacular(query, { number: 5 }),
    getWikipediaFoodInfo(query),
  ]);

  if (offResult.status === 'fulfilled' && offResult.value.products.length > 0) {
    results.sources.push({
      name: 'Open Food Facts',
      results: offResult.value.products,
      count: offResult.value.count,
    });
    results.totalResults += offResult.value.products.length;
  }

  if (usdaResult.status === 'fulfilled' && usdaResult.value.foods.length > 0) {
    results.sources.push({
      name: 'USDA FoodData Central',
      results: usdaResult.value.foods,
      count: usdaResult.value.totalHits,
    });
    results.totalResults += usdaResult.value.foods.length;
  }

  if (spoonResult.status === 'fulfilled' && spoonResult.value.results?.length > 0) {
    results.sources.push({
      name: 'Spoonacular',
      results: spoonResult.value.results,
      count: spoonResult.value.totalResults,
    });
    results.totalResults += spoonResult.value.results.length;
  }

  if (wikiResult.status === 'fulfilled' && wikiResult.value) {
    results.sources.push({
      name: 'Wikipedia',
      results: [wikiResult.value],
      count: 1,
    });
    results.totalResults += 1;
  }

  return results;
};

/**
 * Auto-import a discovered dish into Firestore as a new food.
 * Takes a dish object (from discoverMissingDishes) and creates a food doc.
 */
export const importDiscoveredDish = async (dish, { countryId = '', countryName = '', region = '' } = {}) => {
  const formatted = {
    name: dish.title || dish.name,
    localName: '',
    description: dish.description || '',
    countryId,
    countryName,
    region,
    categories: ['traditional'],
    targetAudience: ['everyone'],
    imageUrl: dish.imageUrl || '',
    images: [],
    tags: [
      dish.title?.toLowerCase(),
      ...(dish.wikiCategories || []).map((c) => c.toLowerCase()),
    ].filter(Boolean),
    difficulty: 'medium',
    prepTime: 0,
    cookTime: 0,
    totalTime: 0,
    servings: 0,
    estimatedCost: '',
    ingredients: [],
    instructions: [],
    nutritionInfo: { calories: 0, protein: '', carbs: '', fat: '' },
    tips: [],
    variations: [],
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    viewCount: 0,
    sourceUrl: dish.wikiUrl || '',
    source: 'wikipedia-discovery',
    confidence: dish.confidence || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const docRef = await foods.add(formatted);

  // Increment country food count
  if (countryId) {
    const countryRef = db.collection(COLLECTIONS.COUNTRIES).doc(countryId);
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
 * Bulk-import discovered dishes into Firestore.
 * Runs discoverMissingDishes, applies confidence filter, and imports in batches.
 *
 * @param {number} minConfidence — minimum food-confidence score (default 60)
 * @param {number} limit — max number to import (default 50)
 * @param {boolean} dryRun — if true, just report what would be imported
 */
export const bulkImportDiscoveries = async ({
  minConfidence = 60,
  limit = 50,
  depth = 2,
  dryRun = false,
} = {}) => {
  const dishes = await discoverMissingDishes({
    depth,
    maxResults: 500,
    enrich: true,
    minConfidence,
  });

  const toImport = dishes.slice(0, limit);
  console.log(`\n📥 ${dryRun ? 'DRY RUN — ' : ''}Importing ${toImport.length} dishes (confidence ≥ ${minConfidence})\n`);

  const results = { imported: [], failed: [] };

  for (let i = 0; i < toImport.length; i++) {
    const dish = toImport[i];
    try {
      if (dryRun) {
        console.log(`  📋 [${i + 1}/${toImport.length}] ${dish.title} (confidence: ${dish.confidence})`);
        results.imported.push({ title: dish.title, confidence: dish.confidence });
        continue;
      }

      // Try to guess country/region from Wikipedia categories
      const meta = guessCountryFromCategories(dish.wikiCategories || []);

      const imported = await importDiscoveredDish(dish, meta);
      results.imported.push({ id: imported.id, title: dish.title, confidence: dish.confidence });
      console.log(`  ✅ [${i + 1}/${toImport.length}] ${dish.title} (${dish.confidence})`);
      await sleep(100);
    } catch (err) {
      results.failed.push({ title: dish.title, error: err.message });
      console.log(`  ❌ [${i + 1}/${toImport.length}] ${dish.title} → ${err.message}`);
    }
  }

  return {
    total: dishes.length,
    imported: results.imported.length,
    failed: results.failed.length,
    details: results,
  };
};

/**
 * Guess country/region from Wikipedia category names.
 */
const guessCountryFromCategories = (categories) => {
  const cats = categories.map((c) => (typeof c === 'string' ? c : '').toLowerCase());
  const map = {
    'nigerian': { countryName: 'Nigeria', region: 'West Africa' },
    'ghanaian': { countryName: 'Ghana', region: 'West Africa' },
    'senegalese': { countryName: 'Senegal', region: 'West Africa' },
    'ivorian': { countryName: 'Ivory Coast', region: 'West Africa' },
    'malian': { countryName: 'Mali', region: 'West Africa' },
    'cameroonian': { countryName: 'Cameroon', region: 'Central Africa' },
    'congolese': { countryName: 'DR Congo', region: 'Central Africa' },
    'kenyan': { countryName: 'Kenya', region: 'East Africa' },
    'ethiopian': { countryName: 'Ethiopia', region: 'East Africa' },
    'tanzanian': { countryName: 'Tanzania', region: 'East Africa' },
    'ugandan': { countryName: 'Uganda', region: 'East Africa' },
    'rwandan': { countryName: 'Rwanda', region: 'East Africa' },
    'somali': { countryName: 'Somalia', region: 'East Africa' },
    'south african': { countryName: 'South Africa', region: 'Southern Africa' },
    'zimbabwean': { countryName: 'Zimbabwe', region: 'Southern Africa' },
    'mozambican': { countryName: 'Mozambique', region: 'Southern Africa' },
    'angolan': { countryName: 'Angola', region: 'Southern Africa' },
    'malagasy': { countryName: 'Madagascar', region: 'Southern Africa' },
    'moroccan': { countryName: 'Morocco', region: 'North Africa' },
    'egyptian': { countryName: 'Egypt', region: 'North Africa' },
    'tunisian': { countryName: 'Tunisia', region: 'North Africa' },
    'algerian': { countryName: 'Algeria', region: 'North Africa' },
    'sudanese': { countryName: 'Sudan', region: 'North Africa' },
    'libyan': { countryName: 'Libya', region: 'North Africa' },
    'west african': { countryName: '', region: 'West Africa' },
    'east african': { countryName: '', region: 'East Africa' },
    'north african': { countryName: '', region: 'North Africa' },
    'southern african': { countryName: '', region: 'Southern Africa' },
    'central african': { countryName: '', region: 'Central Africa' },
  };

  for (const [keyword, meta] of Object.entries(map)) {
    if (cats.some((c) => c.includes(keyword))) {
      return meta;
    }
  }
  return { countryName: '', region: '' };
};

export default {
  discoverMissingDishes,
  searchExternalSources,
  importDiscoveredDish,
  bulkImportDiscoveries,
  foodConfidenceScore,
};
