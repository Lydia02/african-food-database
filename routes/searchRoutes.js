import { Router } from 'express';
import {
  smartSearch,
  autocomplete,
  searchByIngredient,
} from '../controllers/searchController.js';

const router = Router();

// GET /api/search?q=jollof&page=1&limit=20 — Smart fuzzy search
router.get('/', smartSearch);

// GET /api/search/autocomplete?q=jol&limit=10 — Autocomplete suggestions
router.get('/autocomplete', autocomplete);

// GET /api/search/ingredient?q=tomato — Search by ingredient
router.get('/ingredient', searchByIngredient);

export default router;
