import { Router } from 'express';
import {
  getAllCountries,
  getCountryById,
  getCountryByCode,
  createCountry,
  updateCountry,
  deleteCountry,
} from '../controllers/countryController.js';

const router = Router();

// GET /api/countries - List all African countries
router.get('/', getAllCountries);

// GET /api/countries/code/:code - Get country by ISO code (e.g. "NG")
router.get('/code/:code', getCountryByCode);

// GET /api/countries/:id - Get single country
router.get('/:id', getCountryById);

// POST /api/countries - Add a new country
router.post('/', createCountry);

// PUT /api/countries/:id - Update a country
router.put('/:id', updateCountry);

// DELETE /api/countries/:id - Delete a country
router.delete('/:id', deleteCountry);

export default router;
