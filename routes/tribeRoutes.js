import { Router } from 'express';
import {
  getAllTribes,
  getTribesByCountry,
  getTribeById,
  createTribe,
  updateTribe,
  deleteTribe,
} from '../controllers/tribeController.js';

const router = Router();

// GET /api/tribes - List all tribes
router.get('/', getAllTribes);

// GET /api/tribes/country/:countryId - Get tribes by country
router.get('/country/:countryId', getTribesByCountry);

// GET /api/tribes/:id - Get single tribe
router.get('/:id', getTribeById);

// POST /api/tribes - Add a new tribe
router.post('/', createTribe);

// PUT /api/tribes/:id - Update a tribe
router.put('/:id', updateTribe);

// DELETE /api/tribes/:id - Delete a tribe
router.delete('/:id', deleteTribe);

export default router;
