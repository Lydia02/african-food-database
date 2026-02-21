import { db } from '../config/firebase.js';
import { lookupNutrition } from '../data/nutritionReference.js';

const snapshot = await db.collection('foods').get();
let missingRef = 0;
let missingNutrition = 0;
let missingImage = 0;
let categoriesMissing = 0;
const missingRefItems = [];
const missingNutritionItems = [];
const missingImageItems = [];

for (const doc of snapshot.docs) {
  const data = doc.data();
  const name = (data.name || '').replace(/\(.*?\)/g, '').trim();
  if (!lookupNutrition(name)) {
    missingRef += 1;
    missingRefItems.push({ id: doc.id, name: data.name || '', tags: data.tags || [] });
  }

  const nutrition = data.nutritionInfo || data.nutrition || {};
  if (!nutrition || (!nutrition.calories && !nutrition.protein && !nutrition.carbs && !nutrition.fat)) {
    missingNutrition += 1;
    missingNutritionItems.push({ id: doc.id, name: data.name || '', tags: data.tags || [] });
  }

  if (!data.imageUrl || !String(data.imageUrl).trim()) {
    missingImage += 1;
    missingImageItems.push({ id: doc.id, name: data.name || '', tags: data.tags || [] });
  }
  if (!Array.isArray(data.categories) || data.categories.length === 0) categoriesMissing += 1;
}

const report = {
  total: snapshot.size,
  missingRef,
  missingNutrition,
  missingImage,
  categoriesMissing,
};

console.log(JSON.stringify(report, null, 2));

if (process.argv.includes('--list')) {
  console.log('\nMISSING_REFERENCE_LIST');
  console.log(JSON.stringify(missingRefItems, null, 2));
  console.log('\nMISSING_NUTRITION_LIST');
  console.log(JSON.stringify(missingNutritionItems, null, 2));
  console.log('\nMISSING_IMAGE_LIST');
  console.log(JSON.stringify(missingImageItems, null, 2));
}
