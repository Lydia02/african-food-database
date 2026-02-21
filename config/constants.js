// Firestore collection names — single source of truth
export const COLLECTIONS = {
  COUNTRIES: 'countries',
  REGIONS: 'regions',
  TRIBES: 'tribes',
  FOODS: 'foods',
  RECIPES: 'recipes',
  CATEGORIES: 'categories',
  USERS: 'users',
  FOOD_REQUESTS: 'foodRequests',
};

// Food categories targeted at the audience
export const FOOD_CATEGORIES = [
  'quick-meals',        // Fast meals for busy students
  'budget-friendly',    // Affordable meals
  'traditional',        // Authentic traditional dishes
  'street-food',        // Popular street foods
  'breakfast',
  'lunch',
  'dinner',
  'snacks',
  'beverages',
  'desserts',
  'festive',            // Special occasion foods
  'vegetarian',
  'vegan',
];

// Target audiences
export const TARGET_AUDIENCES = [
  'university-students',
  'young-professionals',
  'everyone',
];

// Difficulty levels
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

export default {
  COLLECTIONS,
  FOOD_CATEGORIES,
  TARGET_AUDIENCES,
  DIFFICULTY_LEVELS,
};
