import { Router } from 'express';
import {
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
} from '../controllers/externalController.js';

const router = Router();

// ─── Unified search across all external APIs ───────────────────
// GET /api/external/search?q=jollof+rice
router.get('/search', searchExternal);

// ─── Individual source searches ────────────────────────────────
// GET /api/external/search/openfoodfacts?q=jollof&page=1&pageSize=10
router.get('/search/openfoodfacts', searchOpenFoodFacts);

// GET /api/external/search/usda?q=rice&pageSize=5
router.get('/search/usda', searchUSDA);

// GET /api/external/search/spoonacular?q=tagine&number=5
router.get('/search/spoonacular', searchSpoonacular);

// ─── Product lookup by barcode ─────────────────────────────────
// GET /api/external/product/:barcode
router.get('/product/:barcode', getProductByBarcode);

// ─── Nutrition details for existing food ───────────────────────
// GET /api/external/nutrition/:foodId
router.get('/nutrition/:foodId', getNutritionDetails);

// ─── Food discovery from Wikipedia ─────────────────────────────
// GET /api/external/discover?depth=2&maxResults=100
router.get('/discover', discoverMissing);

// GET /api/external/discover/wikipedia/:category?depth=1&maxResults=50
router.get('/discover/wikipedia/:category', discoverByCategory);

// GET /api/external/discover/wikipedia/info/:title
router.get('/discover/wikipedia/info/:title', getWikipediaInfo);

// POST /api/external/discover/import — import a single dish into our DB
router.post('/discover/import', importDish);

// POST /api/external/discover/import/bulk?minConfidence=60&limit=50&dryRun=true
router.post('/discover/import/bulk', bulkImportDishes);

// ─── Enrichment ────────────────────────────────────────────────
// POST /api/external/enrich/:foodId/nutrition
router.post('/enrich/:foodId/nutrition', enrichNutrition);

// POST /api/external/enrich/:foodId/wikipedia
router.post('/enrich/:foodId/wikipedia', enrichFromWikipedia);

// POST /api/external/enrich/bulk/nutrition?dryRun=false
router.post('/enrich/bulk/nutrition', bulkEnrichNutrition);

// POST /api/external/enrich/bulk/wikipedia?dryRun=false
router.post('/enrich/bulk/wikipedia', bulkEnrichFromWikipedia);

export default router;
