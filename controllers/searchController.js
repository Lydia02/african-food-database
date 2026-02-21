import * as searchService from '../services/searchService.js';
import * as foodRequestService from '../services/foodRequestService.js';

/**
 * GET /api/search?q=jollof&page=1&limit=20&category=&region=&countryId=
 * Smart search with fuzzy matching
 */
export const smartSearch = async (req, res) => {
  try {
    const { q, page, limit, category, region, countryId, minScore } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query (q) must be at least 2 characters',
      });
    }

    const result = await searchService.smartSearch(q, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      category: category || '',
      region: region || '',
      countryId: countryId || '',
      minScore: parseInt(minScore) || 30,
    });

    // If zero results, auto-log as a food request
    if (result.totalMatches === 0) {
      await foodRequestService.logFoodRequest(q, {
        region: region || '',
        countryHint: countryId || '',
      });
      result.requestLogged = true;
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in smart search:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/search/autocomplete?q=jol&limit=10
 */
export const autocomplete = async (req, res) => {
  try {
    const { q, limit } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const suggestions = await searchService.autocomplete(q, {
      limit: parseInt(limit) || 10,
    });

    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('Error in autocomplete:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/search/ingredient?q=tomato&page=1&limit=20
 */
export const searchByIngredient = async (req, res) => {
  try {
    const { q, page, limit } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Ingredient query (q) must be at least 2 characters',
      });
    }

    const result = await searchService.searchByIngredient(q, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in ingredient search:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default { smartSearch, autocomplete, searchByIngredient };
