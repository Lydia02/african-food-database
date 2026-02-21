import { LOCAL_IMAGE_OVERRIDES } from '../data/localReferenceOverrides.js';

export const normalizeFoodKey = (value = '') => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\(.*?\)/g, '')
  .replace(/[^a-z0-9\s-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const MANUAL_NUTRITION_PROFILES = {
  soup: { calories: 85, protein: '4g', carbs: '8g', fat: '4g', fiber: '2g', sodium: '250mg' },
  stew: { calories: 165, protein: '8g', carbs: '10g', fat: '10g', fiber: '2g', sodium: '280mg' },
  rice: { calories: 175, protein: '4g', carbs: '30g', fat: '4g', fiber: '1.5g', sodium: '220mg' },
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

export const inferManualNutritionProfile = ({ name = '', tags = [], categories = [] }) => {
  const joined = `${name} ${(tags || []).join(' ')} ${(categories || []).join(' ')}`.toLowerCase();

  if (/(juice|drink|coffee|tea|wine|sodabi|beverage)/.test(joined)) return MANUAL_NUTRITION_PROFILES.drink;
  if (/(salad|slaw|taktouka)/.test(joined)) return MANUAL_NUTRITION_PROFILES.salad;
  if (/(beans|lentil|cowpea|waakye|githeri|makande)/.test(joined)) return MANUAL_NUTRITION_PROFILES.beans;
  if (/(fish|tilapia|sardine|mackerel|seafood|chambo)/.test(joined)) return MANUAL_NUTRITION_PROFILES.fish;
  if (/(goat|beef|lamb|chicken|meat|suya|nyama|kebab|hawawshi|mutura|kapana)/.test(joined)) return MANUAL_NUTRITION_PROFILES.meat;
  if (/(fried|doughnut|puff|chip|fries|samosa|akara|mikate|makala|bofrot|vitumbuwa)/.test(joined)) return MANUAL_NUTRITION_PROFILES.fried;
  if (/(bread|chapati|pizza|flatbread|injera|kesra|lahoh|canjeero|gurasa)/.test(joined)) return MANUAL_NUTRITION_PROFILES.bread;
  if (/(porridge|pap|ogi|bogobe|fouti|asida|nsima|sishwala|kondowole)/.test(joined)) return MANUAL_NUTRITION_PROFILES.porridge;
  if (/(rice|pilau|jollof|kushari|koshari|bariis|iskukaris|wali|ampesi)/.test(joined)) return MANUAL_NUTRITION_PROFILES.rice;
  if (/(soup|broth|fah-fah|chorba|harira|pepesoup|maraq|nsala|gbegiri|onugbu)/.test(joined)) return MANUAL_NUTRITION_PROFILES.soup;
  if (/(stew|mafe|domoda|dovi|matapa|mbika|caldou|daraba|romazava|zigni|walwal)/.test(joined)) return MANUAL_NUTRITION_PROFILES.stew;

  return MANUAL_NUTRITION_PROFILES.default;
};

export const getManualImageOverride = (name = '') => {
  const key = normalizeFoodKey(name);
  return LOCAL_IMAGE_OVERRIDES[key] || '';
};

export const buildFallbackDescription = ({ name = '', countryName = '', tags = [] }) => {
  const cleanedName = String(name || '').replace(/\(.*?\)/g, '').trim();
  const prettyTags = (tags || [])
    .map((tag) => String(tag).replace(/-/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 3);

  const regionText = countryName ? ` from ${countryName}` : '';
  const tagText = prettyTags.length ? ` It is commonly associated with ${prettyTags.join(', ')} flavors.` : '';

  return `${cleanedName} is a traditional African dish${regionText}.${tagText} PantryPal description added from manual fallback enrichment.`.trim();
};

export default {
  normalizeFoodKey,
  inferManualNutritionProfile,
  getManualImageOverride,
  buildFallbackDescription,
};
