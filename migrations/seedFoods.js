/**
 * Seed the foods collection with sample African dishes.
 *
 * Usage:  npm run seed:foods
 */
import dotenv from 'dotenv';
dotenv.config();

import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { formatFood } from '../models/Food.js';

// ─── Helper: look up country id by code ────────────────────────
const getCountryMap = async () => {
  const snapshot = await db.collection(COLLECTIONS.COUNTRIES).get();
  const map = {};
  snapshot.forEach((doc) => {
    const data = doc.data();
    map[data.code] = { id: doc.id, name: data.name };
  });
  return map;
};

// ─── Sample food data (country referenced by code) ─────────────
const makeFoods = (countryMap) => {
  const c = (code) => countryMap[code] || { id: '', name: '' };

  return [
    // ── Nigeria ────────────────────────────────
    {
      name: 'Jollof Rice',
      localName: 'Jollof',
      description: 'One-pot tomato rice cooked with spices — the undisputed king of West African cuisine.',
      countryId: c('NG').id, countryName: c('NG').name,
      categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'],
      targetAudience: ['university-students', 'young-professionals', 'everyone'],
      difficulty: 'medium', prepTime: 20, cookTime: 45, servings: 6,
      estimatedCost: '$5–8',
      ingredients: ['2 cups long-grain rice', '6 Roma tomatoes', '3 red bell peppers', '3 scotch bonnets', '1 large onion', '1/3 cup vegetable oil', '2 tbsp tomato paste', '2 tsp curry powder', '1 tsp thyme', 'Bay leaves', 'Salt to taste', '3 cups chicken stock'],
      instructions: ['Blend tomatoes, peppers, and scotch bonnets until smooth.', 'Fry diced onion in oil until golden.', 'Add tomato paste, fry 2 minutes.', 'Pour in blended pepper mix, cook on medium until oil floats (about 30 min).', 'Add spices, stock, and salt. Bring to a boil.', 'Wash rice and add to the pot. Stir once.', 'Cover tightly and cook on low heat for 30 minutes without opening the lid.', 'Fluff with a fork and serve.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
      tags: ['jollof', 'rice', 'party', 'west-african'],
      isFeatured: true, rating: 4.9,
    },
    {
      name: 'Suya',
      localName: 'Tsire',
      description: 'Spicy grilled beef skewers coated in ground peanut spice mix — Nigeria\'s favourite street food.',
      countryId: c('NG').id, countryName: c('NG').name,
      categories: ['street-food', 'snacks', 'dinner', 'quick-meals'],
      targetAudience: ['university-students', 'young-professionals', 'everyone'],
      difficulty: 'easy', prepTime: 30, cookTime: 15, servings: 4,
      estimatedCost: '$3–5',
      ingredients: ['500 g beef sirloin (thinly sliced)', '1/2 cup yaji spice (ground peanuts, ginger, paprika, cayenne)', '2 tbsp vegetable oil', '1 large onion (sliced rings)', 'Salt to taste', 'Wooden skewers'],
      instructions: ['Soak wooden skewers in water for 30 minutes.', 'Rub sliced beef with oil, salt, and half the yaji spice.', 'Thread onto skewers.', 'Grill over charcoal or high heat for 5–7 min per side.', 'Sprinkle remaining yaji over hot skewers.', 'Serve with sliced onion and tomatoes on newspaper strips.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
      tags: ['suya', 'grill', 'street-food', 'spicy'],
      isFeatured: true, rating: 4.8,
    },
    {
      name: 'Egusi Soup',
      localName: 'Ofe Egusi',
      description: 'Rich melon-seed soup with leafy greens, meat, and stockfish — perfect with pounded yam.',
      countryId: c('NG').id, countryName: c('NG').name,
      categories: ['lunch', 'dinner', 'traditional'],
      targetAudience: ['everyone'],
      difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 6,
      estimatedCost: '$8–12',
      ingredients: ['2 cups ground egusi (melon seeds)', '500 g assorted meat', '1 cup palm oil', '3 cups chopped spinach or bitter leaf', '2 scotch bonnets', '1 onion', '2 tbsp crayfish', 'Stockfish pieces', 'Seasoning cubes', 'Salt'],
      instructions: ['Boil assorted meat with onion, seasoning, and salt until tender. Reserve stock.', 'Heat palm oil (do not bleach). Add chopped onion and fry.', 'Mix ground egusi with a little water to form a paste. Add to oil in lumps.', 'Fry egusi for 5 minutes, then add meat stock gradually.', 'Add crayfish, scotch bonnets, and meat. Simmer 15 minutes.', 'Stir in leafy greens, cook 5 more minutes.', 'Serve with pounded yam, fufu, or eba.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/EGUSI.JPG/960px-EGUSI.JPG',
      tags: ['soup', 'egusi', 'traditional', 'pounded-yam'],
      isFeatured: false, rating: 4.7,
    },

    // ── Ghana ──────────────────────────────────
    {
      name: 'Waakye',
      localName: 'Waakye',
      description: 'Rice and beans cooked with dried millet stalks giving a distinctive reddish-brown colour. Ghana\'s beloved breakfast.',
      countryId: c('GH').id, countryName: c('GH').name,
      categories: ['breakfast', 'lunch', 'budget-friendly', 'street-food'],
      targetAudience: ['university-students', 'young-professionals', 'everyone'],
      difficulty: 'easy', prepTime: 10, cookTime: 50, servings: 4,
      estimatedCost: '$2–4',
      ingredients: ['2 cups rice', '1 cup black-eyed beans', 'Dried millet stalks (waakye leaves)', 'Water', 'Salt'],
      instructions: ['Soak beans for 4 hours or overnight.', 'Boil beans with millet stalks for 30 minutes until half-cooked.', 'Add washed rice and enough water. Cover.', 'Cook on medium heat until water is absorbed and rice is soft.', 'Serve with shito (pepper sauce), spaghetti, gari, boiled egg, and protein of choice.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Waakye_with_vegetables%2C_fish_and_egg_with_ripe_plantains.jpg',
      tags: ['waakye', 'rice-and-beans', 'breakfast', 'ghanaian'],
      isFeatured: true, rating: 4.6,
    },
    {
      name: 'Kelewele',
      localName: 'Kelewele',
      description: 'Spiced fried plantain cubes — a popular Ghanaian street snack seasoned with ginger and chilli.',
      countryId: c('GH').id, countryName: c('GH').name,
      categories: ['snacks', 'street-food', 'quick-meals'],
      targetAudience: ['university-students', 'everyone'],
      difficulty: 'easy', prepTime: 10, cookTime: 10, servings: 2,
      estimatedCost: '$1–2',
      ingredients: ['3 ripe plantains', '1 tbsp grated ginger', '1 tsp cayenne pepper', '1/2 tsp anise/nutmeg', 'Salt', 'Vegetable oil for frying'],
      instructions: ['Peel plantains and dice into cubes.', 'Toss with ginger, cayenne, anise, and salt.', 'Let marinate 10 minutes.', 'Deep fry in hot oil until golden and crispy.', 'Drain on paper towels and serve warm.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Ghanaian_fruit_pineapple_and_taro_leaves_%28masterclass_dish%29.jpg/960px-Ghanaian_fruit_pineapple_and_taro_leaves_%28masterclass_dish%29.jpg',
      tags: ['plantain', 'fried', 'street-food', 'spicy'],
      isFeatured: false, rating: 4.5,
    },

    // ── Ethiopia ────────────────────────────────
    {
      name: 'Doro Wat',
      localName: 'ዶሮ ወጥ',
      description: 'Ethiopian chicken stew simmered in berbere spice and niter kibbeh — the crown jewel of Ethiopian cuisine.',
      countryId: c('ET').id, countryName: c('ET').name,
      categories: ['dinner', 'traditional', 'festive'],
      targetAudience: ['everyone'],
      difficulty: 'hard', prepTime: 30, cookTime: 90, servings: 6,
      estimatedCost: '$10–15',
      ingredients: ['1 whole chicken (cut into pieces)', '4 large onions (finely diced)', '3 tbsp berbere spice', '3 tbsp niter kibbeh (spiced butter)', '4 hard-boiled eggs', 'Juice of 1 lemon', '2 cloves garlic', '1 tbsp ginger', 'Salt'],
      instructions: ['Marinate chicken pieces in lemon juice and salt for 30 minutes.', 'Dry-fry onions in a pot (no oil) stirring constantly until deep brown, ~20 min.', 'Add niter kibbeh and garlic-ginger paste. Fry 5 minutes.', 'Stir in berbere spice with a splash of water to prevent burning.', 'Add chicken and coat well. Pour enough water to half-cover.', 'Simmer covered on low for 45–60 minutes.', 'Score hard-boiled eggs and nestle into the stew for the last 15 minutes.', 'Serve on injera.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Ethiopian_wat.jpg/960px-Ethiopian_wat.jpg',
      tags: ['doro-wat', 'chicken', 'berbere', 'ethiopian', 'injera'],
      isFeatured: true, rating: 4.8,
    },

    // ── South Africa ───────────────────────────
    {
      name: 'Bobotie',
      localName: 'Bobotie',
      description: 'South African spiced mince bake topped with a savoury egg custard — Cape Malay comfort food.',
      countryId: c('ZA').id, countryName: c('ZA').name,
      categories: ['dinner', 'traditional'],
      targetAudience: ['young-professionals', 'everyone'],
      difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 6,
      estimatedCost: '$7–10',
      ingredients: ['500 g beef mince', '2 slices white bread (soaked in milk)', '1 onion diced', '2 tbsp curry powder', '1 tbsp turmeric', '2 tbsp chutney', '1/4 cup raisins', '2 eggs', '1 cup milk', 'Bay leaves', 'Salt & pepper'],
      instructions: ['Preheat oven to 180 °C.', 'Fry onion until soft. Add mince and brown well.', 'Stir in curry, turmeric, chutney, raisins, and squeezed bread.', 'Season and transfer to an oven dish. Tuck in bay leaves.', 'Beat eggs with milk, pour over the mince.', 'Bake 30–40 minutes until custard is set and golden.', 'Serve with yellow rice and sambals.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Bobotie%2C_South_African_dish.jpg/960px-Bobotie%2C_South_African_dish.jpg',
      tags: ['bobotie', 'cape-malay', 'south-african', 'bake'],
      isFeatured: true, rating: 4.7,
    },

    // ── Kenya ──────────────────────────────────
    {
      name: 'Nyama Choma',
      localName: 'Nyama Choma',
      description: 'Kenya\'s signature roasted/grilled meat — usually goat or beef — enjoyed with ugali and kachumbari.',
      countryId: c('KE').id, countryName: c('KE').name,
      categories: ['dinner', 'traditional', 'street-food'],
      targetAudience: ['everyone'],
      difficulty: 'medium', prepTime: 15, cookTime: 60, servings: 6,
      estimatedCost: '$8–15',
      ingredients: ['1 kg goat ribs or beef', 'Salt', 'Lemon juice', 'Kachumbari (tomato-onion salsa)', 'Ugali (maize meal)'],
      instructions: ['Season meat with salt and a squeeze of lemon.', 'Slow-roast over charcoal, turning frequently, until browned on all edges and cooked through (~1 hour).', 'Cut into pieces with a sharp knife.', 'Serve with ugali, kachumbari, and a cold Tusker.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg/960px-Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg',
      tags: ['grill', 'goat', 'roast', 'kenyan'],
      isFeatured: true, rating: 4.8,
    },

    // ── Morocco ─────────────────────────────────
    {
      name: 'Chicken Tagine',
      localName: 'Tajine Djaj',
      description: 'Slow-cooked Moroccan chicken with preserved lemons and olives in a conical clay pot.',
      countryId: c('MA').id, countryName: c('MA').name,
      categories: ['dinner', 'traditional'],
      targetAudience: ['young-professionals', 'everyone'],
      difficulty: 'medium', prepTime: 20, cookTime: 60, servings: 4,
      estimatedCost: '$8–12',
      ingredients: ['1 whole chicken (quartered)', '2 preserved lemons', '1 cup green olives', '1 large onion', '3 cloves garlic', '1 tsp ginger', '1 tsp turmeric', '1/2 tsp saffron threads', 'Fresh cilantro', 'Olive oil', 'Salt & pepper'],
      instructions: ['Marinate chicken with garlic, ginger, turmeric, saffron, oil, salt, and pepper for 1 hour.', 'Layer sliced onions in the bottom of the tagine pot.', 'Place chicken on top, add marinade and a cup of water.', 'Cover and cook on low heat for 45 minutes.', 'Add preserved lemon slices and olives. Cook 15 more minutes.', 'Garnish with fresh cilantro and serve with crusty bread or couscous.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/ZnuTjn2a.jpg/960px-ZnuTjn2a.jpg',
      tags: ['tagine', 'moroccan', 'chicken', 'slow-cooked'],
      isFeatured: true, rating: 4.7,
    },

    // ── Senegal ─────────────────────────────────
    {
      name: 'Thiéboudienne',
      localName: 'Ceebu Jën',
      description: 'Senegal\'s national dish — fish and rice cooked in a rich tomato sauce with vegetables.',
      countryId: c('SN').id, countryName: c('SN').name,
      categories: ['lunch', 'dinner', 'traditional'],
      targetAudience: ['everyone'],
      difficulty: 'hard', prepTime: 30, cookTime: 60, servings: 6,
      estimatedCost: '$6–10',
      ingredients: ['1 kg firm white fish (thiof or grouper)', '3 cups broken rice', '1 can tomato paste', '4 tomatoes', '1 onion', '2 carrots', '1 eggplant', '1 cabbage wedge', '1 cassava piece', 'Tamarind', 'Parsley', 'Scotch bonnet', 'Oil', 'Salt', 'Fish stock cube'],
      instructions: ['Stuff fish with a paste of parsley, garlic, and scotch bonnet.', 'Fry fish in oil until browned. Remove and set aside.', 'In same oil, fry onion and tomato paste until dark red.', 'Add tomatoes, water, and all vegetables. Simmer 25 min.', 'Remove vegetables, add rice to the broth. Cover and cook 20 min.', 'Layer rice on a platter, arrange fish and vegetables on top.', 'Serve with lime wedges.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Thieboudienne.JPG/960px-Thieboudienne.JPG',
      tags: ['thieboudienne', 'fish-rice', 'senegalese', 'ceebu-jen'],
      isFeatured: true, rating: 4.9,
    },

    // ── Cameroon ────────────────────────────────
    {
      name: 'Ndolé',
      localName: 'Ndolé',
      description: 'Cameroon\'s national dish — bitter leaves stewed with groundnuts, crayfish, and meat or prawns.',
      countryId: c('CM').id, countryName: c('CM').name,
      categories: ['lunch', 'dinner', 'traditional'],
      targetAudience: ['everyone'],
      difficulty: 'hard', prepTime: 40, cookTime: 60, servings: 6,
      estimatedCost: '$8–12',
      ingredients: ['500 g bitter leaves (ndolé)', '1 cup raw peanuts', '500 g prawns or beef', '1 cup crayfish', '1 onion', '3 cloves garlic', 'Palm oil', 'Seasoning cubes', 'Salt'],
      instructions: ['Wash bitter leaves multiple times to reduce bitterness, then boil and squeeze dry.', 'Roast and grind peanuts into a smooth paste.', 'Cook meat or prawns until tender. Reserve stock.', 'Fry onion and garlic in palm oil.', 'Add peanut paste and fry 5 minutes.', 'Add meat stock, bitter leaves, crayfish, and meat. Simmer 30 min.', 'Adjust seasoning and serve with plantains or miondo.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Ndol%C3%A8_%C3%A0_la_viande%2C_morue_et_crevettes.jpg',
      tags: ['ndole', 'bitter-leaves', 'cameroon', 'peanut'],
      isFeatured: false, rating: 4.6,
    },

    // ── Egypt ───────────────────────────────────
    {
      name: 'Koshari',
      localName: 'كشري',
      description: 'Egypt\'s beloved street food — layers of rice, lentils, pasta, and chickpeas topped with spicy tomato sauce and crispy onions.',
      countryId: c('EG').id, countryName: c('EG').name,
      categories: ['lunch', 'street-food', 'budget-friendly', 'vegetarian', 'vegan'],
      targetAudience: ['university-students', 'young-professionals', 'everyone'],
      difficulty: 'easy', prepTime: 15, cookTime: 40, servings: 4,
      estimatedCost: '$2–4',
      ingredients: ['1 cup rice', '1 cup brown lentils', '1 cup elbow macaroni', '1 can chickpeas', '2 large onions (sliced thin)', '4 tomatoes or 1 can tomato sauce', '3 cloves garlic', '2 tbsp vinegar', '1 tsp cumin', 'Chilli flakes', 'Oil', 'Salt'],
      instructions: ['Cook lentils until tender. Cook rice separately. Cook macaroni al dente.', 'Make the tomato sauce: fry garlic, add tomatoes, vinegar, cumin, and chilli. Simmer 15 min.', 'Fry onion slices in oil until dark and crispy. Drain.', 'To serve: layer rice, lentils, and macaroni in a bowl.', 'Top with chickpeas, tomato sauce, and crispy onions.', 'Add extra chilli sauce (shatta) and vinegar-garlic dressing (dakka) to taste.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Egyptian_food_Koshary.jpg/960px-Egyptian_food_Koshary.jpg',
      tags: ['koshari', 'egyptian', 'vegan', 'street-food', 'carbs'],
      isFeatured: true, rating: 4.8,
    },

    // ── Uganda ──────────────────────────────────
    {
      name: 'Rolex',
      localName: 'Rolex',
      description: 'A Ugandan street food — omelette rolled in a chapati. Fast, filling, and beloved by students.',
      countryId: c('UG').id, countryName: c('UG').name,
      categories: ['breakfast', 'street-food', 'quick-meals', 'budget-friendly'],
      targetAudience: ['university-students', 'young-professionals'],
      difficulty: 'easy', prepTime: 5, cookTime: 5, servings: 1,
      estimatedCost: '$0.50–1',
      ingredients: ['1 chapati', '2 eggs', '1 tomato (sliced)', '1/2 onion (sliced)', 'Cabbage (shredded)', 'Green pepper', 'Salt & pepper', 'Oil'],
      instructions: ['Beat eggs with salt, pepper, and a splash of water.', 'Heat oil in a pan. Pour in egg and spread into a thin omelette.', 'Before fully set, place the chapati on top of the omelette.', 'Flip so chapati is on the bottom.', 'Add tomato, onion, cabbage, and pepper on one side.', 'Roll it up tightly like a wrap. Serve immediately.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Well_prepared_rolex_red_to_eat.jpg/960px-Well_prepared_rolex_red_to_eat.jpg',
      tags: ['rolex', 'egg-chapati', 'ugandan', 'street-food', 'quick'],
      isFeatured: true, rating: 4.7,
    },

    // ── Tanzania ────────────────────────────────
    {
      name: 'Zanzibar Pizza',
      localName: 'Zanzibar Pizza',
      description: 'Not Italian pizza — a crispy stuffed pancake filled with meat, egg, and vegetables. Iconic Forodhani night market treat.',
      countryId: c('TZ').id, countryName: c('TZ').name,
      categories: ['street-food', 'snacks', 'dinner'],
      targetAudience: ['university-students', 'everyone'],
      difficulty: 'medium', prepTime: 20, cookTime: 10, servings: 2,
      estimatedCost: '$1–3',
      ingredients: ['2 cups flour', 'Water', 'Salt', '200 g minced meat', '2 eggs', '1 onion', '1 green pepper', 'Cheese (optional)', 'Mayo & ketchup', 'Oil'],
      instructions: ['Make a soft dough from flour, water, and salt. Rest 30 minutes.', 'Brown the minced meat with onion and pepper.', 'Stretch dough paper-thin on an oiled surface.', 'Place meat filling in the centre, crack an egg on top, add cheese.', 'Fold edges over to form a square parcel.', 'Fry on a hot griddle with oil until crispy on both sides.', 'Drizzle with mayo and ketchup. Serve hot.'],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Foreign_agriculture_-weekly_magazine_of_the_United_States_Department_of_Agriculture%2C_Foreign_Agricultural_Service%2C_U.S._Department_of_Agriculture_%28IA_CAT10252662567%29.pdf/page1-960px-thumbnail.pdf.jpg',
      tags: ['zanzibar-pizza', 'street-food', 'tanzanian', 'night-market'],
      isFeatured: false, rating: 4.5,
    },
  ];
};

// ─── Seeder logic ──────────────────────────────────────────────
export const seedFoods = async (existingCountries) => {
  // Build country map
  const countryMap = existingCountries
    ? Object.fromEntries(existingCountries.map((c) => [c.code, { id: c.id, name: c.name }]))
    : await getCountryMap();

  const collectionRef = db.collection(COLLECTIONS.FOODS);

  // Clear existing data (batch deletes in chunks of 500)
  const existing = await collectionRef.get();
  if (!existing.empty) {
    const BATCH_SIZE = 500;
    for (let i = 0; i < existing.docs.length; i += BATCH_SIZE) {
      const batch = db.batch();
      existing.docs.slice(i, i + BATCH_SIZE).forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }
    console.log('  🗑️  Cleared existing foods');
  }

  const foodsData = makeFoods(countryMap);

  // Insert in batches
  const BATCH_SIZE = 500;
  const results = [];

  for (let i = 0; i < foodsData.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = foodsData.slice(i, i + BATCH_SIZE);

    for (const data of chunk) {
      const formatted = formatFood(data);
      const docRef = collectionRef.doc();
      batch.set(docRef, formatted);
      results.push({ id: docRef.id, ...formatted });
    }

    await batch.commit();
  }

  // Update food counts on countries
  const countryFoodCounts = {};
  for (const food of results) {
    if (food.countryId) {
      countryFoodCounts[food.countryId] = (countryFoodCounts[food.countryId] || 0) + 1;
    }
  }

  const countBatch = db.batch();
  for (const [countryId, count] of Object.entries(countryFoodCounts)) {
    countBatch.update(db.collection(COLLECTIONS.COUNTRIES).doc(countryId), { foodCount: count });
  }
  await countBatch.commit();

  return results;
};

// ─── Run standalone ────────────────────────────────────────────
const isMainModule = process.argv[1]?.replace(/\\/g, '/').endsWith('seedFoods.js');

if (isMainModule) {
  console.log('🍲 Seeding foods…');
  seedFoods()
    .then((foods) => {
      console.log(`✅ Seeded ${foods.length} foods`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}
