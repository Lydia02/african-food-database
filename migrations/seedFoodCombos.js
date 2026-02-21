/**
 * Seed African Food Combos / Combinations.
 * Popular food pairings across all African regions —
 * rice & beans, bread & egg, ekuru, cereal combos, etc.
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

const makeCombos = (c) => [

  // ═══════════════════════════════════════════════════════════════
  //  NIGERIA 🇳🇬 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Rice and Beans (Nigerian)', localName: 'Iresí àti Ewa',
    description: 'Nigeria\'s classic combo — jollof-style rice cooked together with honey beans. Budget-friendly, filling, and protein-rich.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly', 'traditional'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 45, servings: 6,
    estimatedCost: '₦500–1,200',
    ingredients: ['3 cups rice', '2 cups honey beans (ewa oloyin)', '1/4 cup palm oil', '2 onions', '3 tomatoes', '2 red bell peppers', '2 scotch bonnet peppers', 'Crayfish', 'Seasoning cubes', 'Salt'],
    instructions: ['Parboil beans for 15 min. Drain.', 'Blend tomatoes, peppers, onion.', 'Fry blended pepper in palm oil 10 min.', 'Add beans and water. Cook 20 min until half done.', 'Add washed rice. Water should be level with rice.', 'Season. Cover tightly and cook until done.', 'Serve with fried plantain (dodo) and stew.'],
    tags: ['rice-and-beans', 'combo', 'budget', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Rice_and_beans%2C_Hotel_in_Itatiaia.jpeg/960px-Rice_and_beans%2C_Hotel_in_Itatiaia.jpeg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Bread and Egg (Nigerian)', localName: 'Bread and Egg',
    description: 'Nigeria\'s universal breakfast — sliced bread with scrambled or fried egg, tomatoes, and pepper. Every Nigerian knows this.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['breakfast', 'quick-meals', 'budget-friendly'], targetAudience: ['university-students', 'young-professionals', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 10, servings: 2,
    estimatedCost: '₦300–600',
    ingredients: ['4 slices bread (Agege bread preferred)', '3 eggs', '1 tomato (diced)', '1 onion (diced)', '1 scotch bonnet pepper', '2 tbsp oil', 'Salt', 'Seasoning'],
    instructions: ['Heat oil in pan. Fry onion and tomato.', 'Add diced pepper. Cook 2 min.', 'Crack eggs into pan. Scramble with veggies.', 'Season with salt and seasoning cube.', 'Toast or fry bread slices.', 'Serve egg on bread or as sandwich. Add tea.'],
    tags: ['bread-and-egg', 'breakfast', 'combo', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Ekuru with Stew', localName: 'Ekuru',
    description: 'Peeled beans steamed into a smooth pudding, served with pepper stew and fried pepper sauce. Yoruba classic combo.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Southwest (Yoruba)',
    categories: ['breakfast', 'lunch', 'traditional', 'vegetarian'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 60, servings: 6,
    estimatedCost: '₦400–800',
    ingredients: ['3 cups peeled black-eyed peas', 'Water', 'Salt', 'Banana leaves or foil', 'Stew: 6 red bell peppers, 4 scotch bonnet, onions, palm oil, crayfish, locust beans (iru)'],
    instructions: ['Soak and peel beans. Blend smooth with very little water.', 'Season with salt. Beat until light and airy.', 'Wrap portions in banana leaves or foil.', 'Steam in pot for 45–60 min until firm.', 'Make stew: blend peppers, fry in palm oil with iru and crayfish.', 'Unwrap ekuru. Serve with pepper stew drizzled on top.'],
    tags: ['ekuru', 'beans', 'steamed', 'yoruba', 'combo', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Ekuru_and_ata_din_din.jpg/960px-Ekuru_and_ata_din_din.jpg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Ogi (Pap) and Akara', localName: 'Ogi àti Àkàrà',
    description: 'The quintessential Yoruba breakfast combo — thin fermented corn porridge (pap) with deep-fried bean cakes (akara).',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Southwest / Nationwide',
    categories: ['breakfast', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 20, servings: 4,
    estimatedCost: '₦300–600',
    ingredients: ['Ogi: 1 cup fermented corn paste, 2 cups water, sugar/honey, milk (optional)', 'Akara: 2 cups peeled beans, 1 onion, 1 scotch bonnet, salt, oil for frying'],
    instructions: ['Ogi: Dissolve paste in cold water. Pour into boiling water stirring.', 'Stir until thickened (2 min). Add sugar and milk.', 'Akara: Blend peeled beans with onion, pepper. Don\'t add water.', 'Season with salt. Beat well.', 'Deep fry spoonfuls in hot oil until golden.', 'Serve hot akara alongside warm ogi.'],
    tags: ['ogi', 'pap', 'akara', 'breakfast', 'combo', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Beans_Ball-Akara.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Yam and Egg Sauce', localName: 'Dundun àti Egg Sauce',
    description: 'Fried yam (dundun) or boiled yam served with peppered egg sauce — a beloved Nigerian breakfast/brunch combo.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['breakfast', 'lunch', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '₦500–1,000',
    ingredients: ['1 medium yam (sliced)', 'Oil for frying', '4 eggs', '3 tomatoes', '1 onion', '2 scotch bonnet peppers', '1 red bell pepper', '2 tbsp oil', 'Salt', 'Seasoning'],
    instructions: ['Peel yam, slice into rounds. Soak in salted water.', 'Deep fry yam until golden, or boil until tender.', 'For sauce: chop tomatoes, onion, peppers.', 'Fry onion in oil. Add tomatoes and peppers. Cook 5 min.', 'Crack eggs into sauce. Stir gently to create chunks.', 'Season. Serve sauce over yam.'],
    tags: ['yam', 'egg-sauce', 'dundun', 'combo', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Yams_species_called_Parkistan._The_size_is_for_eating_but_smaller_sizes_can_be_cultivated.jpg/960px-Yams_species_called_Parkistan._The_size_is_for_eating_but_smaller_sizes_can_be_cultivated.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Beans and Plantain', localName: 'Ewa àti Dodo',
    description: 'Boiled or porridge beans with fried ripe plantain — the ultimate Nigerian comfort combo. Budget king.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly', 'traditional'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 40, servings: 4,
    estimatedCost: '₦400–800',
    ingredients: ['2 cups honey beans', '4 ripe plantains', '1/4 cup palm oil', '1 onion', '2 scotch bonnet peppers', 'Crayfish', 'Salt', 'Oil for frying'],
    instructions: ['Cook beans until tender (parboil first if needed).', 'Add palm oil, diced onion, pepper, crayfish, salt.', 'Cook until porridge-like or leave whole beans.', 'Slice ripe plantain diagonally. Fry until golden.', 'Serve beans with fried plantain on the side.'],
    tags: ['beans', 'plantain', 'dodo', 'combo', 'budget', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Mega_racimos_de_guineos.jpg/960px-Mega_racimos_de_guineos.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Indomie and Egg', localName: 'Indomie and Egg',
    description: 'Nigeria\'s beloved instant noodle combo — Indomie jazzed up with egg, vegetables, and suya spice. Student fuel.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['quick-meals', 'dinner', 'budget-friendly'], targetAudience: ['university-students', 'young-professionals'],
    difficulty: 'easy', prepTime: 5, cookTime: 10, servings: 1,
    estimatedCost: '₦300–500',
    ingredients: ['2 packs Indomie noodles', '2 eggs', '1 carrot (diced)', '1 green pepper', '1 onion', '1 tbsp oil', 'Seasoning from packs', 'Suya spice (optional)'],
    instructions: ['Boil noodles 2 min. Drain.', 'Heat oil, fry onion and vegetables 2 min.', 'Add noodles and seasoning. Stir-fry 2 min.', 'Push to one side, fry or scramble eggs in same pan.', 'Mix together. Add suya spice if desired.', 'Serve hot.'],
    tags: ['indomie', 'egg', 'noodles', 'combo', 'student', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Indomie_Logo.png',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Garri and Groundnut', localName: 'Garri àti Epa',
    description: 'Soaked garri (cassava flakes) with groundnuts, sugar, and cold water — Nigeria\'s ultimate broke-day snack combo.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['snacks', 'budget-friendly', 'quick-meals'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 0, servings: 1,
    estimatedCost: '₦100–300',
    ingredients: ['1 cup garri (white or yellow)', 'Cold water', '2 tbsp sugar or honey', '1/4 cup roasted groundnuts', 'Milk (optional)', 'Coconut flakes (optional)'],
    instructions: ['Put garri in a bowl.', 'Add cold water, let it soak and swell (2 min).', 'Add sugar and milk. Stir.', 'Top with roasted groundnuts and coconut.', 'Eat immediately as a refreshing snack.'],
    tags: ['garri', 'groundnut', 'snack', 'combo', 'budget', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Garri_flour.jpg',
    isFeatured: false, rating: 4.4,
  },
  {
    name: 'Agege Bread and Ewa Agoyin', localName: 'Bread and Ewa Agoyin',
    description: 'Soft Agege bread torn and dipped in mashed beans with fiery palm oil pepper sauce — Lagos street food combo.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Lagos / Southwest',
    categories: ['breakfast', 'street-food', 'budget-friendly'], targetAudience: ['university-students', 'young-professionals', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 0, servings: 2,
    estimatedCost: '₦200–500',
    ingredients: ['1 loaf Agege bread', '2 cups ewa agoyin (pre-made mashed beans)', 'Ata dindin (fried pepper sauce) with palm oil, dried pepper, onion, crayfish, locust beans'],
    instructions: ['Buy or prepare ewa agoyin (beans mashed smooth).', 'Make ata dindin: bleach palm oil, fry dried pepper, onion, crayfish, iru.', 'Tear chunks of soft Agege bread.', 'Scoop beans onto bread, top with ata dindin.', 'Eat straight away — this is a Lagos rite of passage.'],
    tags: ['agege-bread', 'ewa-agoyin', 'combo', 'lagos', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Agege_Bread.jpg/960px-Agege_Bread.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Cereal and Milk (Nigerian Style)', localName: 'Cornflakes and Milk',
    description: 'Golden Morn, cornflakes, or custard with evaporated milk — Nigeria\'s go-to quick breakfast cereal combo.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['breakfast', 'quick-meals'], targetAudience: ['university-students', 'families', 'everyone'],
    difficulty: 'easy', prepTime: 3, cookTime: 0, servings: 1,
    estimatedCost: '₦200–500',
    ingredients: ['1 cup Golden Morn or cornflakes', 'Evaporated milk (Peak or Three Crowns)', 'Sugar', 'Hot or warm water (for Golden Morn)'],
    instructions: ['Pour cereal into a bowl.', 'Add warm water (Golden Morn) or use dry (cornflakes).', 'Pour evaporated milk over cereal generously.', 'Add sugar to taste.', 'Mix and eat immediately.'],
    tags: ['cereal', 'golden-morn', 'cornflakes', 'breakfast', 'combo', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Ogi%3BPap.jpg/960px-Ogi%3BPap.jpg',
    isFeatured: false, rating: 4.2,
  },
  {
    name: 'Moi Moi and Custard/Pap', localName: 'Moi Moi àti Ogi',
    description: 'Steamed bean pudding paired with smooth pap/custard — a popular Nigerian breakfast or light dinner combo.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['breakfast', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 45, servings: 6,
    estimatedCost: '₦500–1,000',
    ingredients: ['Moi Moi: 3 cups peeled beans, peppers, onion, palm oil, eggs, fish, crayfish, seasoning', 'Pap: fermented corn paste, water, sugar, milk'],
    instructions: ['Blend beans with peppers, onion. Season.', 'Add palm oil, crayfish, eggs, fish.', 'Wrap in leaves or foil. Steam 45 min.', 'Make pap: dissolve paste in cold water, pour into boiling water.', 'Stir until set. Add sugar and milk.', 'Serve moi moi with a bowl of warm pap.'],
    tags: ['moi-moi', 'pap', 'custard', 'combo', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Moin_Moin.jpg/960px-Moin_Moin.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  GHANA 🇬🇭 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Waakye (Rice and Beans)', localName: 'Waakye',
    description: 'Ghana\'s beloved rice & beans combo — cooked with millet stalks for a signature red colour. Served with shito, spaghetti, and protein.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['breakfast', 'lunch', 'traditional', 'street-food'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 45, servings: 6,
    estimatedCost: 'GH₵5–15',
    ingredients: ['3 cups rice', '1.5 cups black-eyed beans', 'Dried millet leaf stalks (waakye leaves)', 'Water', 'Salt', 'Accompaniments: gari, shito, boiled egg, spaghetti, fried fish, fried chicken'],
    instructions: ['Parboil beans 20 min. Add waakye leaves (wrapped in cloth).', 'Add rice and salt. Top up water.', 'Cook until rice and beans are tender and reddish.', 'Serve on banana leaf with shito, gari, spaghetti, wele, egg, and protein.'],
    tags: ['waakye', 'rice-and-beans', 'combo', 'ghanaian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Waakye_with_vegetables%2C_fish_and_egg_with_ripe_plantains.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Kenkey and Fried Fish', localName: 'Kenkey ne Shito',
    description: 'Fermented corn dough with grilled tilapia and hot pepper sauce (shito) — Ghana\'s iconic combo.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Greater Accra / Coastal',
    categories: ['lunch', 'dinner', 'traditional', 'street-food'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 15, servings: 2,
    estimatedCost: 'GH₵8–15',
    ingredients: ['2 balls kenkey (Ga or Fanti)', '2 whole fried tilapia', 'Shito (black pepper sauce)', 'Fresh pepper', 'Onion rings', 'Tomatoes'],
    instructions: ['Buy or prepare kenkey.', 'Fry or grill whole tilapia until crispy.', 'Slice onions, tomatoes, fresh pepper on a plate.', 'Serve kenkey with fish, shito, and fresh accompaniments.'],
    tags: ['kenkey', 'fried-fish', 'shito', 'combo', 'ghanaian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Kenkey_and_ground_pepper_with_sardine.jpg/960px-Kenkey_and_ground_pepper_with_sardine.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Banku and Tilapia', localName: 'Banku ne Akple',
    description: 'Fermented corn-cassava dough ball with grilled tilapia and fresh pepper sauce — Ga-Ewe classic combo.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Greater Accra / Volta',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 30, servings: 4,
    estimatedCost: 'GH₵10–20',
    ingredients: ['2 cups fermented corn dough', '1 cup cassava dough', 'Water', 'Salt', '4 whole tilapia', 'Pepper sauce (kpakpo shito)', 'Onion', 'Tomato'],
    instructions: ['Mix corn dough and cassava dough with water.', 'Cook on medium heat stirring continuously until smooth and ball forms.', 'Grill tilapia after seasoning.', 'Make pepper sauce: blend fresh peppers, onion, tomato.', 'Serve banku ball with tilapia and pepper sauce.'],
    tags: ['banku', 'tilapia', 'grilled-fish', 'combo', 'ghanaian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Grilled_tilapia_with_banku.jpg/960px-Grilled_tilapia_with_banku.jpg',
    isFeatured: false, rating: 4.7,
  },
  {
    name: 'Koose (Bean Cake) and Koko', localName: 'Koose ne Hausa Koko',
    description: 'Ghana\'s breakfast combo — spiced bean fritters (koose) with spiced millet porridge (Hausa koko).',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Northern / Nationwide',
    categories: ['breakfast', 'street-food', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 15, servings: 4,
    estimatedCost: 'GH₵3–7',
    ingredients: ['Koose: 2 cups peeled beans, onion, pepper, ginger, salt', 'Koko: 1 cup millet flour, ginger, cloves, pepper, sugar, water'],
    instructions: ['Blend beans with onion, pepper, ginger. Beat until fluffy.', 'Fry spoonfuls in oil until golden brown.', 'Make koko: dissolve millet flour in cold water.', 'Pour into boiling water. Stir. Add spices.', 'Sweeten with sugar.', 'Serve hot koose with warm koko.'],
    tags: ['koose', 'koko', 'bean-cake', 'porridge', 'combo', 'ghanaian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Beans_Ball-Akara.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  EAST AFRICA — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Ugali and Sukuma Wiki', localName: 'Ugali na Sukuma',
    description: 'Kenya/Tanzania\'s daily combo — stiff maize porridge with sautéed collard greens and onions. Affordable and filling.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: 'KSh 100–200',
    ingredients: ['2 cups maize flour (unga)', 'Water', '1 large bunch sukuma wiki (collard greens)', '2 tomatoes', '1 onion', '2 tbsp oil', 'Salt'],
    instructions: ['Boil water. Add maize flour gradually, stirring.', 'Cook 10 min until stiff and pulls from sides.', 'Fry onion in oil. Add tomatoes.', 'Add shredded sukuma wiki. Cook 5 min.', 'Season with salt.', 'Serve ugali with sukuma wiki and optionally nyama choma.'],
    tags: ['ugali', 'sukuma-wiki', 'combo', 'kenyan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Ugali_%26_Sukuma_Wiki.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Chapati and Beans', localName: 'Chapati na Maharagwe',
    description: 'East Africa\'s beloved carb + protein combo — soft layered chapati with spiced red kidney beans.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 30, servings: 4,
    estimatedCost: 'KSh 150–300',
    ingredients: ['Chapati: 3 cups flour, 1 tbsp oil, warm water, salt', 'Beans: 2 cups kidney beans, 2 tomatoes, 1 onion, curry powder, coconut milk (optional), salt'],
    instructions: ['Make dough: mix flour, oil, salt, water. Knead. Rest 30 min.', 'Roll thin, oil, fold, re-roll. Cook on griddle with oil.', 'Beans: cook pre-soaked beans until tender.', 'Fry onion, add tomatoes, curry powder.', 'Add beans and coconut milk. Simmer 15 min.', 'Serve chapati with beans stew.'],
    tags: ['chapati', 'beans', 'combo', 'kenyan', 'east-african'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/2_Chapati_warm_and_ready_to_be_eaten.jpg/960px-2_Chapati_warm_and_ready_to_be_eaten.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Injera and Firfir', localName: 'Injera be Firfir',
    description: 'Ethiopian breakfast combo — torn pieces of injera sautéed in spiced butter (kibbeh) with berbere and onions.',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Nationwide',
    categories: ['breakfast', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 15, servings: 2,
    estimatedCost: '50–100 ETB',
    ingredients: ['4 pieces leftover injera (torn)', '3 tbsp kibbeh (spiced butter)', '1 onion (diced)', '2 tbsp berbere spice', 'Tomatoes (optional)', 'Salt'],
    instructions: ['Melt kibbeh in pan. Fry onion until soft.', 'Add berbere. Cook 2 min.', 'Add torn injera pieces. Toss to coat.', 'Stir-fry 5 min until injera absorbs butter.', 'Serve hot as breakfast.'],
    tags: ['injera', 'firfir', 'berbere', 'combo', 'ethiopian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Taita_fit-fit.jpg/960px-Taita_fit-fit.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Rolex (Chapati Egg Roll)', localName: 'Rolex',
    description: 'Uganda\'s famous street food combo — a chapati rolled around a fried egg omelette with vegetables. A Rolled Egg = Rolex.',
    countryId: c.UG.id, countryName: c.UG.name, region: 'Nationwide',
    categories: ['breakfast', 'street-food', 'quick-meals', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 10, servings: 1,
    estimatedCost: 'UGX 1,500–3,000',
    ingredients: ['1 chapati (freshly made)', '2 eggs', '1 tomato (sliced)', '1/2 onion (sliced)', 'Cabbage (shredded)', 'Green pepper', 'Oil', 'Salt'],
    instructions: ['Make or buy a fresh warm chapati.', 'Beat eggs with salt.', 'Fry omelette in oil with onion, tomato, cabbage, pepper.', 'Place omelette on chapati.', 'Roll tightly. Wrap in paper.', 'Eat on the go.'],
    tags: ['rolex', 'chapati', 'egg', 'combo', 'ugandan', 'street-food'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Well_prepared_rolex_red_to_eat.jpg/960px-Well_prepared_rolex_red_to_eat.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Matoke and Groundnut Sauce', localName: 'Matoke ne Binyebwa',
    description: 'Uganda\'s iconic combo — steamed mashed green bananas topped with thick groundnut (peanut) sauce.',
    countryId: c.UG.id, countryName: c.UG.name, region: 'Central / Western Uganda',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 4,
    estimatedCost: 'UGX 5,000–10,000',
    ingredients: ['6 green bananas (matoke)', '2 cups ground peanut paste', '2 tomatoes', '1 onion', '2 tbsp oil', 'Water', 'Salt'],
    instructions: ['Peel matoke (in water to avoid stains).', 'Wrap in banana leaves. Steam 30 min until soft. Mash.', 'Fry onion in oil. Add tomatoes.', 'Dissolve peanut paste in water. Add to pot.', 'Simmer 15 min until thick and creamy.', 'Serve mashed matoke with groundnut sauce.'],
    tags: ['matoke', 'groundnut', 'combo', 'ugandan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Matooke_to_the_market.jpg/960px-Matooke_to_the_market.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  NORTH AFRICA — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Ful Medames and Bread', localName: 'Ful Medames',
    description: 'Egypt\'s national breakfast — slow-cooked fava beans mashed with olive oil, lemon, cumin, served with pita bread and boiled egg.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['breakfast', 'traditional', 'budget-friendly', 'vegetarian'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 15, servings: 4,
    estimatedCost: '15–30 EGP',
    ingredients: ['2 cans fava beans (or 2 cups cooked)', 'Olive oil', 'Lemon juice', '1 tsp cumin', 'Garlic (minced)', 'Tomato (diced)', 'Parsley', 'Tahini (optional)', 'Pita bread', 'Boiled eggs'],
    instructions: ['Warm fava beans in pot with some liquid.', 'Mash partially. Season with cumin, garlic, lemon, olive oil.', 'Serve in bowls drizzled with more olive oil.', 'Top with diced tomato, parsley, and tahini.', 'Serve with warm pita bread and halved boiled eggs.'],
    tags: ['ful-medames', 'fava-beans', 'bread', 'combo', 'egyptian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Ful_medames_%28arabic_meal%29.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Couscous and Lamb Tagine', localName: 'Couscous bil Lahm',
    description: 'Morocco\'s Friday classic — fluffy steamed couscous with slow-cooked lamb and seven vegetable tagine.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 90, servings: 8,
    estimatedCost: '50–100 MAD',
    ingredients: ['3 cups couscous', '500 g lamb shoulder (cubed)', '2 onions', '2 carrots', '2 zucchini', '1 turnip', '1 can chickpeas', 'Pumpkin', 'Cabbage', 'Tomato paste', 'Ras el hanout', 'Saffron', 'Olive oil', 'Salt'],
    instructions: ['Brown lamb with onion in olive oil.', 'Add spices, tomato paste, water. Simmer 45 min.', 'Add carrots, turnip, pumpkin. Cook 20 min.', 'Add zucchini, chickpeas, cabbage. Cook 15 min more.', 'Steam couscous: moisten, steam, fluff (3 times).', 'Mound couscous. Top with meat and vegetables. Ladle broth.'],
    tags: ['couscous', 'lamb', 'tagine', 'combo', 'moroccan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/960px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Msemen and Mint Tea', localName: 'Msemen wa Atay',
    description: 'Morocco\'s breakfast ritual — flaky square-shaped flatbread with sweet mint tea. Dip msemen in honey or cheese.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['breakfast', 'snacks', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 20, servings: 6,
    estimatedCost: '10–25 MAD',
    ingredients: ['Msemen: 3 cups flour, semolina, butter, oil, salt, water', 'Tea: Chinese gunpowder green tea, fresh mint, sugar, water'],
    instructions: ['Make dough with flour, semolina, salt, water. Knead well.', 'Divide into balls. Flatten thin, fold into squares.', 'Cook on griddle with butter until golden each side.', 'Tea: boil water with tea leaves. Add mint and lots of sugar.', 'Pour from height for froth.', 'Serve msemen hot with honey, butter, or Laughing Cow cheese alongside tea.'],
    tags: ['msemen', 'mint-tea', 'combo', 'moroccan', 'breakfast'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/960px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg',
    isFeatured: false, rating: 4.7,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SOUTH AFRICA 🇿🇦 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Pap, Wors, and Chakalaka', localName: 'Pap, Wors en Chakalaka',
    description: 'South Africa\'s braai trinity combo — maize porridge, grilled boerewors sausage, and spicy veg relish.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 30, servings: 4,
    estimatedCost: 'R50–100',
    ingredients: ['Pap: 2 cups maize meal, water, salt', 'Boerewors: 1 kg coil', 'Chakalaka: baked beans, carrots, peppers, onion, chilli, curry powder'],
    instructions: ['Make pap: boil water, add maize meal, stir 20 min.', 'Braai boerewors over coals 15 min, turning once.', 'Make chakalaka: fry veg, add curry powder, beans. Simmer 10 min.', 'Plate pap, coil of wors on top, chakalaka on side.'],
    tags: ['pap', 'wors', 'chakalaka', 'braai', 'combo', 'south-african'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Boerewors_raw.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Vetkoek and Mince', localName: 'Vetkoek met Mince',
    description: 'Deep-fried bread dough split open and filled with curried mince — South Africa\'s ultimate combo snack.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Nationwide',
    categories: ['lunch', 'snacks', 'street-food'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 90, cookTime: 25, servings: 8,
    estimatedCost: 'R30–60',
    ingredients: ['Vetkoek: 3 cups flour, yeast, sugar, salt, warm water, oil', 'Mince: 500 g beef mince, onion, tomato, curry powder, salt'],
    instructions: ['Make vetkoek dough. Rise 1 hour. Shape balls. Deep fry.', 'Brown mince. Add onion, tomato, curry powder.', 'Simmer 15 min until thick.', 'Split vetkoek open. Spoon mince inside.', 'Serve immediately.'],
    tags: ['vetkoek', 'mince', 'combo', 'south-african'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vetkoek_with_mince-001.jpg/960px-Vetkoek_with_mince-001.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SENEGAL 🇸🇳 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Thiéboudienne (Rice and Fish)', localName: 'Thiéboudienne',
    description: 'Senegal\'s national dish combo — broken rice, stuffed fish, and vegetables simmered in tomato sauce.',
    countryId: c.SN.id, countryName: c.SN.name, region: 'Nationwide',
    categories: ['lunch', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 60, servings: 8,
    estimatedCost: '2,000–4,000 XOF',
    ingredients: ['3 cups broken rice', '1 whole fish (thiof or grouper)', 'Tomato paste', '2 onions', '2 carrots', '1 cassava', '1 cabbage quarter', '1 aubergine', 'Tamarind', 'Scotch bonnet', 'Oil', 'Salt'],
    instructions: ['Stuff fish with parsley-pepper paste. Fry until golden.', 'Make base: fry onions, add tomato paste, cook 10 min.', 'Add vegetables and fish. Cover with water. Simmer 30 min.', 'Remove fish and veg. Cook rice in the flavoured broth.', 'Mound rice. Arrange fish and vegetables on top.', 'Serve communally on a large platter.'],
    tags: ['thieboudienne', 'rice-fish', 'combo', 'senegalese'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Thieboudienne.JPG/960px-Thieboudienne.JPG',
    isFeatured: true, rating: 4.9,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CAMEROON 🇨🇲 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Ndolé and Plantain', localName: 'Ndolé avec Plantain',
    description: 'Cameroon\'s national combo — bitter leaf and peanut stew with boiled plantain and prawns.',
    countryId: c.CM.id, countryName: c.CM.name, region: 'Littoral / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 40, servings: 6,
    estimatedCost: '2,000–5,000 XAF',
    ingredients: ['1 kg bitter leaves (ndolé)', '1 cup ground peanuts', '500 g beef', '200 g prawns', '2 onions', 'Garlic', 'Crayfish', '4 ripe plantains', 'Oil', 'Salt'],
    instructions: ['Wash and boil bitter leaves (change water 3 times to reduce bitterness).', 'Brown beef. Simmer until tender.', 'Add ground peanuts dissolved in water. Stir.', 'Add bitter leaves, crayfish, garlic.', 'Add prawns last 10 min.', 'Boil plantains until tender but firm.', 'Serve ndolé with boiled plantain on the side.'],
    tags: ['ndole', 'plantain', 'combo', 'cameroonian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Ndol%C3%A8_%C3%A0_la_viande%2C_morue_et_crevettes.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Achu Soup and Fufu (Yellow Soup)', localName: 'Achu',
    description: 'Northwest Cameroon combo — pounded cocoyam (achu) with spicy yellow palm oil soup (kanwa).',
    countryId: c.CM.id, countryName: c.CM.name, region: 'Northwest Cameroon',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 60, servings: 6,
    estimatedCost: '3,000–6,000 XAF',
    ingredients: ['2 kg cocoyam (taro)', 'Yellow soup: limestone paste (kanwa), palm oil, spices, meat stock', 'Assorted meat: tripe, cow skin, beef'],
    instructions: ['Boil and pound cocoyam until smooth and stretchy.', 'Shape into balls.', 'Dissolve kanwa in warm water. Mix with red palm oil (turns yellow).', 'Add spiced meat stock. Simmer.', 'Serve achu ball in a bowl. Ladle yellow soup around it.', 'Add boiled meat pieces.'],
    tags: ['achu', 'yellow-soup', 'fufu', 'combo', 'cameroonian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taro_sauce_jaune_avec_peau_de_boeuf.jpg/960px-Taro_sauce_jaune_avec_peau_de_boeuf.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CÔTE D'IVOIRE 🇨🇮 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Attiéké and Fried Fish', localName: 'Attiéké Poisson',
    description: 'Côte d\'Ivoire\'s everyday combo — fermented cassava couscous with crispy fried fish, onions, and chilli.',
    countryId: c.CI.id, countryName: c.CI.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'street-food', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 15, servings: 2,
    estimatedCost: '1,000–2,500 XOF',
    ingredients: ['2 cups attiéké (cassava couscous)', '2 whole fish (mackerel or tilapia)', 'Oil for frying', 'Sliced onions', 'Tomatoes', 'Ground pepper', 'Maggi cube', 'Salt'],
    instructions: ['Steam attiéké if dried, or use fresh.', 'Season and fry whole fish until golden and crispy.', 'Make alloco-style onion-pepper garnish.', 'Plate attiéké mound. Fish alongside.', 'Top with onion rings, tomato slices, and pepper.'],
    tags: ['attieke', 'fried-fish', 'combo', 'ivorian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Atti%C3%A9k%C3%A9-poissons.jpg/960px-Atti%C3%A9k%C3%A9-poissons.jpg',
    isFeatured: true, rating: 4.8,
  },

  // ═══════════════════════════════════════════════════════════════
  //  TANZANIA 🇹🇿 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Wali na Maharage', localName: 'Wali na Maharage',
    description: 'Tanzania\'s rice and beans combo — coconut rice served with red beans in coconut sauce. Coastal Swahili flavours.',
    countryId: c.TZ.id, countryName: c.TZ.name, region: 'Dar es Salaam / Coastal',
    categories: ['lunch', 'dinner', 'budget-friendly', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 35, servings: 4,
    estimatedCost: 'TZS 3,000–5,000',
    ingredients: ['2 cups rice', '1 cup coconut milk', '2 cups red kidney beans (cooked)', '2 tomatoes', '1 onion', 'Garlic', '1/2 cup coconut milk (for beans)', 'Turmeric', 'Salt'],
    instructions: ['Cook rice in coconut milk with turmeric and salt.', 'Fry onion and garlic. Add tomatoes.', 'Add cooked beans and coconut milk.', 'Simmer 15 min until thick.', 'Serve coconut rice with bean stew.'],
    tags: ['wali', 'maharage', 'rice-beans', 'coconut', 'combo', 'tanzanian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/2_Chapati_warm_and_ready_to_be_eaten.jpg/960px-2_Chapati_warm_and_ready_to_be_eaten.jpg',
    isFeatured: true, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CONGO DRC 🇨🇩 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Fufu and Pondu', localName: 'Fufu na Pondu',
    description: 'DRC\'s most iconic combo — cassava fufu with slow-cooked cassava leaf stew (pondu). The daily bread of Congo.',
    countryId: c.CD.id, countryName: c.CD.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 60, servings: 6,
    estimatedCost: '5,000–10,000 CDF',
    ingredients: ['Fufu: 3 cups cassava flour, water', 'Pondu: 1 kg pounded cassava leaves, palm oil, dried fish, onion, salt'],
    instructions: ['Fufu: boil water, add cassava flour, stir vigorously 10 min.', 'Pondu: boil pounded leaves 30 min. Add palm oil, fish, onion.', 'Simmer 30 min more until dark green and thick.', 'Serve fufu ball with pondu ladled on the side.', 'Eat by tearing fufu and dipping into pondu.'],
    tags: ['fufu', 'pondu', 'cassava', 'combo', 'congolese'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wrapped_fufu.jpg',
    isFeatured: true, rating: 4.7,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ZIMBABWE 🇿🇼 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Sadza and Muriwo ne Nyama', localName: 'Sadza, Muriwo ne Nyama',
    description: 'Zimbabwe\'s complete meal combo — sadza with collard greens (muriwo) and beef stew. Three in one.',
    countryId: c.ZW.id, countryName: c.ZW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 40, servings: 4,
    estimatedCost: '$3–6 USD',
    ingredients: ['Sadza: 2 cups maize meal, water, salt', 'Muriwo: 1 bunch collard greens, tomato, onion, oil', 'Nyama: 500 g beef stew meat, tomato, onion, seasoning'],
    instructions: ['Make sadza: boil water, add maize meal stirring. Cook 20 min.', 'Cook greens with onion, tomato, salt.', 'Stew beef with onion, tomato, seasoning until tender (30 min).', 'Serve sadza mound with muriwo and nyama on the side.'],
    tags: ['sadza', 'muriwo', 'nyama', 'combo', 'zimbabwean'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Sadza_and_Sausage.jpg/960px-Sadza_and_Sausage.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ZAMBIA 🇿🇲 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Nshima, Kapenta and Chibwabwa', localName: 'Nshima, Kapenta ne Chibwabwa',
    description: 'Zambia\'s triple combo — nshima porridge with tiny dried kapenta fish and pumpkin leaf relish.',
    countryId: c.ZM.id, countryName: c.ZM.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 30, servings: 4,
    estimatedCost: '30–60 ZMW',
    ingredients: ['Nshima: 2 cups mealie meal, water', 'Kapenta: 1 cup dried kapenta, tomato, onion, oil', 'Chibwabwa: 1 bunch pumpkin leaves, peanut powder, tomato'],
    instructions: ['Make nshima: boil water, add mealie meal, cook 20 min.', 'Fry kapenta with onion and tomato.', 'Boil pumpkin leaves. Add peanut powder and tomato.', 'Serve nshima with kapenta and chibwabwa.'],
    tags: ['nshima', 'kapenta', 'chibwabwa', 'combo', 'zambian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Nshima_and_mice.JPG/960px-Nshima_and_mice.JPG',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MOZAMBIQUE 🇲🇿 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Xima and Caril de Amendoim', localName: 'Xima na Caril',
    description: 'Mozambique combo — maize porridge (xima) with peanut curry and chicken. Portuguese-African fusion.',
    countryId: c.MZ.id, countryName: c.MZ.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 35, servings: 4,
    estimatedCost: '200–500 MZN',
    ingredients: ['Xima: 2 cups maize flour, water, salt', 'Caril: 500 g chicken, 3 tbsp peanut butter, coconut milk, tomatoes, onion, garlic'],
    instructions: ['Make xima: boil water, add maize flour, stir 20 min.', 'Brown chicken. Add onion, garlic, tomatoes.', 'Dissolve peanut butter in coconut milk. Add to pot.', 'Simmer 25 min until chicken cooked and sauce thick.', 'Serve xima with peanut curry.'],
    tags: ['xima', 'caril', 'peanut', 'combo', 'mozambican'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Matapa.jpg/960px-Matapa.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MADAGASCAR 🇲🇬 — FOOD COMBOS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Vary amin\'anana (Rice and Greens)', localName: 'Vary amin\'anana',
    description: 'Madagascar\'s everyday combo — rice cooked with mixed leafy greens, garlic, and ginger. Simple and nutritious.',
    countryId: c.MG.id, countryName: c.MG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly', 'vegetarian'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 25, servings: 4,
    estimatedCost: '3,000–6,000 MGA',
    ingredients: ['2 cups rice', '2 bunches mixed greens (brèdes)', 'Garlic', 'Ginger', 'Salt', 'Oil', 'Water'],
    instructions: ['Fry garlic and ginger in oil.', 'Add chopped greens. Cook 3 min.', 'Add rice and water.', 'Cook until rice is done and absorbed the green colour.', 'Serve as a complete light meal.'],
    tags: ['vary', 'greens', 'rice', 'combo', 'malagasy'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: false, rating: 4.4,
  },
];

// ─── Seeder ────────────────────────────────────────────────────
export const seedFoodCombos = async () => {
  const codes = ['NG', 'GH', 'KE', 'ET', 'UG', 'EG', 'MA', 'ZA', 'SN', 'CM', 'CI', 'TZ', 'CD', 'ZW', 'ZM', 'MZ', 'MG'];
  const c = await getCountryMap(codes);
  console.log(`  📍 Found ${Object.keys(c).length} countries`);

  const collectionRef = db.collection(COLLECTIONS.FOODS);
  const combosData = makeCombos(c);

  const BATCH_SIZE = 500;
  const results = [];
  for (let i = 0; i < combosData.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = combosData.slice(i, i + BATCH_SIZE);
    for (const data of chunk) {
      const formatted = formatFood(data);
      const docRef = collectionRef.doc();
      batch.set(docRef, formatted);
      results.push({ id: docRef.id, ...formatted });
    }
    await batch.commit();
  }

  // Increment food counts (combos ADD to existing counts, not replace)
  const counts = {};
  results.forEach(f => { counts[f.countryId] = (counts[f.countryId] || 0) + 1; });
  for (const [countryId, count] of Object.entries(counts)) {
    const doc = await db.collection(COLLECTIONS.COUNTRIES).doc(countryId).get();
    const current = doc.data()?.foodCount || 0;
    await db.collection(COLLECTIONS.COUNTRIES).doc(countryId).update({ foodCount: current + count });
  }

  return results;
};

const isMain = process.argv[1]?.replace(/\\/g, '/').endsWith('seedFoodCombos.js');
if (isMain) {
  console.log('🍽️  Seeding African Food Combos…\n');
  seedFoodCombos()
    .then(foods => {
      console.log(`\n✅ Seeded ${foods.length} food combos!`);
      foods.forEach((f, i) => console.log(`  ${i + 1}. ${f.name} — ${f.countryName}`));
      process.exit(0);
    })
    .catch(err => { console.error('❌', err.message); process.exit(1); });
}
