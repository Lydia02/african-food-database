import { Router } from 'express';
import {
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
} from '../controllers/foodController.js';

const router = Router();

// GET /api/foods - List all foods (with filters)
router.get('/', getAllFoods);

// GET /api/foods/featured - Get featured foods
router.get('/featured', getFeaturedFoods);

// GET /api/foods/students - Foods for university students
router.get('/students', getFoodsForStudents);

// GET /api/foods/professionals - Foods for young professionals
router.get('/professionals', getFoodsForProfessionals);

// GET /api/foods/country/:countryId - Foods by country
router.get('/country/:countryId', getFoodsByCountry);

// GET /api/foods/tribe/:tribeId - Foods by tribe
router.get('/tribe/:tribeId', getFoodsByTribe);

// GET /api/foods/:id - Get single food with full recipe
router.get('/:id', getFoodById);

// POST /api/foods - Add a new food
router.post('/', createFood);

// PUT /api/foods/:id - Update a food
router.put('/:id', updateFood);

// DELETE /api/foods/:id - Delete a food
router.delete('/:id', deleteFood);

export default router;
