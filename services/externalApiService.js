/**
 * External API Service
 * Integrates with Open Food Facts, USDA FoodData Central, Wikipedia,
 * and Spoonacular for food data enrichment & discovery.
 *
 * All APIs used have free tiers / no key required.
 */

const UA = 'PantryPal-AfricanFoodDB/1.0 (contact@pantrypal.dev)';

// ─── Helpers ───────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchJson = async (url, headers = {}) => {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json', ...headers },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
};

/**
 * Fetch JSON with retry + exponential backoff for 429 / 5xx errors.
 * Default: 3 retries, starting at 30s wait (doubles each retry).
 */
const fetchJsonWithRetry = async (url, { maxRetries = 3, baseDelay = 30_000, headers = {} } = {}) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json', ...headers },
      });

      if (res.ok) return res.json();

      // Retry on 429 (rate limited) or 5xx (server error)
      if ((res.status === 429 || res.status >= 500) && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`  ⏳ HTTP ${res.status} — retrying in ${(delay / 1000).toFixed(0)}s (attempt ${attempt + 1}/${maxRetries})`);
        await sleep(delay);
        continue;
      }

      throw new Error(`HTTP ${res.status}: ${url}`);
    } catch (err) {
      if (err.message.startsWith('HTTP ') || attempt >= maxRetries) throw err;
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`  ⏳ Fetch error — retrying in ${(delay / 1000).toFixed(0)}s: ${err.message}`);
      await sleep(delay);
    }
  }
};

// ════════════════════════════════════════════════════════════════
//  1. OPEN FOOD FACTS  (100 % free, no key)
//     https://wiki.openfoodfacts.org/API
// ════════════════════════════════════════════════════════════════

/**
 * Search Open Food Facts for a food product.
 * Returns top matches with nutrition data.
 */
export const searchOpenFoodFacts = async (query, { page = 1, pageSize = 10 } = {}) => {
  const url = new URL('https://world.openfoodfacts.org/cgi/search.pl');
  url.searchParams.set('search_terms', query);
  url.searchParams.set('search_simple', '1');
  url.searchParams.set('action', 'process');
  url.searchParams.set('json', '1');
  url.searchParams.set('page', page);
  url.searchParams.set('page_size', pageSize);
  // NOTE: Removed restrictive category tag filter that was limiting matches.
  // Open Food Facts text search is sufficient for finding African foods.

  const data = await fetchJson(url.toString());

  return {
    count: data.count || 0,
    products: (data.products || []).map((p) => ({
      name: p.product_name || '',
      brand: p.brands || '',
      categories: p.categories || '',
      imageUrl: p.image_front_url || p.image_url || '',
      nutritionPer100g: {
        calories: p.nutriments?.['energy-kcal_100g'] || 0,
        protein: `${p.nutriments?.proteins_100g || 0}g`,
        carbs: `${p.nutriments?.carbohydrates_100g || 0}g`,
        fat: `${p.nutriments?.fat_100g || 0}g`,
        fiber: `${p.nutriments?.fiber_100g || 0}g`,
        sodium: `${p.nutriments?.sodium_100g || 0}mg`,
        sugar: `${p.nutriments?.sugars_100g || 0}g`,
      },
      nutriscore: p.nutriscore_grade || '',
      ingredients: p.ingredients_text || '',
      origin: p.origins || '',
      barcode: p.code || '',
      source: 'openfoodfacts',
    })),
  };
};

/**
 * Get a specific product from Open Food Facts by barcode.
 */
export const getOpenFoodFactsProduct = async (barcode) => {
  const data = await fetchJson(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
  );
  if (data.status !== 1) return null;

  const p = data.product;
  return {
    name: p.product_name || '',
    brand: p.brands || '',
    categories: p.categories || '',
    imageUrl: p.image_front_url || '',
    nutritionPer100g: {
      calories: p.nutriments?.['energy-kcal_100g'] || 0,
      protein: `${p.nutriments?.proteins_100g || 0}g`,
      carbs: `${p.nutriments?.carbohydrates_100g || 0}g`,
      fat: `${p.nutriments?.fat_100g || 0}g`,
      fiber: `${p.nutriments?.fiber_100g || 0}g`,
      sodium: `${p.nutriments?.sodium_100g || 0}mg`,
      sugar: `${p.nutriments?.sugars_100g || 0}g`,
    },
    nutriscore: p.nutriscore_grade || '',
    ingredients: p.ingredients_text || '',
    origin: p.origins || '',
    barcode: p.code || '',
    source: 'openfoodfacts',
  };
};

