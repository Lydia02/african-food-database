import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { FieldValue } from 'firebase-admin/firestore';

const foods = db.collection(COLLECTIONS.FOODS);

const TAG_TO_CATEGORY = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snack: 'snacks',
  snacks: 'snacks',
  'street-food': 'street-food',
  streetfood: 'street-food',
  traditional: 'traditional',
  festive: 'festive',
  vegetarian: 'vegetarian',
  vegan: 'vegan',
  seafood: 'seafood',
  quick: 'quick-meals',
  'quick-meals': 'quick-meals',
  budget: 'budget-friendly',
  'budget-friendly': 'budget-friendly',
};

const normalizeArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || '').trim().toLowerCase())
    .filter(Boolean);
};

const inferCategories = (food) => {
  const categories = new Set(normalizeArray(food.categories));

  if (categories.size > 0) return [...categories];

  if (food.category && typeof food.category === 'string') {
    const singleCategory = food.category.trim().toLowerCase();
    if (singleCategory && singleCategory !== 'unknown' && singleCategory !== 'undefined') {
      categories.add(singleCategory);
    }
  }

  const tags = normalizeArray(food.tags);
  tags.forEach((tag) => {
    const mapped = TAG_TO_CATEGORY[tag] || TAG_TO_CATEGORY[tag.replace(/\s+/g, '-')];
    if (mapped) categories.add(mapped);
  });

  if (categories.size === 0) categories.add('traditional');
  return [...categories];
};

const fixFoodCategories = async () => {
  console.log('🏷️ Backfilling food categories...');
  const snapshot = await foods.get();

  let updated = 0;
  let unchanged = 0;
  let removedLegacyField = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const categories = inferCategories(data);
    const existing = normalizeArray(data.categories);

    const sameCategories = JSON.stringify([...existing].sort()) === JSON.stringify([...categories].sort());
    const hasLegacyCategory = Object.prototype.hasOwnProperty.call(data, 'category');

    if (sameCategories && !hasLegacyCategory) {
      unchanged += 1;
      continue;
    }

    const updates = { categories, updatedAt: new Date().toISOString() };
    if (hasLegacyCategory) {
      updates.category = FieldValue.delete();
      removedLegacyField += 1;
    }

    await foods.doc(doc.id).set(updates, { merge: true });
    updated += 1;
  }

  console.log(`✅ Categories fixed. Updated: ${updated}, Unchanged: ${unchanged}`);
  console.log(`🧹 Legacy 'category' field cleared on ${removedLegacyField} docs`);
};

fixFoodCategories()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed to fix categories:', error);
    process.exit(1);
  });
