/**
 * Region Model
 * Represents a geographic region within an African country
 *
 * Firestore collection: 'regions'
 */

export const regionSchema = {
  name: '',            // e.g. "South West"
  countryId: '',
  countryName: '',
  description: '',
  majorCities: [],
  tribes: [],          // Tribe names in this region
  famousFoods: [],     // Notable dishes from this region
  imageUrl: '',
  createdAt: null,
  updatedAt: null,
};

export const validateRegion = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Region name is required and must be a string');
  }
  if (!data.countryId || typeof data.countryId !== 'string') {
    errors.push('Country ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const formatRegion = (data) => {
  const now = new Date().toISOString();
  return {
    name: data.name?.trim() || '',
    countryId: data.countryId || '',
    countryName: data.countryName?.trim() || '',
    description: data.description?.trim() || '',
    majorCities: Array.isArray(data.majorCities) ? data.majorCities : [],
    tribes: Array.isArray(data.tribes) ? data.tribes : [],
    famousFoods: Array.isArray(data.famousFoods) ? data.famousFoods : [],
    imageUrl: data.imageUrl || '',
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

export default { regionSchema, validateRegion, formatRegion };
