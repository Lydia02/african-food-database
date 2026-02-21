/**
 * Country Model
 * Represents an African country in the database
 *
 * Firestore collection: 'countries'
 */

export const countrySchema = {
  name: '',            // e.g. "Nigeria"
  code: '',            // ISO 3166-1 alpha-2 code, e.g. "NG"
  continent: 'Africa',
  capitalCity: '',
  officialLanguages: [], // e.g. ["English", "Hausa", "Yoruba", "Igbo"]
  regions: [],          // Sub-regions/states/provinces
  flagEmoji: '',        // e.g. "🇳🇬"
  description: '',
  population: 0,
  imageUrl: '',
  foodCount: 0,         // Denormalized count of foods
  createdAt: null,
  updatedAt: null,
};

/**
 * Validate country data before writing to Firestore
 */
export const validateCountry = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Country name is required and must be a string');
  }
  if (!data.code || typeof data.code !== 'string' || data.code.length !== 2) {
    errors.push('Country code must be a 2-letter ISO code');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format country data for Firestore
 */
export const formatCountry = (data) => {
  const now = new Date().toISOString();
  return {
    name: data.name?.trim() || '',
    code: data.code?.toUpperCase().trim() || '',
    continent: 'Africa',
    capitalCity: data.capitalCity?.trim() || '',
    officialLanguages: Array.isArray(data.officialLanguages) ? data.officialLanguages : [],
    regions: Array.isArray(data.regions) ? data.regions : [],
    flagEmoji: data.flagEmoji || '',
    description: data.description?.trim() || '',
    population: Number(data.population) || 0,
    imageUrl: data.imageUrl || '',
    foodCount: Number(data.foodCount) || 0,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

export default { countrySchema, validateCountry, formatCountry };
