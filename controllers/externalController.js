/**
 * External API Controller
 * Endpoints for food discovery, enrichment, and external data integration.
 */
import * as externalApi from '../services/externalApiService.js';
import * as enrichment from '../services/enrichmentService.js';
import * as discovery from '../services/discoveryService.js';

// ═══════════════════════════════════════════════════════════════
//  SEARCH EXTERNAL SOURCES
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/external/search?q=jollof+rice
 * Search all external food databases at once.
 * Use case: User searched our DB and got no results — check outside.
 */
export const searchExternal = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Query parameter "q" is required (min 2 chars)' });
    }
    const results = await discovery.searchExternalSources(q.trim());
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('External search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/external/search/openfoodfacts?q=jollof&page=1&pageSize=10
 * Search Open Food Facts specifically.
 */
export const searchOpenFoodFacts = async (req, res) => {
  try {
    const { q, page, pageSize } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Query "q" is required' });

    const results = await externalApi.searchOpenFoodFacts(q, {
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 10,
    });
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Open Food Facts search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/external/search/usda?q=rice&pageSize=5
 * Search USDA FoodData Central for nutrition data.
 */
export const searchUSDA = async (req, res) => {
  try {
    const { q, pageSize } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Query "q" is required' });

    const results = await externalApi.searchUSDA(q, { pageSize: parseInt(pageSize) || 5 });
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('USDA search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/external/search/spoonacular?q=tagine&number=5
 * Search Spoonacular for recipes (requires SPOONACULAR_API_KEY env var).
 */
export const searchSpoonacular = async (req, res) => {
  try {
    const { q, number, cuisine } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Query "q" is required' });

    const results = await externalApi.searchSpoonacular(q, {
      number: parseInt(number) || 5,
      cuisine: cuisine || 'African',
    });
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Spoonacular search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/external/product/:barcode
 * Get product details from Open Food Facts by barcode.
 */
export const getProductByBarcode = async (req, res) => {
  try {
    const product = await externalApi.getOpenFoodFactsProduct(req.params.barcode);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Barcode lookup error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════
//  FOOD DISCOVERY
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/external/discover?depth=2&maxResults=100
 * Discover African dishes from Wikipedia that we don't have.
 */
export const discoverMissing = async (req, res) => {
  try {
    const { depth, maxResults, enrich } = req.query;
    const missing = await discovery.discoverMissingDishes({
      depth: parseInt(depth) || 2,
      maxResults: parseInt(maxResults) || 100,
      enrich: enrich !== 'false',
    });
    res.json({
      success: true,
      data: {
        count: missing.length,
        dishes: missing,
      },
    });
  } catch (error) {
    console.error('Discovery error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/external/discover/wikipedia/:category?depth=1&maxResults=50
 * Browse a specific Wikipedia cuisine category.
 */
export const discoverByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { depth, maxResults } = req.query;

    const dishes = await externalApi.getWikipediaCategoryFoods(category, {
      depth: parseInt(depth) || 1,
      maxResults: parseInt(maxResults) || 50,
    });
    res.json({ success: true, data: { category, count: dishes.length, dishes } });
  } catch (error) {
    console.error('Wikipedia category error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/external/discover/wikipedia/info/:title
 * Get Wikipedia page info (summary + image) for a food.
 */
export const getWikipediaInfo = async (req, res) => {
  try {
    const info = await externalApi.getWikipediaFoodInfo(decodeURIComponent(req.params.title));
    if (!info) {
      return res.status(404).json({ success: false, error: 'Wikipedia page not found' });
    }
    res.json({ success: true, data: info });
  } catch (error) {
    console.error('Wikipedia info error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/external/discover/import
 * Import a discovered dish into our database.
 * Body: { title, description, imageUrl, wikiUrl, countryId, countryName, region }
 */
export const importDish = async (req, res) => {
  try {
    const { title, description, imageUrl, wikiUrl, countryId, countryName, region } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Dish title is required' });
    }

    const dish = { title, description, imageUrl, wikiUrl };
    const imported = await discovery.importDiscoveredDish(dish, { countryId, countryName, region });

    res.status(201).json({ success: true, data: imported });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════
//  ENRICHMENT
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/external/enrich/:foodId/nutrition
 * Enrich a single food with nutrition data from USDA / Open Food Facts.
 */
export const enrichNutrition = async (req, res) => {
  try {
    const result = await enrichment.enrichFoodNutrition(req.params.foodId);
    if (!result) {
      return res.json({
        success: true,
        data: null,
        message: 'No nutrition data found from external sources',
      });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Enrichment error:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/external/enrich/bulk/nutrition?dryRun=false
 * Bulk-enrich all foods that have missing nutrition data.
 */
export const bulkEnrichNutrition = async (req, res) => {
  try {
    const dryRun = req.query.dryRun === 'true';
    const result = await enrichment.bulkEnrichNutrition({ dryRun });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Bulk enrichment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/external/enrich/:foodId/wikipedia
 * Enrich a single food with Wikipedia description & image.
 */
export const enrichFromWikipedia = async (req, res) => {
  try {
    const result = await enrichment.enrichFoodFromWikipedia(req.params.foodId);
    if (!result) {
      return res.json({
        success: true,
        data: null,
        message: 'No Wikipedia data found for this food',
      });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Wikipedia enrichment error:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/external/enrich/bulk/wikipedia?dryRun=false
 * Bulk-enrich all foods missing descriptions from Wikipedia.
 */
export const bulkEnrichFromWikipedia = async (req, res) => {
  try {
    const dryRun = req.query.dryRun === 'true';
    const result = await enrichment.bulkEnrichFromWikipedia({ dryRun });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Bulk Wikipedia enrichment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/external/nutrition/:foodId
 * Get USDA nutrition details for a food (by name lookup).
 */
export const getNutritionDetails = async (req, res) => {
  try {
    const { db: database } = await import('../config/firebase.js');
    const { COLLECTIONS: C } = await import('../config/constants.js');
    const doc = await database.collection(C.FOODS).doc(req.params.foodId).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Food not found' });
    }

    const food = doc.data();
    const query = food.name.replace(/\(.*?\)/g, '').trim();

    const [usda, off] = await Promise.allSettled([
      externalApi.searchUSDA(query, { pageSize: 3 }),
      externalApi.searchOpenFoodFacts(query, { pageSize: 3 }),
    ]);

    res.json({
      success: true,
      data: {
        food: { id: doc.id, name: food.name },
        usda: usda.status === 'fulfilled' ? usda.value : null,
        openFoodFacts: off.status === 'fulfilled' ? off.value : null,
      },
    });
  } catch (error) {
    console.error('Nutrition details error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/external/discover/import/bulk?minConfidence=60&limit=50&dryRun=true
 * Bulk-import high-confidence discovered dishes into Firestore.
 */
export const bulkImportDishes = async (req, res) => {
  try {
    const minConfidence = parseInt(req.query.minConfidence) || 60;
    const limit = parseInt(req.query.limit) || 50;
    const depth = parseInt(req.query.depth) || 2;
    const dryRun = req.query.dryRun !== 'false'; // default=true for safety

    const result = await discovery.bulkImportDiscoveries({
      minConfidence,
      limit,
      depth,
      dryRun,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  searchExternal,
  searchOpenFoodFacts,
  searchUSDA,
  searchSpoonacular,
  getProductByBarcode,
  discoverMissing,
  discoverByCategory,
  getWikipediaInfo,
  importDish,
  bulkImportDishes,
  enrichNutrition,
  bulkEnrichNutrition,
  enrichFromWikipedia,
  bulkEnrichFromWikipedia,
  getNutritionDetails,
};
