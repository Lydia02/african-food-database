import * as foodRequestService from '../services/foodRequestService.js';

/**
 * POST /api/food-requests — Manually request a food
 */
export const createRequest = async (req, res) => {
  try {
    const { query, region, countryHint } = req.body;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 2 characters',
      });
    }

    const request = await foodRequestService.logFoodRequest(query, {
      region: region || '',
      countryHint: countryHint || '',
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error('Error creating food request:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/food-requests — List all requests (paginated, filterable)
 */
export const getAllRequests = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const result = await foodRequestService.getAllRequests({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      status: status || '',
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching food requests:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/food-requests/top — Most requested foods
 */
export const getTopRequested = async (req, res) => {
  try {
    const { limit, status } = req.query;
    const requests = await foodRequestService.getTopRequested({
      limit: parseInt(limit) || 20,
      status: status || '',
    });
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching top requests:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/food-requests/stats — Request analytics
 */
export const getRequestStats = async (req, res) => {
  try {
    const stats = await foodRequestService.getRequestStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching request stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * PATCH /api/food-requests/:id/status — Update request status (admin)
 */
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, addedFoodId, notes } = req.body;
    const result = await foodRequestService.updateRequestStatus(
      req.params.id,
      status,
      { addedFoodId, notes }
    );
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating request status:', error);
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/food-requests/:id — Delete a request
 */
export const deleteRequest = async (req, res) => {
  try {
    const result = await foodRequestService.deleteRequest(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting food request:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

export default {
  createRequest,
  getAllRequests,
  getTopRequested,
  getRequestStats,
  updateRequestStatus,
  deleteRequest,
};
