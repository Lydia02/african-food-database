/**
 * Seed North African foods.
 * Countries: Egypt, Morocco, Tunisia, Algeria, Libya
 */
import dotenv from 'dotenv';
dotenv.config();

import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { formatFood } from '../models/Food.js';

const getCountryMap = async (codes) => {
  const map = {};
  for (const code of codes) {
    const snap = await db.collection(COLLECTIONS.COUNTRIES).where('code', '==', code).limit(1).get();
    if (!snap.empty) map[code] = { id: snap.docs[0].id, name: snap.docs[0].data().name };
  }
  return map;
};

const makeFoods = (c) => [

  // ═══════════════════════════════════════════════════════════════
  //  EGYPT 🇪🇬
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Koshari', localName: 'Koshari / Koshary',
    description: 'Egypt\'s national dish — layers of rice, lentils, macaroni, and chickpeas topped with spicy tomato sauce and crispy onions. Street food perfection.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Cairo / Nationwide',
    categories: ['lunch', 'dinner', 'street-food', 'vegan', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: '30–60 EGP',
    ingredients: ['1 cup rice', '1 cup brown lentils', '1 cup elbow macaroni', '1 can chickpeas', '4 onions (sliced thin)', 'Tomato sauce (6 tomatoes, garlic, vinegar, cumin, chilli)', 'Oil for frying', 'Salt'],
    instructions: ['Cook lentils until tender. Cook rice. Cook pasta. Drain all.', 'Make sauce: blend tomatoes, cook with garlic, vinegar, cumin, chilli 15 min.', 'Fry sliced onions in oil until very crispy and dark.', 'Layer in bowl: rice, lentils, pasta, chickpeas.', 'Pour spicy tomato sauce generously on top.', 'Crown with crispy onions.', 'Add extra chilli vinegar (dakka) to taste.'],
    tags: ['koshari', 'koshary', 'cairo', 'vegan', 'street-food', 'egypt'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Egyptian_food_Koshary.jpg/960px-Egyptian_food_Koshary.jpg',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Ful Medames', localName: 'Ful Medames',
    description: 'Slow-simmered fava beans — Egypt\'s ancient breakfast, eaten for millennia. Drizzled with oil, lemon, and cumin.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['breakfast', 'traditional', 'vegan', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 15, servings: 4,
    estimatedCost: '10–25 EGP',
    ingredients: ['2 cups fava beans (canned or overnight-soaked)', 'Olive oil', 'Lemon juice', 'Cumin', 'Garlic', 'Parsley', 'Salt', 'Tahini (optional)', 'Bread (baladi)'],
    instructions: ['Warm beans in their liquid.', 'Mash slightly — chunky is traditional.', 'Season with cumin, garlic, lemon juice, salt.', 'Drizzle olive oil, sprinkle parsley.', 'Serve with warm baladi bread, pickles, and vegetables.'],
    tags: ['ful-medames', 'fava', 'breakfast', 'vegan', 'egypt'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Ful_medames_%28arabic_meal%29.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Molokhia', localName: 'Molokhia / Mulukhiyah',
    description: 'Egyptian "green soup" — finely chopped jute leaves in garlic broth, served over rice with chicken. Silky and addictive.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 30, servings: 6,
    estimatedCost: '40–80 EGP',
    ingredients: ['500 g molokhia leaves (fresh or frozen, chopped)', 'Chicken broth (from whole chicken)', 'Garlic (8 cloves)', 'Coriander (ground)', 'Ghee or oil', 'Chicken', 'Rice', 'Salt'],
    instructions: ['Cook a whole chicken in water for broth. Shred chicken.', 'Add finely chopped molokhia leaves to hot broth.', 'Bring to a brief boil — DO NOT overcook.', 'Make ta\'aleya: fry minced garlic and coriander in ghee until golden.', 'Add sizzling ta\'aleya to the molokhia pot.', 'Serve over white rice with shredded chicken.'],
    tags: ['molokhia', 'jute-leaves', 'soup', 'egypt'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Molokheya_Egypt%2C_2012.JPG/960px-Molokheya_Egypt%2C_2012.JPG',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Taameya (Egyptian Falafel)', localName: 'Ta\'ameya',
    description: 'Egyptian falafel made with fava beans (not chickpeas!) — bright green inside, crispy outside. Superior falafel.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['breakfast', 'street-food', 'vegan'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 15, servings: 6,
    estimatedCost: '15–30 EGP',
    ingredients: ['2 cups dried fava beans (soaked overnight)', 'Fresh herbs (parsley, dill, coriander)', 'Onion', 'Garlic', 'Cumin, coriander seeds', 'Baking powder', 'Sesame seeds', 'Oil for frying'],
    instructions: ['Soak fava beans 24 hours. DO NOT cook. Drain.', 'Blend beans with herbs, onion, garlic, and spices.', 'Add baking powder. Mix well.', 'Shape into flat patties. Dip in sesame seeds.', 'Deep fry until golden and crispy (green inside).', 'Serve in baladi bread with tahini, salad, and pickles.'],
    tags: ['taameya', 'falafel', 'fava', 'street-food', 'egypt'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Beans_Ball-Akara.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Mahshi (Stuffed Vegetables)', localName: 'Mahshi',
    description: 'Egyptian art of stuffed vegetables — grape leaves, cabbage, peppers, and zucchini filled with herbed rice. A labour of love.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 45, cookTime: 60, servings: 8,
    estimatedCost: '60–120 EGP',
    ingredients: ['Grape leaves, cabbage, zucchini, bell peppers', 'Rice filling: 2 cups rice, tomato, onion, dill, parsley, coriander', 'Tomato sauce', 'Lemon juice', 'Oil', 'Salt'],
    instructions: ['Core zucchini and peppers. Blanch grape leaves and cabbage.', 'Mix rice with diced tomato, onion, herbs, oil, salt.', 'Stuff each vegetable. Roll grape leaves and cabbage.', 'Line pot bottom with extra leaves.', 'Layer stuffed vegetables tightly.', 'Add tomato sauce, lemon juice, and water to cover.', 'Weight with a plate. Cook on low 1 hour.'],
    tags: ['mahshi', 'stuffed', 'grape-leaves', 'egypt'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Molokheya_Egypt%2C_2012.JPG/960px-Molokheya_Egypt%2C_2012.JPG',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Hawawshi', localName: 'Hawawshi',
    description: 'Spiced minced meat stuffed in baladi bread and baked/grilled — Egypt\'s most beloved quick snack.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Alexandria / Nationwide',
    categories: ['lunch', 'street-food', 'quick-meals'], targetAudience: ['university-students', 'young-professionals', 'everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 15, servings: 4,
    estimatedCost: '20–40 EGP',
    ingredients: ['500 g minced beef', 'Onion (grated)', 'Green pepper', 'Chilli', 'Cumin', 'Coriander', 'Parsley', '4 baladi bread rounds', 'Oil', 'Salt'],
    instructions: ['Mix mince with grated onion, pepper, spices, and herbs.', 'Cut bread pockets open.', 'Stuff generously with meat mixture.', 'Brush outside with oil.', 'Bake at 200°C for 12–15 min until bread is crispy and meat cooked.', 'Serve hot with pickled vegetables.'],
    tags: ['hawawshi', 'meat-bread', 'street-food', 'egypt'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Egyptian_meatloaf.jpg/960px-Egyptian_meatloaf.jpg',
    isFeatured: false, rating: 4.7,
  },
  {
    name: 'Shawarma (Egyptian Style)', localName: 'Shawerma',
    description: 'Egyptian shawarma — thinly sliced marinated chicken or beef wrapped in bread with tahini, pickles, and garlic paste.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'street-food', 'quick-meals'], targetAudience: ['university-students', 'young-professionals', 'everyone'],
    difficulty: 'medium', prepTime: 60, cookTime: 20, servings: 4,
    estimatedCost: '30–60 EGP',
    ingredients: ['500 g chicken or beef (thin slices)', 'Yogurt, vinegar, spices (cumin, paprika, cardamom)', 'Garlic paste', 'Tahini', 'Pickles', 'Flatbread or pita', 'Tomato', 'Onion'],
    instructions: ['Marinate meat in yogurt and spices for 2+ hours.', 'Cook meat in batches on a very hot pan or grill.', 'Slice thin.', 'Warm bread. Spread with garlic paste and tahini.', 'Add meat, pickles, tomato, and onion.', 'Roll tight and grill the wrap.'],
    tags: ['shawarma', 'street-food', 'egypt'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Egyptian_meatloaf.jpg/960px-Egyptian_meatloaf.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Umm Ali (Egyptian Bread Pudding)', localName: 'Umm Ali',
    description: 'Egypt\'s legendary dessert — layers of puff pastry soaked in milk and cream with raisins, nuts, and coconut.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['desserts', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 6,
    estimatedCost: '40–80 EGP',
    ingredients: ['1 pack puff pastry (baked and crumbled)', '4 cups milk', '1 cup cream', '1/2 cup sugar', 'Mixed nuts (almonds, pistachios, walnuts)', 'Raisins', 'Coconut flakes', 'Vanilla', 'Cinnamon'],
    instructions: ['Bake puff pastry until golden. Break into pieces.', 'Layer pastry in a baking dish with nuts, raisins, and coconut.', 'Heat milk with sugar and vanilla.', 'Pour hot milk over pastry.', 'Spoon cream on top.', 'Broil until golden and bubbly.', 'Serve warm.'],
    tags: ['umm-ali', 'dessert', 'bread-pudding', 'egypt'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Egyptian-food-16.jpg/960px-Egyptian-food-16.jpg',
    isFeatured: true, rating: 4.8,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MOROCCO 🇲🇦
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Chicken Tagine with Preserved Lemons & Olives', localName: 'Tagine Djaj',
    description: 'Morocco\'s most iconic dish — slow-cooked chicken with preserved lemons and olives in a conical clay pot.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Fez / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 60, servings: 4,
    estimatedCost: '50–100 MAD',
    ingredients: ['1 whole chicken (pieces)', '2 preserved lemons', '1 cup green olives', '2 onions (grated)', 'Garlic', 'Ginger', 'Saffron', 'Coriander', 'Parsley', 'Oil', 'Salt'],
    instructions: ['Marinate chicken with grated onion, garlic, ginger, saffron, oil.', 'Place in tagine pot with marinade and water.', 'Cook on low 45 min, turning once.', 'Add preserved lemon pieces and olives.', 'Cook 15 more min.', 'Garnish with fresh coriander.', 'Serve with Moroccan bread or couscous.'],
    tags: ['tagine', 'chicken', 'preserved-lemon', 'olives', 'morocco'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/ZnuTjn2a.jpg/960px-ZnuTjn2a.jpg',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Couscous Royale', localName: 'Couscous',
    description: 'Morocco\'s Friday dish — steamed semolina couscous with seven vegetables, lamb, and a rich broth. A sacred tradition.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['lunch', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 90, servings: 8,
    estimatedCost: '80–150 MAD',
    ingredients: ['3 cups couscous', 'Lamb or chicken', 'Carrots, turnips, zucchini, pumpkin, cabbage, onions, chickpeas', 'Tomato paste', 'Ras el hanout', 'Saffron', 'Cinnamon', 'Butter', 'Salt'],
    instructions: ['Cook meat in a couscoussier base with onion, tomato, and spices.', 'Add vegetables in stages (hardest first).', 'Steam couscous over the stew 3 times, breaking up between each steaming.', 'Fluff final couscous with butter.', 'Mound couscous on platter, arrange meat and veg.', 'Ladle broth into a bowl on the side.', 'Serve family-style.'],
    tags: ['couscous', 'royale', 'friday', 'morocco'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/960px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Pastilla (B\'stilla)', localName: 'Bastilla / Pastilla',
    description: 'The crown jewel of Moroccan pastry — layers of warqa dough filled with pigeon/chicken, almonds, and cinnamon, dusted with sugar.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Fez',
    categories: ['dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 45, cookTime: 40, servings: 8,
    estimatedCost: '100–200 MAD',
    ingredients: ['1 kg chicken or pigeon', 'Warqa (filo) pastry sheets', 'Almonds (fried, ground)', 'Eggs', 'Onion', 'Parsley, coriander', 'Cinnamon', 'Sugar', 'Saffron', 'Butter', 'Salt'],
    instructions: ['Cook chicken in onion, spices, herbs, and saffron broth.', 'Shred meat. Reduce broth. Add beaten eggs to broth (scramble lightly).', 'Fry almonds, grind with cinnamon and sugar.', 'Layer buttered warqa sheets in a pan.', 'Layer: egg mixture, shredded meat, almond mixture.', 'Fold warqa over, add top layers, brush with butter.', 'Bake until golden and crispy.', 'Dust with cinnamon and powdered sugar.'],
    tags: ['pastilla', 'bstilla', 'fez', 'pastry', 'morocco'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Harira', localName: 'Harira',
    description: 'Morocco\'s Ramadan soup — tomato-based with lentils, chickpeas, lamb, and broken vermicelli. The iftar essential.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 60, servings: 8,
    estimatedCost: '40–80 MAD',
    ingredients: ['300 g lamb (cubed)', '1 cup lentils', '1 can chickpeas', 'Tomatoes (6, blended)', 'Onion', 'Celery', 'Broken vermicelli', 'Flour + water (tadouira)', 'Coriander, parsley', 'Ginger, turmeric, cinnamon', 'Salt', 'Dates and chebakia for serving'],
    instructions: ['Sauté lamb with onion and spices.', 'Add blended tomatoes and water.', 'Add lentils. Cook 30 min.', 'Add chickpeas and celery.', 'Make tadouira: mix flour with water, pour slowly.', 'Add vermicelli last 5 min.', 'Stir in fresh coriander and parsley.', 'Serve with dates, chebakia, and hard-boiled eggs.'],
    tags: ['harira', 'ramadan', 'soup', 'morocco'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Harira.png',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Moroccan Mint Tea', localName: 'Atay',
    description: 'Moroccan hospitality in a glass — Chinese gunpowder green tea with fresh mint and a LOT of sugar. Poured from height.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['beverages', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 10, servings: 4,
    estimatedCost: '5–15 MAD',
    ingredients: ['2 tbsp Chinese gunpowder green tea', 'Fresh mint (large bunch)', 'Sugar (generous)', 'Boiling water'],
    instructions: ['Add tea to teapot. Pour in boiling water, swirl and discard (rinse).', 'Add fresh mint leaves and sugar.', 'Add boiling water. Steep 3–5 min.', 'Pour a glass and return to pot (wake the tea) 2–3 times.', 'Serve by pouring from height to create foam.', 'Serve 3 glasses as tradition.'],
    tags: ['mint-tea', 'atay', 'beverage', 'morocco'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Harira.png',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Rfissa', localName: 'Rfissa / Trid',
    description: 'Shredded msemen flatbread layered with lentils and chicken in a fenugreek-spiced broth — served to new mothers.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 60, servings: 6,
    estimatedCost: '60–100 MAD',
    ingredients: ['Msemen or trid flatbread', 'Chicken', 'Lentils', 'Onion', 'Fenugreek', 'Ras el hanout', 'Saffron', 'Butter', 'Salt'],
    instructions: ['Cook chicken with onion, spices, and saffron.', 'Cook lentils separately.', 'Shred msemen into pieces.', 'Layer shredded bread, lentils, and chicken.', 'Pour rich broth over everything.', 'Serve hot — traditionally for postpartum recovery.'],
    tags: ['rfissa', 'trid', 'fenugreek', 'morocco'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Rfissa_marocaine.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  TUNISIA 🇹🇳
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Brik à l\'Oeuf', localName: 'Brik',
    description: 'Tunisia\'s legendary appetizer — a thin malsouka pastry shell encasing a runny egg, tuna, capers, and parsley.',
    countryId: c.TN.id, countryName: c.TN.name, region: 'Nationwide',
    categories: ['snacks', 'street-food', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 10, cookTime: 5, servings: 2,
    estimatedCost: '3–6 TND',
    ingredients: ['Malsouka (or filo) sheets', 'Eggs', 'Canned tuna', 'Capers', 'Parsley', 'Onion', 'Harissa', 'Lemon', 'Oil for frying'],
    instructions: ['Mix tuna with capers, parsley, and onion.', 'Lay a sheet of malsouka on work surface.', 'Place tuna mixture on one side.', 'Crack an egg on top (careful — it must stay runny).', 'Fold into a triangle. Seal edges.', 'Deep fry quickly — 2 min per side.', 'The egg inside should be barely set.', 'Serve immediately with lemon and harissa.'],
    tags: ['brik', 'egg', 'pastry', 'tunisia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Lablabi (Chickpea Soup)', localName: 'Lablabi',
    description: 'Tunisia\'s beloved winter street food — chickpeas in a garlicky cumin broth poured over stale bread, topped with egg and harissa.',
    countryId: c.TN.id, countryName: c.TN.name, region: 'Tunis / Nationwide',
    categories: ['breakfast', 'street-food', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '2–4 TND',
    ingredients: ['2 cups chickpeas (cooked)', 'Stale bread (torn)', 'Garlic', 'Cumin', 'Harissa', 'Olive oil', 'Lemon', 'Capers', 'Egg (soft-boiled or raw)', 'Tuna (optional)', 'Salt'],
    instructions: ['Place torn bread pieces in bowls.', 'Heat chickpeas in their broth with garlic and cumin.', 'Pour hot chickpeas and broth over bread.', 'Add harissa, olive oil, lemon juice.', 'Top with egg, capers, and tuna.', 'Stir everything together and eat immediately.'],
    tags: ['lablabi', 'chickpea', 'soup', 'street-food', 'tunisia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Bol_de_Leblabi_de_Tunisie%2C_21_mars_2017.jpg/960px-Bol_de_Leblabi_de_Tunisie%2C_21_mars_2017.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Couscous Tunisien', localName: 'Couscous',
    description: 'Tunisian spicy couscous — unlike Moroccan, it\'s fiery red from harissa, served with lamb and vegetables.',
    countryId: c.TN.id, countryName: c.TN.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 25, cookTime: 75, servings: 6,
    estimatedCost: '10–20 TND',
    ingredients: ['3 cups couscous', 'Lamb or chicken', 'Potatoes, carrots, zucchini, turnips, chickpeas', 'Tomato paste', 'Harissa', 'Garlic', 'Coriander seeds', 'Olive oil', 'Salt'],
    instructions: ['Cook meat with onion, tomato paste, harissa, and spices in water.', 'Add vegetables in stages.', 'Steam couscous over the stew 2–3 times.', 'Fluff with olive oil.', 'Serve couscous mounded with stew on top.'],
    tags: ['couscous', 'harissa', 'spicy', 'tunisia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/960px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Ojja (Tunisian Shakshuka)', localName: 'Ojja',
    description: 'Tunisia\'s version of shakshuka — eggs poached in spicy tomato-pepper sauce with merguez sausage or shrimp.',
    countryId: c.TN.id, countryName: c.TN.name, region: 'Nationwide',
    categories: ['breakfast', 'lunch', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 2,
    estimatedCost: '4–8 TND',
    ingredients: ['4 eggs', 'Tomatoes', 'Green peppers', 'Harissa', 'Merguez sausage or shrimp', 'Onion', 'Garlic', 'Olive oil', 'Cumin, caraway', 'Salt'],
    instructions: ['Sauté onion, garlic, and peppers in oil.', 'Add tomatoes and harissa. Cook 10 min.', 'Add sliced merguez or shrimp.', 'Make wells, crack eggs into sauce.', 'Cover and cook until eggs set.', 'Serve with crusty bread.'],
    tags: ['ojja', 'shakshuka', 'eggs', 'tunisia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Shakshuka_by_Calliopejen1.jpg/960px-Shakshuka_by_Calliopejen1.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ALGERIA 🇩🇿
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Couscous Algérois', localName: 'Couscous',
    description: 'Algerian couscous — the national dish, typically with lamb, chickpeas, and turnips in a tomato-based broth.',
    countryId: c.DZ.id, countryName: c.DZ.name, region: 'Algiers / Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 90, servings: 8,
    estimatedCost: '500–1,000 DZD',
    ingredients: ['3 cups couscous', 'Lamb', 'Chickpeas', 'Turnips, carrots, zucchini, potatoes', 'Tomato paste', 'Onion', 'Ras el hanout', 'Oil', 'Butter', 'Salt'],
    instructions: ['Cook lamb with onion, tomato paste, and spices.', 'Add vegetables in order of cooking time.', 'Steam couscous over stew 2–3 times.', 'Fluff with butter between steamings.', 'Serve couscous in a mound, meat and veg on top, broth on side.'],
    tags: ['couscous', 'algeria', 'lamb'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/960px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Chorba Frik (Freekeh Soup)', localName: 'Chorba Frik',
    description: 'Algeria\'s Ramadan soup — a hearty lamb and cracked green wheat (freekeh) soup with tomatoes and herbs.',
    countryId: c.DZ.id, countryName: c.DZ.name, region: 'Nationwide',
    categories: ['dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 60, servings: 8,
    estimatedCost: '300–600 DZD',
    ingredients: ['300 g lamb', 'Freekeh (cracked green wheat)', 'Tomatoes', 'Onion', 'Chickpeas', 'Coriander', 'Mint', 'Cinnamon', 'Black pepper', 'Salt'],
    instructions: ['Brown lamb with onion.', 'Add blended tomatoes and spices.', 'Add water, bring to boil.', 'Add rinsed freekeh and chickpeas.', 'Simmer 45 min until wheat is tender.', 'Add fresh herbs. Serve with bread and lemon.'],
    tags: ['chorba', 'frik', 'freekeh', 'ramadan', 'algeria'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Lemon_chicken_orzo_soup.jpg/960px-Lemon_chicken_orzo_soup.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Chakhchoukha', localName: 'Chakhchoukha',
    description: 'Algerian torn flatbread soaked in a spicy tomato-chickpea stew — a dish from the Aurès mountains.',
    countryId: c.DZ.id, countryName: c.DZ.name, region: 'Aurès / Eastern Algeria',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 40, cookTime: 45, servings: 6,
    estimatedCost: '400–800 DZD',
    ingredients: ['Rouina flatbread (shredded)', 'Lamb or chicken', 'Chickpeas', 'Turnips, onions', 'Tomato paste', 'Harissa', 'Ras el hanout', 'Oil', 'Salt'],
    instructions: ['Make thin flatbread (rouina), bake and tear to pieces.', 'Cook meat with onion, tomato paste, harissa, and spices.', 'Add chickpeas and turnips. Simmer.', 'Steam torn bread over the stew to soften.', 'Layer bread on plate, ladle stew over top.'],
    tags: ['chakhchoukha', 'aures', 'flatbread', 'algeria'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Algerian_Chakhchoukha.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Makroud (Semolina Date Cookies)', localName: 'Makroud',
    description: 'Algerian diamond-shaped semolina pastries stuffed with date paste and dipped in honey — festive sweetness.',
    countryId: c.DZ.id, countryName: c.DZ.name, region: 'Nationwide',
    categories: ['desserts', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 20, servings: 12,
    estimatedCost: '200–400 DZD',
    ingredients: ['3 cups semolina', 'Butter', 'Orange blossom water', 'Date paste', 'Honey', 'Oil for frying'],
    instructions: ['Mix semolina with melted butter and orange blossom water.', 'Knead to a smooth dough.', 'Roll into logs. Make a groove, fill with date paste. Close.', 'Cut into diamond shapes.', 'Deep fry until golden.', 'Dip in warm honey. Let cool.'],
    tags: ['makroud', 'dates', 'semolina', 'dessert', 'algeria'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Karantika_Algerian.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  LIBYA 🇱🇾
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Bazin', localName: 'Bazin',
    description: 'Libya\'s national dish — a dome of hardened barley or wheat dough served with a tomato-lamb-egg stew.',
    countryId: c.LY.id, countryName: c.LY.name, region: 'Tripoli / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 20, cookTime: 60, servings: 6,
    estimatedCost: '20–40 LYD',
    ingredients: ['Barley flour', 'Water', 'Lamb', 'Tomato paste', 'Potatoes', 'Hard-boiled eggs', 'Turmeric', 'Fenugreek', 'Chilli', 'Salt'],
    instructions: ['Cook lamb stew with tomato, potato, turmeric, fenugreek.', 'Boil water, gradually add barley flour.', 'Stir with a thick stick until very firm.', 'Shape into a smooth dome with wet hands.', 'Place bazin dome in centre of stew bowl.', 'Place eggs around it.', 'Eat by pinching bazin and dipping into stew.'],
    tags: ['bazin', 'barley', 'libya'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Bazin.jpg/960px-Bazin.jpg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Sharba Libiya (Libyan Soup)', localName: 'Sharba',
    description: 'Libyan lamb and tomato soup with orzo pasta — flavoured with cinnamon, turmeric, and mint. An iftar staple.',
    countryId: c.LY.id, countryName: c.LY.name, region: 'Nationwide',
    categories: ['dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 45, servings: 6,
    estimatedCost: '15–30 LYD',
    ingredients: ['300 g lamb', 'Tomato paste', 'Orzo pasta', 'Onion', 'Chickpeas', 'Cinnamon', 'Turmeric', 'Dried mint', 'Olive oil', 'Salt', 'Lemon'],
    instructions: ['Brown lamb with onion.', 'Add tomato paste, spices, and water.', 'Simmer 30 min.', 'Add chickpeas and orzo.', 'Cook until pasta is done.', 'Finish with mint and lemon. Serve hot.'],
    tags: ['sharba', 'soup', 'libya'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Lemon_chicken_orzo_soup.jpg/960px-Lemon_chicken_orzo_soup.jpg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Asida (Libyan)', localName: 'Asida',
    description: 'Libyan wheat porridge shaped into a dome, drizzled with date syrup (rub) and melted butter — sweet comfort.',
    countryId: c.LY.id, countryName: c.LY.name, region: 'Nationwide',
    categories: ['breakfast', 'desserts', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 4,
    estimatedCost: '5–10 LYD',
    ingredients: ['2 cups wheat flour', 'Water', 'Date syrup (rub)', 'Butter or ghee', 'Honey (optional)'],
    instructions: ['Boil water. Add flour gradually.', 'Stir vigorously until thick and smooth.', 'Shape into a dome on a plate.', 'Make a well in the centre.', 'Fill with date syrup and melted butter.', 'Eat by pinching dough and dipping.'],
    tags: ['asida', 'porridge', 'date-syrup', 'libya'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/%D8%B9%D8%B5%D9%8A%D8%AF%D8%A9-%D9%82%D8%B7%D9%8A%D9%81%D9%8A%D8%A9.jpg/960px-%D8%B9%D8%B5%D9%8A%D8%AF%D8%A9-%D9%82%D8%B7%D9%8A%D9%81%D9%8A%D8%A9.jpg',
    isFeatured: false, rating: 4.4,
  },
];

// ─── Seeder ────────────────────────────────────────────────────
export const seedNorthAfricanFoods = async () => {
  const CODES = ['EG', 'MA', 'TN', 'DZ', 'LY'];
  const countryMap = await getCountryMap(CODES);
  console.log(`  📍 Found ${Object.keys(countryMap).length} North African countries`);

  const collectionRef = db.collection(COLLECTIONS.FOODS);
  const foodsData = makeFoods(countryMap);

  for (const code of CODES) {
    if (!countryMap[code]) continue;
    const existing = await collectionRef.where('countryId', '==', countryMap[code].id).get();
    if (!existing.empty) {
      for (let i = 0; i < existing.docs.length; i += 500) {
        const batch = db.batch();
        existing.docs.slice(i, i + 500).forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
      console.log(`  🗑️  Cleared ${existing.size} existing foods for ${countryMap[code].name}`);
    }
  }

  const results = [];
  for (let i = 0; i < foodsData.length; i += 500) {
    const batch = db.batch();
    const chunk = foodsData.slice(i, i + 500);
    for (const data of chunk) {
      const formatted = formatFood(data);
      const docRef = collectionRef.doc();
      batch.set(docRef, formatted);
      results.push({ id: docRef.id, ...formatted });
    }
    await batch.commit();
  }

  const counts = {};
  results.forEach(f => { counts[f.countryId] = (counts[f.countryId] || 0) + 1; });
  for (const [countryId, count] of Object.entries(counts)) {
    await db.collection(COLLECTIONS.COUNTRIES).doc(countryId).update({ foodCount: count });
  }

  return results;
};

const isMain = process.argv[1]?.replace(/\\/g, '/').endsWith('seedNorthAfricanFoods.js');
if (isMain) {
  console.log('🌍 Seeding North African foods…\n');
  seedNorthAfricanFoods()
    .then(foods => {
      console.log(`\n✅ Seeded ${foods.length} North African foods!`);
      foods.forEach((f, i) => console.log(`  ${i + 1}. ${f.name} — ${f.countryName}`));
      process.exit(0);
    })
    .catch(err => { console.error('❌', err.message); process.exit(1); });
}
