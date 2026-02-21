import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { lookupNutrition } from '../data/nutritionReference.js';
import { getWikipediaFoodInfo } from '../services/externalApiService.js';
import {
  inferManualNutritionProfile,
  getManualImageOverride,
  buildFallbackDescription,
} from '../services/manualFallbackService.js';

const foods = db.collection(COLLECTIONS.FOODS);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const hasCoreNutrition = (value = {}) => Boolean(value.calories || value.protein || value.carbs || value.fat);

const normalizeNutrition = (nutrition = {}) => ({
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

const backfillMissingFoodData = async () => {
  console.log('🛠️ Backfilling missing nutrition/image/description...');

  const snapshot = await foods.get();
  let updatedDocs = 0;
  let nutritionUpdated = 0;
  let imageUpdated = 0;
  let descriptionUpdated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updates = {};

    const existingNutrition = data.nutritionInfo || {};
    if (!hasCoreNutrition(existingNutrition)) {
      const local = lookupNutrition(data.name || '');
      const inferred = inferManualNutritionProfile({
        name: data.name || '',
        tags: data.tags || [],
        categories: data.categories || [],
      });
      const nutritionSource = local ? 'pantrypal-reference' : 'pantrypal-manual-profile';

      updates.nutritionInfo = normalizeNutrition(local || inferred);
      updates.nutritionSource = nutritionSource;
      updates.nutritionEnrichedAt = new Date().toISOString();
      nutritionUpdated += 1;
    }

    const missingDescription = !data.description || String(data.description).trim().length < 20;
    const missingImage = !data.imageUrl || !String(data.imageUrl).trim();

    let wiki = null;
    if (missingDescription || missingImage) {
      wiki = await getWikipediaFoodInfo(data.name || '');
      await sleep(300);
    }

    if (missingImage) {
      const manualImage = getManualImageOverride(data.name || '');
      const wikiImage = wiki?.imageUrl || '';
      const pickedImage = manualImage || wikiImage;
      if (pickedImage) {
        updates.imageUrl = pickedImage;
        imageUpdated += 1;
      }
    }

    if (missingDescription) {
      if (wiki?.description) {
        const sentences = wiki.description.split('. ').slice(0, 2).join('. ');
        updates.description = sentences.endsWith('.') ? sentences : `${sentences}.`;
      } else {
        updates.description = buildFallbackDescription({
          name: data.name || '',
          countryName: data.countryName || '',
          tags: data.tags || [],
        });
      }
      descriptionUpdated += 1;
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date().toISOString();
      await foods.doc(doc.id).set(updates, { merge: true });
      updatedDocs += 1;
    }
  }

  console.log(`✅ Backfill complete. docs=${updatedDocs}, nutrition=${nutritionUpdated}, image=${imageUpdated}, description=${descriptionUpdated}`);
};

backfillMissingFoodData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Backfill failed:', error);
    process.exit(1);
  });
