import * as foodService from '../services/foodService.js';

/**
 * GET /api/foods
 */
export const getAllFoods = async (req, res) => {
  try {
    const { page, limit, countryId, tribeId, category, targetAudience, difficulty, search } = req.query;
    const result = await foodService.getAllFoods({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      countryId: countryId || '',
      tribeId: tribeId || '',
      category: category || '',
      targetAudience: targetAudience || '',
      difficulty: difficulty || '',
      search: search || '',
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/foods/country/:countryId
 */
export const getFoodsByCountry = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const foods = await foodService.getFoodsByCountry(req.params.countryId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('Error fetching foods by country:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/foods/tribe/:tribeId
 */
export const getFoodsByTribe = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const foods = await foodService.getFoodsByTribe(req.params.tribeId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('Error fetching foods by tribe:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/foods/students
 */
export const getFoodsForStudents = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const foods = await foodService.getFoodsForStudents({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('Error fetching student foods:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/foods/professionals
 */
export const getFoodsForProfessionals = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const foods = await foodService.getFoodsForProfessionals({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('Error fetching professional foods:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/foods/featured
 */
export const getFeaturedFoods = async (req, res) => {
  try {
    const { limit } = req.query;
    const foods = await foodService.getFeaturedFoods(parseInt(limit) || 10);
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('Error fetching featured foods:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/foods/:id
 */
export const getFoodById = async (req, res) => {
  try {
    const food = await foodService.getFoodById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, error: 'Food not found' });
    }
    res.json({ success: true, data: food });
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/foods
 */
export const createFood = async (req, res) => {
  try {
    const food = await foodService.createFood(req.body);
    res.status(201).json({ success: true, data: food });
  } catch (error) {
    console.error('Error creating food:', error);
    const status = error.message.includes('Validation') ? 400 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

/**
 * PUT /api/foods/:id
 */
export const updateFood = async (req, res) => {
  try {
    const food = await foodService.updateFood(req.params.id, req.body);
    res.json({ success: true, data: food });
  } catch (error) {
    console.error('Error updating food:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/foods/:id
 */
export const deleteFood = async (req, res) => {
  try {
    const result = await foodService.deleteFood(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting food:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
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
};
