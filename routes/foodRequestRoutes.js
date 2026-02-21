import { Router } from 'express';
import {
  createRequest,
  getAllRequests,
  getTopRequested,
  getRequestStats,
  updateRequestStatus,
  deleteRequest,
} from '../controllers/foodRequestController.js';

const router = Router();

// GET /api/food-requests — List all requests
router.get('/', getAllRequests);

// GET /api/food-requests/top — Most requested foods
router.get('/top', getTopRequested);

// GET /api/food-requests/stats — Analytics
router.get('/stats', getRequestStats);

// POST /api/food-requests — Submit a request
router.post('/', createRequest);

// PATCH /api/food-requests/:id/status — Update status (admin)
router.patch('/:id/status', updateRequestStatus);

// DELETE /api/food-requests/:id — Delete request
router.delete('/:id', deleteRequest);

export default router;
