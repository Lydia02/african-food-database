import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { NUTRITION_REFERENCE } from '../data/nutritionReference.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, '../data/localReferenceOverrides.js');

const normalizeFoodKey = (value = '') => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\(.*?\)/g, '')
  .replace(/[^a-z0-9\s-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const PROFILES = {
  soup: { calories: 85, protein: '4g', carbs: '8g', fat: '4g', fiber: '2g', sodium: '250mg' },
  stew: { calories: 160, protein: '8g', carbs: '10g', fat: '10g', fiber: '2g', sodium: '280mg' },
  rice: { calories: 170, protein: '4g', carbs: '30g', fat: '4g', fiber: '1.5g', sodium: '220mg' },
  porridge: { calories: 125, protein: '3.5g', carbs: '24g', fat: '1.5g', fiber: '2g', sodium: '35mg' },
  bread: { calories: 280, protein: '8g', carbs: '45g', fat: '7g', fiber: '2g', sodium: '320mg' },
  fried: { calories: 290, protein: '6g', carbs: '26g', fat: '18g', fiber: '1.5g', sodium: '320mg' },
  meat: { calories: 230, protein: '22g', carbs: '4g', fat: '14g', fiber: '0g', sodium: '240mg' },
  fish: { calories: 185, protein: '20g', carbs: '4g', fat: '10g', fiber: '0.5g', sodium: '220mg' },
  beans: { calories: 145, protein: '8g', carbs: '22g', fat: '2g', fiber: '6g', sodium: '120mg' },
  salad: { calories: 70, protein: '2g', carbs: '8g', fat: '3g', fiber: '2g', sodium: '120mg' },
  drink: { calories: 45, protein: '0.5g', carbs: '11g', fat: '0g', fiber: '0g', sodium: '15mg', sugar: '8g' },
  default: { calories: 155, protein: '5g', carbs: '18g', fat: '7g', fiber: '2g', sodium: '180mg' },
};

const pickProfile = ({ name = '', tags = [], categories = [] }) => {
  const joined = `${name} ${(tags || []).join(' ')} ${(categories || []).join(' ')}`.toLowerCase();

  if (/(juice|drink|coffee|tea|wine|sodabi|beverage)/.test(joined)) return PROFILES.drink;
  if (/(salad|slaw|taktouka)/.test(joined)) return PROFILES.salad;
  if (/(beans|lentil|cowpea|waakye|githeri)/.test(joined)) return PROFILES.beans;
  if (/(fish|tilapia|sardine|mackerel|seafood)/.test(joined)) return PROFILES.fish;
  if (/(goat|beef|lamb|chicken|meat|suya|nyama|kebab|hawawshi)/.test(joined)) return PROFILES.meat;
  if (/(fried|doughnut|puff|chip|fries|samosa|akara|mikate|makala)/.test(joined)) return PROFILES.fried;
  if (/(bread|chapati|pizza|flatbread|injera)/.test(joined)) return PROFILES.bread;
  if (/(porridge|pap|ogi|bogobe|fouti|asida)/.test(joined)) return PROFILES.porridge;
  if (/(rice|pilau|jollof|kushari|koshari|bariis|iskukaris)/.test(joined)) return PROFILES.rice;
  if (/(soup|broth|fah-fah|chorba|harira)/.test(joined)) return PROFILES.soup;
  if (/(stew|mafe|domoda|dovi|matapa|mbika)/.test(joined)) return PROFILES.stew;

  return PROFILES.default;
};

const BASE_REFERENCE_ENTRIES = Object.entries(NUTRITION_REFERENCE).map(([key, data]) => ({
  key,
  data,
  normalizedKey: normalizeFoodKey(key),
}));

const hasBaseReferenceMatch = (name = '') => {
  const normalized = normalizeFoodKey(name);
  if (!normalized) return false;

  const exact = BASE_REFERENCE_ENTRIES.find(({ normalizedKey }) => normalizedKey === normalized);
  if (exact) return true;

  const contains = BASE_REFERENCE_ENTRIES.find(
    ({ normalizedKey }) => normalized.includes(normalizedKey) || normalizedKey.includes(normalized)
  );
  if (contains) return true;

  const words = normalized.split(/\s+/);
  return BASE_REFERENCE_ENTRIES.some(({ normalizedKey }) => {
    const keyWords = normalizedKey.split(/\s+/);
    return keyWords.every((kw) => words.some((w) => w === kw || w.includes(kw)));
  });
};

const normalizeNutrition = (nutritionInfo = {}) => {
  const calories = Number(nutritionInfo.calories) || 0;

  const normalized = {
    calories,
    protein: nutritionInfo.protein || '',
    carbs: nutritionInfo.carbs || '',
    fat: nutritionInfo.fat || '',
  };

  const optionalFields = ['fiber', 'sodium', 'sugar', 'iron', 'calcium', 'vitaminA', 'vitaminC'];
  optionalFields.forEach((field) => {
    if (nutritionInfo[field]) normalized[field] = nutritionInfo[field];
  });

  return normalized;
};

const generateLocalReferenceOverrides = async () => {
  console.log('🧠 Generating local reference overrides from Firestore...');

  const snapshot = await db.collection(COLLECTIONS.FOODS).get();
  const overrides = {};
  const imageOverrides = {};
  let generatedHeuristic = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    const name = (data.name || '').replace(/\(.*?\)/g, '').trim();
    if (!name) return;

    if (hasBaseReferenceMatch(name)) return;

    const nutrition = normalizeNutrition(data.nutritionInfo || data.nutrition || {});
    const hasCoreNutrition = nutrition.calories || nutrition.protein || nutrition.carbs || nutrition.fat;
    const finalNutrition = hasCoreNutrition
      ? nutrition
      : { ...pickProfile({ name, tags: data.tags, categories: data.categories }) };

    if (!hasCoreNutrition) generatedHeuristic += 1;

    const key = normalizeFoodKey(name);
    overrides[key] = finalNutrition;

    if (data.imageUrl && typeof data.imageUrl === 'string' && data.imageUrl.trim()) {
      imageOverrides[key] = data.imageUrl.trim();
    }
  });

  const content = `/**\n * Auto-generated local nutrition and image reference overrides.\n *\n * Generated by: npm run reference:sync\n * Source: Firestore foods collection\n */\nexport const LOCAL_REFERENCE_OVERRIDES = ${JSON.stringify(overrides, null, 2)};\n\nexport const LOCAL_IMAGE_OVERRIDES = ${JSON.stringify(imageOverrides, null, 2)};\n\nexport default { LOCAL_REFERENCE_OVERRIDES, LOCAL_IMAGE_OVERRIDES };\n`;

  fs.writeFileSync(outputFile, content, 'utf8');

  console.log(`✅ Generated ${Object.keys(overrides).length} override entries`);
  console.log(`🖼️ Generated ${Object.keys(imageOverrides).length} image override entries`);
  console.log(`🧩 Generated ${generatedHeuristic} heuristic nutrition entries`);
  console.log(`📄 Wrote: ${outputFile}`);
};

generateLocalReferenceOverrides()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed to generate local reference overrides:', error);
    process.exit(1);
  });
