import * as countryService from '../services/countryService.js';

/**
 * GET /api/countries
 */
export const getAllCountries = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const result = await countryService.getAllCountries({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 54,
      search: search || '',
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/countries/:id
 */
export const getCountryById = async (req, res) => {
  try {
    const country = await countryService.getCountryById(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, error: 'Country not found' });
    }
    res.json({ success: true, data: country });
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/countries/code/:code
 */
export const getCountryByCode = async (req, res) => {
  try {
    const country = await countryService.getCountryByCode(req.params.code);
    if (!country) {
      return res.status(404).json({ success: false, error: 'Country not found' });
    }
    res.json({ success: true, data: country });
  } catch (error) {
    console.error('Error fetching country by code:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/countries
 */
export const createCountry = async (req, res) => {
  try {
    const country = await countryService.createCountry(req.body);
    res.status(201).json({ success: true, data: country });
  } catch (error) {
    console.error('Error creating country:', error);
    const status = error.message.includes('Validation') ? 400 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

/**
 * PUT /api/countries/:id
 */
export const updateCountry = async (req, res) => {
  try {
    const country = await countryService.updateCountry(req.params.id, req.body);
    res.json({ success: true, data: country });
  } catch (error) {
    console.error('Error updating country:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/countries/:id
 */
export const deleteCountry = async (req, res) => {
  try {
    const result = await countryService.deleteCountry(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting country:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

export default {
  getAllCountries,
  getCountryById,
  getCountryByCode,
  createCountry,
  updateCountry,
  deleteCountry,
};
