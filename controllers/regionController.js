import * as regionService from '../services/regionService.js';

export const getAllRegions = async (req, res) => {
  try {
    const { page, limit, countryId } = req.query;
    const result = await regionService.getAllRegions({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      countryId: countryId || '',
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRegionsByCountry = async (req, res) => {
  try {
    const regions = await regionService.getRegionsByCountry(req.params.countryId);
    res.json({ success: true, data: regions });
  } catch (error) {
    console.error('Error fetching regions by country:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRegionById = async (req, res) => {
  try {
    const region = await regionService.getRegionById(req.params.id);
    if (!region) {
      return res.status(404).json({ success: false, error: 'Region not found' });
    }
    res.json({ success: true, data: region });
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createRegion = async (req, res) => {
  try {
    const region = await regionService.createRegion(req.body);
    res.status(201).json({ success: true, data: region });
  } catch (error) {
    console.error('Error creating region:', error);
    const status = error.message.includes('Validation') ? 400 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

export const updateRegion = async (req, res) => {
  try {
    const region = await regionService.updateRegion(req.params.id, req.body);
    res.json({ success: true, data: region });
  } catch (error) {
    console.error('Error updating region:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

export const deleteRegion = async (req, res) => {
  try {
    const result = await regionService.deleteRegion(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting region:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

export default {
  getAllRegions,
  getRegionsByCountry,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
};
