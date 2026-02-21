import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { LOCAL_IMAGE_OVERRIDES } from '../data/localReferenceOverrides.js';
import { getWikipediaFoodInfo } from '../services/externalApiService.js';

const normalizeFoodKey = (value = '') => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\(.*?\)/g, '')
  .replace(/[^a-z0-9\s-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MANUAL_IMAGE_OVERRIDES = {
  ikokore: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Water_Yam_Porridge_03.jpg/960px-Water_Yam_Porridge_03.jpg',
  'edo black soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Efo_Riro_with_fried_mackerel_fishes_and_roasted_cowskin.jpg/960px-Efo_Riro_with_fried_mackerel_fishes_and_roasted_cowskin.jpg',
  sodabi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Palm_wine.jpg/960px-Palm_wine.jpg',
  'fah-fah': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Igbo_cuisine%2C_ofe_nsala.jpg/960px-Igbo_cuisine%2C_ofe_nsala.jpg',
  taktouka: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Shakshouka.jpg/960px-Shakshouka.jpg',
  'sisi pelebe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
};

const fixMissingImages = async () => {
  console.log('🖼️ Fixing missing images...');
  const snapshot = await db.collection(COLLECTIONS.FOODS).get();
  const missing = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((food) => !food.imageUrl || !String(food.imageUrl).trim());

  console.log(`🔍 Found ${missing.length} foods missing imageUrl`);
  if (missing.length === 0) {
    console.log('✅ No missing images found.');
    return;
  }

  let fixedFromLocal = 0;
  let fixedFromManual = 0;
  let fixedFromWiki = 0;
  let unresolved = 0;

  for (const food of missing) {
    const key = normalizeFoodKey(food.name || '');
    const manualImage = MANUAL_IMAGE_OVERRIDES[key];
    if (manualImage) {
      await db.collection(COLLECTIONS.FOODS).doc(food.id).update({
        imageUrl: manualImage,
        updatedAt: new Date().toISOString(),
      });
      fixedFromManual += 1;
      continue;
    }

    const localImage = LOCAL_IMAGE_OVERRIDES[key];

    if (localImage) {
      await db.collection(COLLECTIONS.FOODS).doc(food.id).update({
        imageUrl: localImage,
        updatedAt: new Date().toISOString(),
      });
      fixedFromLocal += 1;
      continue;
    }

    const wiki = await getWikipediaFoodInfo(food.name);
    if (wiki?.imageUrl) {
      await db.collection(COLLECTIONS.FOODS).doc(food.id).update({
        imageUrl: wiki.imageUrl,
        wikiUrl: wiki.wikiUrl || food.wikiUrl || '',
        updatedAt: new Date().toISOString(),
      });
      fixedFromWiki += 1;
    } else {
      unresolved += 1;
      console.log(`  ⚠️ No image found for: ${food.name}`);
    }

    await sleep(350);
  }

  console.log(`✅ Image fix complete. manual=${fixedFromManual}, local=${fixedFromLocal}, wiki=${fixedFromWiki}, unresolved=${unresolved}`);
};

fixMissingImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed to fix missing images:', error);
    process.exit(1);
  });
