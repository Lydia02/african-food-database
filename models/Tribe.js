/**
 * Tribe Model
 * Represents an ethnic group / tribe within an African country
 *
 * Firestore collection: 'tribes'
 */

export const tribeSchema = {
  name: '',            // e.g. "Yoruba"
  countryId: '',       // Reference to country document
  countryName: '',     // Denormalized for quick display
  region: '',          // e.g. "South West"
  description: '',
  languages: [],       // Languages spoken
  population: 0,
  famousFor: '',       // What they're known for food-wise
  imageUrl: '',
  foodCount: 0,
  createdAt: null,
  updatedAt: null,
};

export const validateTribe = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Tribe name is required and must be a string');
  }
  if (!data.countryId || typeof data.countryId !== 'string') {
    errors.push('Country ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const formatTribe = (data) => {
  const now = new Date().toISOString();
  return {
    name: data.name?.trim() || '',
    countryId: data.countryId || '',
    countryName: data.countryName?.trim() || '',
    region: data.region?.trim() || '',
    description: data.description?.trim() || '',
    languages: Array.isArray(data.languages) ? data.languages : [],
    population: Number(data.population) || 0,
    famousFor: data.famousFor?.trim() || '',
    imageUrl: data.imageUrl || '',
    foodCount: Number(data.foodCount) || 0,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

export default { tribeSchema, validateTribe, formatTribe };
