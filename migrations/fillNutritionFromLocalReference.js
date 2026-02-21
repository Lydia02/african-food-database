import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { lookupNutrition } from '../data/nutritionReference.js';

const foods = db.collection(COLLECTIONS.FOODS);

const hasCoreNutrition = (value = {}) => Boolean(value.calories || value.protein || value.carbs || value.fat);

const toNutritionInfo = (nutrition = {}) => ({
  calories: Number(String(nutrition.calories || '').replace(/[^\d.]/g, '')) || 0,
  protein: nutrition.protein || '',
  carbs: nutrition.carbs || '',
  fat: nutrition.fat || '',
  fiber: nutrition.fiber || '',
  sodium: nutrition.sodium || '',
  sugar: nutrition.sugar || '',
  iron: nutrition.iron || '',
  calcium: nutrition.calcium || '',
  vitaminA: nutrition.vitaminA || '',
  vitaminC: nutrition.vitaminC || '',
});

const fillNutritionFromLocalReference = async () => {
  console.log('🍽️ Filling missing nutrition from local reference...');
  const snapshot = await foods.get();

  let updated = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const existing = data.nutritionInfo || data.nutrition || {};

    if (hasCoreNutrition(existing)) {
      skipped += 1;
      continue;
    }

    const match = lookupNutrition(data.name || '');
    if (!match) {
      skipped += 1;
      continue;
    }

    await foods.doc(doc.id).set({
      nutritionInfo: toNutritionInfo(match),
      nutritionSource: 'pantrypal-reference',
      nutritionEnrichedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    updated += 1;
  }

  console.log(`✅ Nutrition fill complete. Updated: ${updated}, Skipped: ${skipped}`);
};

fillNutritionFromLocalReference()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed to fill nutrition from local reference:', error);
    process.exit(1);
  });
