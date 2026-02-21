import * as tribeService from '../services/tribeService.js';

/**
 * GET /api/tribes
 */
export const getAllTribes = async (req, res) => {
  try {
    const { page, limit, countryId, search } = req.query;
    const result = await tribeService.getAllTribes({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      countryId: countryId || '',
      search: search || '',
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching tribes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/tribes/country/:countryId
 */
export const getTribesByCountry = async (req, res) => {
  try {
    const tribes = await tribeService.getTribesByCountry(req.params.countryId);
    res.json({ success: true, data: tribes });
  } catch (error) {
    console.error('Error fetching tribes by country:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/tribes/:id
 */
export const getTribeById = async (req, res) => {
  try {
    const tribe = await tribeService.getTribeById(req.params.id);
    if (!tribe) {
      return res.status(404).json({ success: false, error: 'Tribe not found' });
    }
    res.json({ success: true, data: tribe });
  } catch (error) {
    console.error('Error fetching tribe:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/tribes
 */
export const createTribe = async (req, res) => {
  try {
    const tribe = await tribeService.createTribe(req.body);
    res.status(201).json({ success: true, data: tribe });
  } catch (error) {
    console.error('Error creating tribe:', error);
    const status = error.message.includes('Validation') ? 400 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

/**
 * PUT /api/tribes/:id
 */
export const updateTribe = async (req, res) => {
  try {
    const tribe = await tribeService.updateTribe(req.params.id, req.body);
    res.json({ success: true, data: tribe });
  } catch (error) {
    console.error('Error updating tribe:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/tribes/:id
 */
export const deleteTribe = async (req, res) => {
  try {
    const result = await tribeService.deleteTribe(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting tribe:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

export default {
  getAllTribes,
  getTribesByCountry,
  getTribeById,
  createTribe,
  updateTribe,
  deleteTribe,
};
