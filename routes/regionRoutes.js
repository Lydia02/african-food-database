import { Router } from 'express';
import {
  getAllRegions,
  getRegionsByCountry,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
} from '../controllers/regionController.js';

const router = Router();

router.get('/', getAllRegions);
router.get('/country/:countryId', getRegionsByCountry);
router.get('/:id', getRegionById);
router.post('/', createRegion);
router.put('/:id', updateRegion);
router.delete('/:id', deleteRegion);

export default router;
