/**
 * Food Model
 * Represents a food item from an African country/tribe
 *
 * Firestore collection: 'foods'
 */

export const foodSchema = {
  name: '',               // e.g. "Jollof Rice"
  localName: '',          // Name in local language
  aliases: [],            // Alternative names, e.g. ["Jolof", "Benachin", "Ceebu Jen"]
  searchTerms: [],        // Lowercase search tokens for fuzzy matching
  description: '',
  countryId: '',
  countryName: '',        // Denormalized
  tribeId: '',
  tribeName: '',          // Denormalized
  region: '',
  categories: [],         // ["traditional", "lunch", "dinner"]
  targetAudience: [],     // ["university-students", "young-professionals"]
  imageUrl: '',
  images: [],             // Array of image URLs
  tags: [],               // Searchable tags
  difficulty: 'medium',   // easy, medium, hard
  prepTime: 0,            // in minutes
  cookTime: 0,            // in minutes
  totalTime: 0,
  servings: 0,
  estimatedCost: '',      // e.g. "budget-friendly", "$5-10"
  ingredients: [],        // Array of { name, quantity, unit, notes }
  instructions: [],       // Array of { step, description, imageUrl? }
  nutritionInfo: {
    calories: 0,
    protein: '',
    carbs: '',
    fat: '',
  },
  tips: [],               // Cooking tips
  variations: [],         // Regional or personal variations
  isFeatured: false,
  rating: 0,
  reviewCount: 0,
  viewCount: 0,
  createdAt: null,
  updatedAt: null,
};

export const validateFood = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Food name is required and must be a string');
  }
  if (!data.countryId || typeof data.countryId !== 'string') {
    errors.push('Country ID is required');
  }
  if (!data.description || typeof data.description !== 'string') {
    errors.push('Description is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Build searchTerms automatically from name, localName, aliases, tags
 */
const buildSearchTerms = (data) => {
  const terms = new Set();
  const addTokens = (str) => {
    if (!str) return;
    const lower = str.toLowerCase().trim();
    terms.add(lower);
    lower.split(/[\s\-&,]+/).forEach((w) => {
      if (w.length > 1) terms.add(w);
    });
  };

  addTokens(data.name);
  addTokens(data.localName);
  if (Array.isArray(data.aliases)) data.aliases.forEach(addTokens);
  if (Array.isArray(data.tags)) data.tags.forEach((t) => terms.add(t.toLowerCase()));

  return [...terms];
};

export const formatFood = (data) => {
  const now = new Date().toISOString();
  const prepTime = Number(data.prepTime) || 0;
  const cookTime = Number(data.cookTime) || 0;

  return {
    name: data.name?.trim() || '',
    localName: data.localName?.trim() || '',
    aliases: Array.isArray(data.aliases) ? data.aliases.map((a) => a.trim()) : [],
    searchTerms: Array.isArray(data.searchTerms)
      ? data.searchTerms.map((t) => t.toLowerCase().trim())
      : buildSearchTerms(data),
    description: data.description?.trim() || '',
    countryId: data.countryId || '',
    countryName: data.countryName?.trim() || '',
    tribeId: data.tribeId || '',
    tribeName: data.tribeName?.trim() || '',
    region: data.region?.trim() || '',
    categories: Array.isArray(data.categories) ? data.categories : [],
    targetAudience: Array.isArray(data.targetAudience) ? data.targetAudience : ['everyone'],
    imageUrl: data.imageUrl || '',
    images: Array.isArray(data.images) ? data.images : [],
    tags: Array.isArray(data.tags) ? data.tags.map((t) => t.toLowerCase()) : [],
    difficulty: data.difficulty || 'medium',
    prepTime,
    cookTime,
    totalTime: prepTime + cookTime,
    servings: Number(data.servings) || 0,
    estimatedCost: data.estimatedCost || '',
    ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
    instructions: Array.isArray(data.instructions) ? data.instructions : [],
    nutritionInfo: {
      calories: Number(data.nutritionInfo?.calories) || 0,
      protein: data.nutritionInfo?.protein || '',
      carbs: data.nutritionInfo?.carbs || '',
      fat: data.nutritionInfo?.fat || '',
    },
    tips: Array.isArray(data.tips) ? data.tips : [],
    variations: Array.isArray(data.variations) ? data.variations : [],
    isFeatured: Boolean(data.isFeatured),
    rating: Number(data.rating) || 0,
    reviewCount: Number(data.reviewCount) || 0,
    viewCount: Number(data.viewCount) || 0,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
};

export default { foodSchema, validateFood, formatFood };