// ════════════════════════════════════════════════════════════════
//  2. USDA FoodData Central  (free with API key)
//     https://fdc.nal.usda.gov/api-guide
//     DEMO_KEY: ~30 req/IP/hour (very limited!)
//     Registered key: 1000 req/hr (free sign-up)
//     Sign up: https://fdc.nal.usda.gov/api-key-signup.html
// ════════════════════════════════════════════════════════════════

const USDA_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1';

/**
 * Search USDA for nutrition information.
 * Uses fetchJsonWithRetry to handle 429 rate limiting.
 */
export const searchUSDA = async (query, { pageSize = 5 } = {}) => {
  const url = `${USDA_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&api_key=${USDA_KEY}`;
  const data = await fetchJsonWithRetry(url, { maxRetries: 1, baseDelay: 10_000 });

  return {
    totalHits: data.totalHits || 0,
    foods: (data.foods || []).map((f) => {
      // Extract key nutrients
      const get = (name) => {
        const n = f.foodNutrients?.find((fn) => fn.nutrientName === name);
        return n ? { value: n.value, unit: n.unitName } : null;
      };

      return {
        fdcId: f.fdcId,
        name: f.description || '',
        category: f.foodCategory || '',
        dataType: f.dataType || '',
        nutrition: {
          calories: get('Energy'),
          protein: get('Protein'),
          carbs: get('Carbohydrate, by difference'),
          fat: get('Total lipid (fat)'),
          fiber: get('Fiber, total dietary'),
          sodium: get('Sodium, Na'),
          sugar: get('Sugars, total including NLEA'),
          iron: get('Iron, Fe'),
          calcium: get('Calcium, Ca'),
          vitaminA: get('Vitamin A, RAE'),
          vitaminC: get('Vitamin C, total ascorbic acid'),
        },
        source: 'usda',
      };
    }),
  };
};

/**
 * Get detailed nutrition for a specific USDA food ID.
 */
export const getUSDAFood = async (fdcId) => {
  const data = await fetchJsonWithRetry(`${USDA_BASE}/food/${fdcId}?api_key=${USDA_KEY}`, { maxRetries: 1, baseDelay: 10_000 });

  const get = (name) => {
    const n = data.foodNutrients?.find(
      (fn) => (fn.nutrient?.name || fn.nutrientName) === name
    );
    if (!n) return null;
    return { value: n.amount || n.value, unit: n.nutrient?.unitName || n.unitName };
  };

  return {
    fdcId: data.fdcId,
    name: data.description || '',
    category: data.foodCategory?.description || '',
    servingSize: data.servingSize || null,
    servingSizeUnit: data.servingSizeUnit || '',
    nutrition: {
      calories: get('Energy'),
      protein: get('Protein'),
      carbs: get('Carbohydrate, by difference'),
      fat: get('Total lipid (fat)'),
      fiber: get('Fiber, total dietary'),
      sodium: get('Sodium, Na'),
      sugar: get('Sugars, total including NLEA'),
      iron: get('Iron, Fe'),
      calcium: get('Calcium, Ca'),
      vitaminA: get('Vitamin A, RAE'),
      vitaminC: get('Vitamin C, total ascorbic acid'),
      potassium: get('Potassium, K'),
      cholesterol: get('Cholesterol'),
    },
    source: 'usda',
  };
};

// ════════════════════════════════════════════════════════════════
//  3. WIKIPEDIA  (free, no key)
//     Discover new African dishes from category pages
// ════════════════════════════════════════════════════════════════

