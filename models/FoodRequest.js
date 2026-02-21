/**
 * FoodRequest Model
 * Tracks foods that users searched for but weren't found in the database.
 * Helps identify gaps in coverage and popular demand.
 *
 * Firestore collection: 'foodRequests'
 */

export const foodRequestSchema = {
  query: '',            // Original search query
  normalizedQuery: '',  // Lowercase / trimmed version
  count: 0,            // Number of times this was requested
  status: 'pending',    // pending | under-review | added | rejected
  addedFoodId: '',      // If status = 'added', link to the food doc
  region: '',           // Optional: region hint from user context
  countryHint: '',      // Optional: country the user was browsing
  firstRequestedAt: null,
  lastRequestedAt: null,
  notes: '',            // Admin notes
};

export const FOOD_REQUEST_STATUSES = ['pending', 'under-review', 'added', 'rejected'];

export const validateFoodRequest = (data) => {
  const errors = [];
  if (!data.query || typeof data.query !== 'string' || data.query.trim().length < 2) {
    errors.push('Query must be a string with at least 2 characters');
  }
  return { isValid: errors.length === 0, errors };
};

export const formatFoodRequest = (data) => {
  const now = new Date().toISOString();
  return {
    query: (data.query || '').trim(),
    normalizedQuery: (data.query || '').trim().toLowerCase(),
    count: Number(data.count) || 1,
    status: FOOD_REQUEST_STATUSES.includes(data.status) ? data.status : 'pending',
    addedFoodId: data.addedFoodId || '',
    region: data.region || '',
    countryHint: data.countryHint || '',
    firstRequestedAt: data.firstRequestedAt || now,
    lastRequestedAt: now,
    notes: data.notes || '',
  };
};

export default { foodRequestSchema, validateFoodRequest, formatFoodRequest, FOOD_REQUEST_STATUSES };