const WIKI_API = 'https://en.wikipedia.org/w/api.php';

/**
 * Get all articles in a Wikipedia category (e.g. "African cuisine").
 * Follows sub-categories up to `depth` levels.
 */
export const getWikipediaCategoryFoods = async (
  category = 'African_cuisine',
  { depth = 1, maxResults = 200 } = {}
) => {
  const foods = [];
  const visited = new Set();

  const crawl = async (cat, currentDepth) => {
    if (currentDepth > depth || foods.length >= maxResults || visited.has(cat)) return;
    visited.add(cat);

    // Get category members (articles + subcategories)
    let cmcontinue = '';
    do {
      const url = new URL(WIKI_API);
      url.searchParams.set('action', 'query');
      url.searchParams.set('list', 'categorymembers');
      url.searchParams.set('cmtitle', `Category:${cat}`);
      url.searchParams.set('cmlimit', '50');
      url.searchParams.set('cmtype', 'page|subcat');
      url.searchParams.set('format', 'json');
      if (cmcontinue) url.searchParams.set('cmcontinue', cmcontinue);

      const data = await fetchJson(url.toString());
      await sleep(100); // Be polite

      for (const member of data.query?.categorymembers || []) {
        if (foods.length >= maxResults) break;

        if (member.ns === 14) {
          // Subcategory — recurse
          const subName = member.title.replace('Category:', '');
          await crawl(subName, currentDepth + 1);
        } else if (member.ns === 0) {
          // Article
          foods.push({
            title: member.title,
            pageid: member.pageid,
            wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(member.title.replace(/ /g, '_'))}`,
          });
        }
      }

      cmcontinue = data.continue?.cmcontinue || '';
    } while (cmcontinue && foods.length < maxResults);
  };

  await crawl(category, 0);
  return foods;
};

/**
 * Discover African dishes from multiple cuisine categories.
 */
export const discoverAfricanDishes = async ({ depth = 2, maxResults = 500 } = {}) => {
  const categories = [
    'African_cuisine',
    'West_African_cuisine',
    'East_African_cuisine',
    'North_African_cuisine',
    'Southern_African_cuisine',
    'Central_African_cuisine',
    'Nigerian_cuisine',
    'Ethiopian_cuisine',
    'Ghanaian_cuisine',
    'Kenyan_cuisine',
    'South_African_cuisine',
    'Moroccan_cuisine',
    'Egyptian_cuisine',
    'Senegalese_cuisine',
    'Tanzanian_cuisine',
    'Cameroonian_cuisine',
    'Congolese_cuisine',
    'Ugandan_cuisine',
    'Somali_cuisine',
    'Tunisian_cuisine',
    'Algerian_cuisine',
    'Ivorian_cuisine',
    'Mozambican_cuisine',
    'Zimbabwean_cuisine',
    'Rwandan_cuisine',
    'Sudanese_cuisine',
    'Malian_cuisine',
    'Angolan_cuisine',
    'Malagasy_cuisine',
  ];

  const allFoods = new Map(); // title → food (deduplicate)

  for (const cat of categories) {
    try {
      const foods = await getWikipediaCategoryFoods(cat, {
        depth: Math.min(depth, 1), // Limit depth per sub-cat to stay fast
        maxResults: 80,
      });
      for (const f of foods) {
        if (!allFoods.has(f.title)) {
          allFoods.set(f.title, { ...f, categories: [cat] });
        } else {
          allFoods.get(f.title).categories.push(cat);
        }
      }
    } catch (err) {
      console.warn(`⚠️  Failed to fetch category ${cat}: ${err.message}`);
    }
    await sleep(200);
  }

  return Array.from(allFoods.values());
};

/**
 * Get Wikipedia page extract (summary) + image for a food.
 */
export const getWikipediaFoodInfo = async (title) => {
  const url = new URL(WIKI_API);
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', title);
  url.searchParams.set('prop', 'extracts|pageimages|categories');
  url.searchParams.set('exintro', '1');
  url.searchParams.set('explaintext', '1');
  url.searchParams.set('pithumbsize', '800');
  url.searchParams.set('cllimit', '20');
  url.searchParams.set('format', 'json');

  const data = await fetchJson(url.toString());
  const pages = data.query?.pages || {};
  const page = Object.values(pages)[0];

  if (!page || page.missing !== undefined) return null;

  return {
    title: page.title,
    pageid: page.pageid,
    description: page.extract || '',
    imageUrl: page.thumbnail?.source || '',
    categories: (page.categories || []).map((c) => c.title.replace('Category:', '')),
    wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
    source: 'wikipedia',
  };
};

// ════════════════════════════════════════════════════════════════
//  4. SPOONACULAR  (free tier: 150 req/day)
//     https://spoonacular.com/food-api — requires API key
// ════════════════════════════════════════════════════════════════

const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY || '';
const SPOONACULAR_BASE = 'https://api.spoonacular.com';

/**
 * Search recipes on Spoonacular (requires API key).
 */
export const searchSpoonacular = async (query, { number = 5, cuisine = 'African' } = {}) => {
  if (!SPOONACULAR_KEY) {
    return { results: [], message: 'Spoonacular API key not set. Set SPOONACULAR_API_KEY env var.' };
  }

  const url = new URL(`${SPOONACULAR_BASE}/recipes/complexSearch`);
  url.searchParams.set('query', query);
  url.searchParams.set('cuisine', cuisine);
  url.searchParams.set('number', number);
  url.searchParams.set('addRecipeNutrition', 'true');
  url.searchParams.set('addRecipeInstructions', 'true');
  url.searchParams.set('apiKey', SPOONACULAR_KEY);

  const data = await fetchJson(url.toString());

  return {
    totalResults: data.totalResults || 0,
    results: (data.results || []).map((r) => ({
      id: r.id,
      name: r.title || '',
      imageUrl: r.image || '',
      servings: r.servings || 0,
      prepTime: r.preparationMinutes || 0,
      cookTime: r.cookingMinutes || 0,
      totalTime: r.readyInMinutes || 0,
      nutrition: {
        calories: r.nutrition?.nutrients?.find((n) => n.name === 'Calories')?.amount || 0,
        protein: `${r.nutrition?.nutrients?.find((n) => n.name === 'Protein')?.amount || 0}g`,
        carbs: `${r.nutrition?.nutrients?.find((n) => n.name === 'Carbohydrates')?.amount || 0}g`,
        fat: `${r.nutrition?.nutrients?.find((n) => n.name === 'Fat')?.amount || 0}g`,
      },
      ingredients: (r.extendedIngredients || []).map((i) => ({
        name: i.name,
        quantity: i.amount,
        unit: i.unit,
      })),
      instructions: (r.analyzedInstructions?.[0]?.steps || []).map((s) => ({
        step: s.number,
        description: s.step,
      })),
      sourceUrl: r.sourceUrl || '',
      source: 'spoonacular',
    })),
  };
};

/**
 * Get nutrition breakdown from Spoonacular by recipe ID.
 */
export const getSpoonacularNutrition = async (recipeId) => {
  if (!SPOONACULAR_KEY) return null;

  const data = await fetchJson(
    `${SPOONACULAR_BASE}/recipes/${recipeId}/nutritionWidget.json?apiKey=${SPOONACULAR_KEY}`
  );

  return {
    calories: data.calories || '',
    protein: data.protein || '',
    carbs: data.carbs || '',
    fat: data.fat || '',
    nutrients: (data.nutrients || []).map((n) => ({
      name: n.name,
      amount: n.amount,
      unit: n.unit,
      percentOfDaily: n.percentOfDailyNeeds,
    })),
    source: 'spoonacular',
  };
};

export default {
  // Open Food Facts
  searchOpenFoodFacts,
  getOpenFoodFactsProduct,
  // USDA
  searchUSDA,
  getUSDAFood,
  // Wikipedia
  getWikipediaCategoryFoods,
  discoverAfricanDishes,
  getWikipediaFoodInfo,
  // Spoonacular
  searchSpoonacular,
  getSpoonacularNutrition,
};
