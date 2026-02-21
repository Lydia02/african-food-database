/**
 * Seed West African foods (excluding Nigeria — use seedNigerianFoods.js).
 * Countries: Ghana, Senegal, Cameroon, Côte d'Ivoire, Mali, Guinea, Sierra Leone,
 *            Liberia, Burkina Faso, Niger, Togo, Benin, Gambia, Guinea-Bissau, Cabo Verde, Mauritania
 */
import dotenv from 'dotenv';
dotenv.config();

import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { formatFood } from '../models/Food.js';

// ─── Helpers ───────────────────────────────────────────────────
const getCountryMap = async (codes) => {
  const map = {};
  for (const code of codes) {
    const snap = await db.collection(COLLECTIONS.COUNTRIES).where('code', '==', code).limit(1).get();
    if (!snap.empty) map[code] = { id: snap.docs[0].id, name: snap.docs[0].data().name };
  }
  return map;
};

// ─── Food data by country ──────────────────────────────────────
const makeFoods = (c) => [

  // ═══════════════════════════════════════════════════════════════
  //  GHANA 🇬🇭
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Jollof Rice (Ghana)', localName: 'Jollof',
    description: 'Ghanaian jollof — fragrant, tomato-based, and cooked with basmati rice for a drier, more separated grain. The eternal rival of Nigerian jollof.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 45, servings: 6,
    estimatedCost: '₵30–50',
    ingredients: ['3 cups basmati rice', '6 tomatoes', '3 red bell peppers', '2 scotch bonnet peppers', '2 onions', '1/3 cup vegetable oil', '2 tbsp tomato paste', '1 tsp curry', '1 tsp dried thyme', '2 bay leaves', 'Salt', 'Seasoning cubes', 'Chicken stock'],
    instructions: ['Blend tomatoes, peppers, and 1 onion smooth.', 'Heat oil, fry sliced onion. Add tomato paste, fry 2 min.', 'Add blended mix 30 min until reduced and oil floats.', 'Add stock, spices, and washed rice.', 'Cover tightly, cook low heat 30 min. Do not stir.', 'Fluff and serve with shito, fried plantain, and chicken.'],
    tags: ['jollof', 'ghana', 'rice', 'party'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Waakye', localName: 'Waakye',
    description: 'Ghanaian rice and beans cooked with millet stalks (or sorghum leaves) giving it a distinctive reddish-brown colour.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['breakfast', 'lunch', 'traditional', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 45, servings: 6,
    estimatedCost: '₵10–20',
    ingredients: ['2 cups rice', '1 cup black-eyed peas', 'Dried millet stalks or sorghum leaves', 'Water', 'Salt'],
    instructions: ['Soak beans overnight, boil until half-cooked.', 'Add dried millet stalks wrapped in cloth for colour.', 'Add washed rice, water, and salt.', 'Cook until rice and beans are tender and reddish-brown.', 'Remove stalks. Serve with shito, spaghetti, gari, egg, and stew.'],
    tags: ['waakye', 'ghana', 'rice-and-beans', 'breakfast'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Waakye_with_vegetables%2C_fish_and_egg_with_ripe_plantains.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Banku & Tilapia', localName: 'Banku',
    description: 'Fermented corn and cassava dough served with grilled tilapia and hot pepper sauce — a Ga classic.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Greater Accra (Ga)',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 30, servings: 4,
    estimatedCost: '₵25–40',
    ingredients: ['2 cups fermented corn dough', '1 cup cassava dough', 'Water', 'Salt', '4 whole tilapia', 'Pepper sauce (kpakpo shito)'],
    instructions: ['Mix corn dough and cassava dough with water.', 'Cook on medium heat, stirring continuously with a wooden spoon.', 'Stir vigorously until smooth, thick, and pulls away from pot.', 'Mould into balls.', 'Season and grill tilapia over charcoal.', 'Serve with hot pepper sauce.'],
    tags: ['banku', 'tilapia', 'ga', 'ghana'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Grilled_tilapia_with_banku.jpg/960px-Grilled_tilapia_with_banku.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Kelewele', localName: 'Kelewele',
    description: 'Spicy fried plantain cubes seasoned with ginger, chilli, and cloves — Ghana\'s favourite street snack.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['snacks', 'street-food'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 10, servings: 4,
    estimatedCost: '₵5–10',
    ingredients: ['4 ripe plantains', '1 tbsp grated ginger', '1 tsp chilli flakes', '1/2 tsp cloves (ground)', '1/2 tsp anise', 'Salt', 'Oil for frying'],
    instructions: ['Peel and dice plantains into cubes.', 'Mix ginger, chilli, cloves, anise, and salt.', 'Toss plantain cubes in spice mix. Marinate 10 min.', 'Deep fry in hot oil until golden and crispy.', 'Drain and serve hot with roasted peanuts.'],
    tags: ['kelewele', 'plantain', 'spicy', 'street-food', 'ghana'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Ghanaian_fruit_pineapple_and_taro_leaves_%28masterclass_dish%29.jpg/960px-Ghanaian_fruit_pineapple_and_taro_leaves_%28masterclass_dish%29.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Fufu & Light Soup', localName: 'Fufu',
    description: 'Pounded cassava and plantain dough in a spicy tomato-based broth with goat meat or chicken.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Ashanti / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 4,
    estimatedCost: '₵20–35',
    ingredients: ['2 cups cassava (peeled, cubed)', '2 ripe plantains', 'Goat meat or chicken', '4 tomatoes', '2 scotch bonnet peppers', '1 onion', 'Garden eggs', 'Salt', 'Seasoning'],
    instructions: ['Boil cassava and plantain until very soft.', 'Pound together in a mortar until smooth and stretchy.', 'For soup: boil meat with onion and seasoning.', 'Add blended tomatoes and pepper. Cook 20 min.', 'Add garden eggs. Simmer until thickened.', 'Serve fufu in soup bowl.'],
    tags: ['fufu', 'light-soup', 'ashanti', 'ghana'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wrapped_fufu.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Red Red', localName: 'Red Red',
    description: 'Ghanaian black-eyed pea stew in palm oil with fried plantain — simple, hearty, and budget-friendly.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly', 'vegetarian'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 35, servings: 4,
    estimatedCost: '₵10–18',
    ingredients: ['2 cups black-eyed peas', '1/3 cup palm oil', '3 tomatoes (blended)', '1 onion', '2 scotch bonnet peppers', 'Salt', 'Ripe plantains for frying'],
    instructions: ['Boil beans until tender.', 'Heat palm oil, fry onion.', 'Add blended tomato and pepper. Cook 15 min.', 'Add cooked beans, salt, and simmer 10 min.', 'Fry sliced plantain separately.', 'Serve beans topped with fried plantain.'],
    tags: ['red-red', 'beans', 'plantain', 'ghana', 'vegetarian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/%22Red_Red%22_wrapped_in_Katemfe_leaves_%28Thaumatococcus_daniellii%29.jpg/960px-%22Red_Red%22_wrapped_in_Katemfe_leaves_%28Thaumatococcus_daniellii%29.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Kenkey & Fried Fish', localName: 'Kenkey / Dokono',
    description: 'Fermented corn dough wrapped in corn husks/banana leaves and steamed. Served with fried fish and pepper sauce.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Greater Accra / Central',
    categories: ['lunch', 'dinner', 'traditional', 'street-food'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 60, servings: 6,
    estimatedCost: '₵15–25',
    ingredients: ['4 cups fermented corn dough', 'Corn husks or banana leaves', 'Fried fish', 'Ground pepper', 'Onions', 'Tomatoes', 'Salt'],
    instructions: ['Divide corn dough: cook half in water stirring until thick (aflata).', 'Mix cooked portion with raw portion thoroughly.', 'Wrap portions in corn husks/banana leaves.', 'Steam for 1 hour until firm.', 'Serve with fried fish and pepper-onion-tomato sauce.'],
    tags: ['kenkey', 'fermented-corn', 'ga', 'ghana'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Kenkey_and_ground_pepper_with_sardine.jpg/960px-Kenkey_and_ground_pepper_with_sardine.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Shito (Hot Pepper Sauce)', localName: 'Shito',
    description: 'Ghana\'s signature black pepper sauce — chillies, dried fish, and prawns fried in oil. Goes on EVERYTHING.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['snacks', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 10,
    estimatedCost: '₵15–25',
    ingredients: ['20 dried chillies', '1 cup dried shrimp/prawns', '1/2 cup dried fish', '1 cup vegetable oil', '3 onions', '3 tomatoes', '2 tbsp tomato paste', 'Ginger', 'Garlic', 'Salt'],
    instructions: ['Blend chillies, dried shrimp, and dried fish.', 'Blend tomatoes, onion, ginger, and garlic separately.', 'Heat oil, fry onion paste until golden.', 'Add tomato paste, fry 5 min.', 'Add blended tomato mix, cook until oil separates.', 'Add chilli-shrimp blend. Fry on low for 20 min until dark and fragrant.', 'Cool and store in jars. Lasts for months.'],
    tags: ['shito', 'pepper-sauce', 'condiment', 'ghana'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: false, rating: 4.7,
  },
  {
    name: 'Groundnut Soup', localName: 'Nkatenkwan',
    description: 'Thick, creamy peanut soup with chicken — an Ashanti favourite served with fufu or rice balls.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Ashanti / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: '₵25–40',
    ingredients: ['1 cup groundnut paste (smooth peanut butter)', '1 whole chicken (pieces)', '4 tomatoes', '2 onions', '2 scotch bonnet peppers', 'Garden eggs', '2 tbsp tomato paste', 'Salt', 'Seasoning'],
    instructions: ['Boil chicken with onion and seasoning until tender.', 'Blend tomatoes, pepper, and onion.', 'Add blended mix to stock. Cook 15 min.', 'Dissolve groundnut paste in warm water. Add to soup.', 'Stir constantly to prevent lumps. Simmer 20 min.', 'Add garden eggs. Cook until soup is thick and oily on top.', 'Serve with fufu or rice balls.'],
    tags: ['groundnut', 'peanut', 'soup', 'ashanti', 'ghana'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Fufu.jpg/960px-Fufu.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Ghanaian Fried Rice', localName: 'Fried Rice',
    description: 'Colourful stir-fried rice with mixed vegetables, soy sauce, and shrimp — Ghanaian party essential.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 25, servings: 6,
    estimatedCost: '₵25–40',
    ingredients: ['3 cups rice', 'Mixed vegetables (carrots, beans, peas, corn)', '200 g shrimp', '3 eggs', '2 tbsp soy sauce', 'Vegetable oil', '1 onion', 'Salt', 'Seasoning'],
    instructions: ['Cook rice and spread to cool.', 'Scramble eggs, cut into strips.', 'Stir fry shrimp, set aside.', 'Heat oil, fry onion and vegetables.', 'Add cold rice, toss with soy sauce.', 'Add shrimp and egg strips.', 'Serve alongside jollof at parties.'],
    tags: ['fried-rice', 'party', 'ghana'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Koh_Mak%2C_Thailand%2C_Fried_rice_with_seafood%2C_Thai_fried_rice.jpg/960px-Koh_Mak%2C_Thailand%2C_Fried_rice_with_seafood%2C_Thai_fried_rice.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SENEGAL 🇸🇳
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Thiéboudienne', localName: 'Ceebu Jën',
    description: 'Senegal\'s national dish — rice cooked in a rich tomato-fish sauce with vegetables. Considered the original jollof.',
    countryId: c.SN.id, countryName: c.SN.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 60, servings: 8,
    estimatedCost: '2,000–4,000 CFA',
    ingredients: ['4 cups broken rice', '1 large fish (thiof/grouper)', '3 tbsp tomato paste', '1 cup vegetable oil', 'Carrots, cabbage, cassava, eggplant, okra', '1 scotch bonnet pepper', 'Dried fish (guedj)', 'Parsley, garlic, onion (rof)', 'Tamarind', 'Salt'],
    instructions: ['Stuff fish with herb paste (rof: parsley, garlic, pepper).', 'Fry fish in oil until browned. Remove.', 'In same oil, fry onion and tomato paste.', 'Add water, vegetables, and dried fish. Simmer 30 min.', 'Remove vegetables and fish. Add rice to the broth.', 'Cook rice covered on low heat until tender.', 'Arrange rice on platter, top with fish and vegetables.', 'Serve with lemon and hot sauce.'],
    tags: ['thieboudienne', 'ceebu-jen', 'fish-rice', 'senegal'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Thieboudienne.JPG/960px-Thieboudienne.JPG',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Yassa Chicken', localName: 'Yassa Poulet',
    description: 'Marinated grilled chicken smothered in caramelised onion and lemon sauce — tangy, saucy perfection from the Casamance.',
    countryId: c.SN.id, countryName: c.SN.name, region: 'Casamance / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 60, cookTime: 40, servings: 4,
    estimatedCost: '2,500–4,000 CFA',
    ingredients: ['1 whole chicken (cut up)', '6 large onions (sliced)', '4 lemons (juiced)', '1/3 cup vegetable oil', '2 tbsp mustard', '3 scotch bonnet peppers', 'Garlic', 'Olives (optional)', '2 bay leaves', 'Salt'],
    instructions: ['Marinate chicken in lemon juice, onions, mustard, garlic, and salt for at least 1 hour.', 'Remove chicken, grill or fry until golden.', 'Fry the marinated onions in oil until caramelised (30 min).', 'Add peppers, olives, and bay leaves.', 'Add chicken and remaining marinade. Simmer 15 min.', 'Serve over white rice.'],
    tags: ['yassa', 'chicken', 'lemon', 'onion', 'senegal'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Poulet_Yassa_Chicken_rice_with_onion_sauce.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Mafé (Peanut Stew)', localName: 'Mafé / Domoda',
    description: 'Rich peanut butter stew with beef or lamb, cooked with tomatoes and root vegetables. Comfort food across West Africa.',
    countryId: c.SN.id, countryName: c.SN.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 50, servings: 6,
    estimatedCost: '2,000–3,500 CFA',
    ingredients: ['500 g beef or lamb', '1 cup peanut paste', '3 tbsp tomato paste', '2 onions', 'Carrots, sweet potato, cassava', '1 scotch bonnet', 'Vegetable oil', 'Salt', 'Seasoning cubes'],
    instructions: ['Brown meat in oil with onions.', 'Add tomato paste, fry 5 min.', 'Add water to cover, bring to boil.', 'Dissolve peanut paste in warm water, add to pot.', 'Add vegetables and pepper. Simmer 40 min.', 'Stir regularly to prevent sticking.', 'Serve over white rice.'],
    tags: ['mafe', 'peanut', 'stew', 'senegal'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Mafe_SN.JPG',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Thiéré (Couscous Sénégalais)', localName: 'Thiéré',
    description: 'Senegalese millet couscous steamed and served with a sweet or savoury sauce — lighter than North African couscous.',
    countryId: c.SN.id, countryName: c.SN.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 6,
    estimatedCost: '1,500–2,500 CFA',
    ingredients: ['3 cups millet couscous', 'Lamb or chicken', 'Pumpkin, cabbage, carrots', 'Tomato paste', 'Onion', 'Dried fish', 'Sweet potato', 'Salt', 'Butter'],
    instructions: ['Steam couscous in a couscoussier until fluffy.', 'In the bottom pot, cook meat with onion and tomato paste.', 'Add vegetables and water. Simmer 30 min.', 'Steam couscous a second time over the stew.', 'Fluff couscous with butter.', 'Serve couscous in a mound, ladle stew over top.'],
    tags: ['thiere', 'couscous', 'millet', 'senegal'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/960px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Fataya (Senegalese Pastry)', localName: 'Fataya',
    description: 'Deep-fried stuffed pastries filled with spiced fish or meat — Senegal\'s beloved street snack.',
    countryId: c.SN.id, countryName: c.SN.name, region: 'Nationwide',
    categories: ['snacks', 'street-food', 'breakfast'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 20, servings: 8,
    estimatedCost: '500–1,000 CFA',
    ingredients: ['3 cups flour', '1/2 cup oil', 'Water', 'Salt', 'Fish or beef (minced)', 'Onion', 'Parsley', 'Pepper', 'Lemon juice'],
    instructions: ['Make dough: mix flour, oil, salt, and water. Knead smooth.', 'Prepare filling: sauté minced fish/meat with onion, parsley, pepper.', 'Roll dough thin, cut circles.', 'Place filling and fold into half-moons. Seal edges.', 'Deep fry until golden brown.', 'Serve hot with hot sauce.'],
    tags: ['fataya', 'pastry', 'street-food', 'senegal'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Brikdish.jpg/960px-Brikdish.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CAMEROON 🇨🇲
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Ndolé', localName: 'Ndolé',
    description: 'Cameroon\'s national dish — bitter leaves cooked with groundnuts, shrimp, and beef in a rich, earthy stew.',
    countryId: c.CM.id, countryName: c.CM.name, region: 'Littoral / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 40, cookTime: 50, servings: 6,
    estimatedCost: '3,000–5,000 CFA',
    ingredients: ['500 g bitter leaves (ndolé)', '1 cup groundnut paste', '500 g beef', '200 g dried shrimp', '200 g smoked fish', 'Palm oil', '2 onions', 'Garlic', 'Crayfish', 'Salt', 'Seasoning cubes'],
    instructions: ['Wash bitter leaves repeatedly to remove bitterness. Boil and squeeze dry.', 'Cook beef until tender.', 'Roast and grind groundnuts to paste.', 'Fry onion and garlic in palm oil.', 'Add groundnut paste, meat stock, shrimp, and crayfish.', 'Add bitter leaves and cooked meat.', 'Simmer 30 min until thick and flavours meld.', 'Serve with plantain, miondo, or rice.'],
    tags: ['ndole', 'bitter-leaves', 'groundnut', 'cameroon'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Ndol%C3%A8_%C3%A0_la_viande%2C_morue_et_crevettes.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Eru Soup', localName: 'Eru',
    description: 'Southwest Cameroonian soup of shredded eru and waterleaf, loaded with crayfish and cow skin — thick and satisfying.',
    countryId: c.CM.id, countryName: c.CM.name, region: 'Southwest / Northwest',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 30, servings: 6,
    estimatedCost: '2,500–4,000 CFA',
    ingredients: ['3 cups shredded eru leaves', '3 cups waterleaf (chopped)', '1 cup palm oil', 'Crayfish (ground)', 'Cow skin (kanda)', 'Smoked fish', 'Stockfish', 'Salt', 'Seasoning'],
    instructions: ['Blanch waterleaf until reduced. Squeeze out water.', 'Cook cow skin and stockfish until tender.', 'Heat palm oil in pot.', 'Add crayfish, seasoning, meat, and stock.', 'Add waterleaf, cook 10 min.', 'Add shredded eru last. Stir and cook 5 min only.', 'Serve with garri (fufu corn) or miondo.'],
    tags: ['eru', 'cameroon', 'southwest', 'waterleaf'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/ERU_zeilboot_speldje.jpg/960px-ERU_zeilboot_speldje.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Achu Soup & Fufu', localName: 'Achu',
    description: 'Yellow soup made from limestone and palm oil, served with pounded cocoyam. A cherished Northwest dish.',
    countryId: c.CM.id, countryName: c.CM.name, region: 'Northwest',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 45, servings: 4,
    estimatedCost: '2,000–3,500 CFA',
    ingredients: ['2 kg cocoyam', 'Palm oil', 'Limestone (nikii)', 'Meat (beef, tripe)', 'Seasoning', 'Salt'],
    instructions: ['Boil cocoyam until soft. Pound until smooth and stretchy.', 'Boil meat with seasoning until tender.', 'For yellow soup: dissolve limestone in hot water, strain.', 'Mix palm oil with limestone water vigorously until yellow.', 'Add meat broth. The soup should be bright yellow and smooth.', 'Serve fufu in a bowl of yellow soup.'],
    tags: ['achu', 'yellow-soup', 'cocoyam', 'northwest', 'cameroon'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taro_sauce_jaune_avec_peau_de_boeuf.jpg/960px-Taro_sauce_jaune_avec_peau_de_boeuf.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Koki Beans', localName: 'Koki',
    description: 'Steamed black-eyed pea pudding wrapped in banana leaves with palm oil and crayfish — Cameroon\'s moi moi.',
    countryId: c.CM.id, countryName: c.CM.name, region: 'West / Nationwide',
    categories: ['lunch', 'snacks', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 60, servings: 6,
    estimatedCost: '1,500–2,500 CFA',
    ingredients: ['3 cups black-eyed peas', '1/2 cup palm oil', '2 scotch bonnet peppers', 'Crayfish', 'Spinach (optional)', 'Banana leaves', 'Salt'],
    instructions: ['Soak and peel beans. Blend smooth.', 'Add palm oil, pepper, crayfish, and salt to batter.', 'Optional: add chopped spinach.', 'Wrap portions in banana leaves, tie securely.', 'Steam in boiling water for 1 hour.', 'Unwrap and serve warm.'],
    tags: ['koki', 'bean-pudding', 'banana-leaf', 'cameroon'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/D%C3%A9gustation_de_koki.jpg/960px-D%C3%A9gustation_de_koki.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Poulet DG (Director General Chicken)', localName: 'Poulet DG',
    description: 'Cameroon\'s ultimate party dish — fried chicken and plantain in a rich tomato-vegetable sauce. Named because only bosses could afford it.',
    countryId: c.CM.id, countryName: c.CM.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'festive'], targetAudience: ['young-professionals', 'everyone'],
    difficulty: 'medium', prepTime: 25, cookTime: 35, servings: 4,
    estimatedCost: '3,000–5,000 CFA',
    ingredients: ['1 whole chicken (pieces)', '3 ripe plantains', '4 tomatoes', '2 carrots', 'Green beans', '2 onions', 'Garlic', 'Leeks', 'Vegetable oil', 'Salt', 'Seasoning'],
    instructions: ['Season and fry chicken until golden. Set aside.', 'Fry plantain slices. Set aside.', 'In same oil, sauté onions, garlic, leeks.', 'Add diced tomatoes, carrots, and green beans.', 'Add chicken back. Simmer 15 min.', 'Fold in fried plantains gently.', 'Serve hot — true Cameroon luxury.'],
    tags: ['poulet-dg', 'chicken', 'plantain', 'party', 'cameroon'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/POULET_DG.jpg',
    isFeatured: true, rating: 4.8,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CÔTE D'IVOIRE 🇨🇮
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Attiéké (Cassava Couscous)', localName: 'Attiéké',
    description: 'Fermented cassava granules — the Ivorian staple served with fried fish, alloco, and onion-tomato salad.',
    countryId: c.CI.id, countryName: c.CI.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'street-food'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 4,
    estimatedCost: '500–1,500 CFA',
    ingredients: ['2 cups attiéké (pre-made fermented cassava)', 'Fried fish or grilled chicken', 'Onion (sliced)', 'Tomatoes', 'Chilli pepper', 'Vegetable oil', 'Lemon', 'Salt'],
    instructions: ['Steam attiéké until fluffy and warm.', 'Make salad: mix sliced onion, tomato, pepper, oil, and lemon.', 'Fry or grill fish.', 'Serve attiéké on plate with fish and the onion salad.'],
    tags: ['attieke', 'cassava', 'couscous', 'cote-divoire'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Atti%C3%A9k%C3%A9-poissons.jpg/960px-Atti%C3%A9k%C3%A9-poissons.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Alloco (Fried Plantain)', localName: 'Alloco',
    description: 'Ivorian fried plantain in vegetable or palm oil — served with spicy chilli-onion sauce and grilled fish.',
    countryId: c.CI.id, countryName: c.CI.name, region: 'Nationwide',
    categories: ['snacks', 'street-food', 'dinner'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 10, servings: 2,
    estimatedCost: '300–700 CFA',
    ingredients: ['3 ripe plantains', 'Vegetable oil', 'Chilli pepper', 'Onion', 'Tomato', 'Salt'],
    instructions: ['Slice plantain into thick rounds.', 'Deep fry in hot oil until golden.', 'Make sauce: dice chilli, onion, and tomato with oil.', 'Serve alloco hot with spicy sauce.'],
    tags: ['alloco', 'plantain', 'street-food', 'cote-divoire'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Vendeuses_de_bananes_plantain.jpg/960px-Vendeuses_de_bananes_plantain.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Garba (Attiéké with Tuna)', localName: 'Garba',
    description: 'Street food legend — attiéké served with fried tuna, chilli, and onions. Named after a person who popularized it.',
    countryId: c.CI.id, countryName: c.CI.name, region: 'Abidjan / Nationwide',
    categories: ['lunch', 'street-food', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 10, servings: 2,
    estimatedCost: '300–600 CFA',
    ingredients: ['2 cups attiéké', 'Canned tuna or fried tuna steaks', 'Onion (sliced)', 'Tomato', 'Scotch bonnet pepper', 'Vegetable oil', 'Maggi cube', 'Salt'],
    instructions: ['Steam or fluff attiéké.', 'If using fresh tuna, season and fry in oil.', 'Mix onion, tomato, pepper, oil, and seasoning for sauce.', 'Serve attiéké with tuna and sauce on top.'],
    tags: ['garba', 'attieke', 'tuna', 'street-food', 'cote-divoire'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Garba_Party.jpg/960px-Garba_Party.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Kedjenou Chicken', localName: 'Kédjenou',
    description: 'Slow-cooked chicken stew from the Bété people — simmered in a sealed pot with no water, just the juices of vegetables.',
    countryId: c.CI.id, countryName: c.CI.name, region: 'Central-West (Bété)',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 60, servings: 4,
    estimatedCost: '2,000–3,500 CFA',
    ingredients: ['1 whole chicken (pieces)', '4 tomatoes', '2 onions', '2 bell peppers', '3 scotch bonnet peppers', 'Garlic', 'Ginger', 'Thyme', 'Bay leaves', 'Salt'],
    instructions: ['Place chicken pieces in a heavy pot or canari (clay pot).', 'Add all chopped vegetables, garlic, ginger, and spices.', 'DO NOT add water — the vegetables will create the sauce.', 'Seal pot tightly. Cook on low heat for 1 hour.', 'Shake pot occasionally, but never open the lid.', 'Serve with attiéké or rice.'],
    tags: ['kedjenou', 'chicken', 'slow-cook', 'cote-divoire'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/ZnuTjn2a.jpg/960px-ZnuTjn2a.jpg',
    isFeatured: true, rating: 4.8,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MALI 🇲🇱
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Tigadèguèna (Mali Peanut Stew)', localName: 'Tigadèguèna',
    description: 'Mali\'s beloved peanut butter stew — rich, thick, and served over rice. The country\'s most iconic home-cooked meal.',
    countryId: c.ML.id, countryName: c.ML.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 45, servings: 6,
    estimatedCost: '1,500–2,500 CFA',
    ingredients: ['500 g beef or chicken', '1 cup peanut butter', '3 tomatoes', '2 onions', 'Okra', 'Sweet potato', 'Vegetable oil', 'Chilli', 'Salt'],
    instructions: ['Brown meat with onions in oil.', 'Add chopped tomatoes, cook 10 min.', 'Dissolve peanut butter in warm water, add to pot.', 'Add sweet potato and okra.', 'Simmer 35 min until thick.', 'Serve over steamed rice.'],
    tags: ['tigadeguena', 'peanut', 'mali'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Mafe_SN.JPG',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Tô (Millet Porridge)', localName: 'Tô',
    description: 'Thick millet or sorghum porridge — the staple starch of Mali, served with various sauces.',
    countryId: c.ML.id, countryName: c.ML.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 20, servings: 4,
    estimatedCost: '500–800 CFA',
    ingredients: ['2 cups millet flour', 'Water', 'Salt'],
    instructions: ['Boil water in a pot.', 'Slowly add millet flour while stirring.', 'Stir vigorously to avoid lumps.', 'Cook on low heat until very thick and smooth.', 'Serve with peanut sauce, okra sauce, or leaf sauce.'],
    tags: ['to', 'millet', 'porridge', 'mali', 'staple'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Pineapple_Pastry.JPG/960px-Pineapple_Pastry.JPG',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  GUINEA 🇬🇳
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Riz au Gras (Guinea)', localName: 'Riz au Gras',
    description: 'Guinea\'s one-pot "fatty rice" — cooked in a meaty tomato broth with vegetables. Their version of jollof.',
    countryId: c.GN.id, countryName: c.GN.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 45, servings: 6,
    estimatedCost: '15,000–25,000 GNF',
    ingredients: ['3 cups rice', '500 g beef or chicken', 'Tomato paste', 'Onions', 'Carrots, cabbage', 'Vegetable oil', 'Scotch bonnet', 'Salt', 'Seasoning cubes'],
    instructions: ['Brown meat in oil. Set aside.', 'Fry onions, add tomato paste.', 'Add water, vegetables, and meat.', 'When vegetables are done, add washed rice.', 'Cook covered until rice absorbs all liquid.', 'Serve with extra pepper sauce.'],
    tags: ['riz-au-gras', 'guinea', 'jollof', 'rice'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Plat_de_riz_au_gras_plus_viande.jpg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Fouti (Fonio Porridge)', localName: 'Fouti',
    description: 'Steamed fonio grain — Guinea\'s ancient supergrain, served with any sauce. Gluten-free and nutritious.',
    countryId: c.GN.id, countryName: c.GN.name, region: 'Fouta Djallon',
    categories: ['lunch', 'dinner', 'traditional', 'vegetarian'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '8,000–12,000 GNF',
    ingredients: ['2 cups fonio', 'Water', 'Butter or oil', 'Salt'],
    instructions: ['Wash fonio thoroughly.', 'Steam in a couscoussier for 10 min.', 'Break up clumps, sprinkle with water.', 'Steam again for 10 min until fluffy.', 'Fluff with butter/oil and salt.', 'Serve with peanut sauce or leaf sauce.'],
    tags: ['fouti', 'fonio', 'guinea', 'ancient-grain'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/A_spelling_book-_containing_exercises_in_orthography%2C_pronunciation%2C_and_reading_%28IA_spellingbookcont00boll%29.pdf/page1-583px-A_spelling_book-_containing_exercises_in_orthography%2C_pronunciation%2C_and_reading_%28IA_spellingbookcont00boll%29.pdf.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SIERRA LEONE 🇸🇱
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Cassava Leaf Stew', localName: 'Plasas',
    description: 'Sierra Leone\'s staple — finely ground cassava leaves cooked with palm oil, fish, and meat. Rich and earthy.',
    countryId: c.SL.id, countryName: c.SL.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 40, cookTime: 50, servings: 6,
    estimatedCost: '30,000–50,000 SLL',
    ingredients: ['500 g cassava leaves (finely ground)', '1/2 cup palm oil', '500 g beef or chicken', 'Smoked fish', 'Onion', 'Scotch bonnet', 'Egusi or groundnut (optional)', 'Salt'],
    instructions: ['Pound or blend cassava leaves very finely.', 'Boil leaves for 20 min to reduce bitterness.', 'Cook meat until tender.', 'In a pot, heat palm oil. Add onion.', 'Add cassava leaves, meat, fish, and pepper.', 'Add egusi or groundnut paste for richness.', 'Simmer 30 min. Serve with rice.'],
    tags: ['cassava-leaf', 'plasas', 'sierra-leone'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Food_products_of_the_world_%28IA_62420620R.nlm.nih.gov%29.pdf/page1-700px-Food_products_of_the_world_%28IA_62420620R.nlm.nih.gov%29.pdf.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Groundnut Soup (Sierra Leone)', localName: 'Groundnut Soup',
    description: 'Thick peanut soup with chicken and vegetables — a Sierra Leonean comfort classic.',
    countryId: c.SL.id, countryName: c.SL.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: '25,000–40,000 SLL',
    ingredients: ['1 cup groundnut paste', 'Chicken pieces', '3 tomatoes', '1 onion', 'Okra', 'Pepper', 'Salt', 'Seasoning'],
    instructions: ['Boil chicken with onion and seasoning.', 'Blend tomatoes and add to stock.', 'Dissolve groundnut paste in warm water, add to pot.', 'Add okra and pepper. Simmer 25 min.', 'Stir regularly. Serve over rice.'],
    tags: ['groundnut', 'soup', 'peanut', 'sierra-leone'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Fufu.jpg/960px-Fufu.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  LIBERIA 🇱🇷
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Palava Sauce', localName: 'Palava Sauce / Palaver Sauce',
    description: 'Liberian stew of mixed greens (spinach, potato leaves) with palm oil, fish, and meat — "palaver" because it takes so long.',
    countryId: c.LR.id, countryName: c.LR.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 6,
    estimatedCost: '300–600 LRD',
    ingredients: ['3 cups mixed greens (potato leaves, spinach)', '1/2 cup palm oil', '500 g meat or fish', 'Dried shrimp', 'Okra', 'Scotch bonnet', 'Onion', 'Salt'],
    instructions: ['Boil greens until tender.', 'Cook meat separately.', 'Heat palm oil, fry onion.', 'Add greens, meat, dried shrimp, and pepper.', 'Add okra for thickness.', 'Simmer 25 min. Serve with fufu or rice.'],
    tags: ['palava', 'greens', 'liberia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Food_products_of_the_world_%28IA_62420620R.nlm.nih.gov%29.pdf/page1-700px-Food_products_of_the_world_%28IA_62420620R.nlm.nih.gov%29.pdf.jpg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Dumboy (Liberian Fufu)', localName: 'Dumboy',
    description: 'Pounded fermented cassava — Liberia\'s version of fufu, stretchy and served with palm butter or pepper soup.',
    countryId: c.LR.id, countryName: c.LR.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 10, cookTime: 30, servings: 4,
    estimatedCost: '150–300 LRD',
    ingredients: ['2 kg cassava (fermented)', 'Water'],
    instructions: ['Boil fermented cassava until very soft.', 'Pound in a mortar until smooth and elastic.', 'Shape into balls with wet hands.', 'Serve with palm butter soup or pepper soup.'],
    tags: ['dumboy', 'fufu', 'cassava', 'liberia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wrapped_fufu.jpg',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  BURKINA FASO 🇧🇫
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Riz Gras (Burkina)', localName: 'Riz Gras',
    description: 'Burkina Faso\'s "fat rice" — one-pot rice with meat, tomatoes, and vegetables. The country\'s comfort food.',
    countryId: c.BF.id, countryName: c.BF.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: '1,000–2,000 CFA',
    ingredients: ['3 cups rice', '500 g beef', 'Tomato paste', 'Carrots, cabbage, green beans', '2 onions', 'Oil', 'Salt', 'Seasoning'],
    instructions: ['Brown meat in oil. Set aside.', 'Fry onions, add tomato paste.', 'Add water, vegetables, and meat back.', 'Add washed rice. Cook covered until done.', 'Serve hot.'],
    tags: ['riz-gras', 'burkina-faso', 'rice'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Plat_de_riz_au_gras_plus_viande.jpg',
    isFeatured: true, rating: 4.4,
  },
  {
    name: 'Babenda', localName: 'Babenda',
    description: 'Mossi dish of mixed greens cooked with millet flour and soumbala — the quintessential rural Burkinabè meal.',
    countryId: c.BF.id, countryName: c.BF.name, region: 'Central (Mossi)',
    categories: ['lunch', 'dinner', 'traditional', 'vegetarian'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 25, servings: 4,
    estimatedCost: '300–600 CFA',
    ingredients: ['Mixed greens (sorrel, spinach, baobab)', 'Millet flour', 'Soumbala (fermented locust beans)', 'Salt', 'Water'],
    instructions: ['Boil greens until tender.', 'Dissolve millet flour in water, add to greens.', 'Add soumbala for umami flavour.', 'Stir and simmer until thick porridge.', 'Serve hot.'],
    tags: ['babenda', 'mossi', 'burkina-faso', 'greens'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Pineapple_Pastry.JPG/960px-Pineapple_Pastry.JPG',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  NIGER 🇳🇪
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Dambou (Niger)', localName: 'Dambou',
    description: 'Steamed moringa leaf couscous with groundnuts or oil — Niger\'s nutritious everyday staple.',
    countryId: c.NE.id, countryName: c.NE.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'vegetarian'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 30, servings: 4,
    estimatedCost: '500–1,000 CFA',
    ingredients: ['2 cups millet couscous', 'Moringa leaves (dried or fresh)', 'Groundnut oil or butter', 'Onion', 'Salt'],
    instructions: ['Steam millet couscous until fluffy.', 'Blanch moringa leaves, chop finely.', 'Mix moringa into couscous.', 'Add oil/butter and fried onion.', 'Season and serve.'],
    tags: ['dambou', 'moringa', 'niger', 'couscous'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Pineapple_Pastry.JPG/960px-Pineapple_Pastry.JPG',
    isFeatured: true, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  TOGO 🇹🇬
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Fufu & Peanut Soup (Togo)', localName: 'Fufu avec Sauce Arachide',
    description: 'Togolese fufu with a thick, fragrant peanut soup loaded with chicken — the nation\'s comfort food.',
    countryId: c.TG.id, countryName: c.TG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 4,
    estimatedCost: '1,000–2,000 CFA',
    ingredients: ['Yam or cassava for fufu', 'Peanut paste', 'Chicken', 'Tomatoes', 'Onion', 'Pepper', 'Salt', 'Seasoning'],
    instructions: ['Boil yam/cassava, pound into smooth fufu.', 'Cook chicken in tomato broth.', 'Add peanut paste dissolved in water.', 'Simmer 20 min until thick.', 'Serve fufu in peanut soup.'],
    tags: ['fufu', 'peanut', 'togo'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wrapped_fufu.jpg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Koklo Meme (Grilled Chicken)', localName: 'Koklo Meme',
    description: 'Togolese charcoal-grilled chicken marinated in spices — street food at its finest.',
    countryId: c.TG.id, countryName: c.TG.name, region: 'Lomé / Nationwide',
    categories: ['dinner', 'street-food'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 60, cookTime: 30, servings: 4,
    estimatedCost: '1,500–3,000 CFA',
    ingredients: ['1 whole chicken (butterflied)', 'Lemon juice', 'Garlic', 'Ginger', 'Chilli', 'Onion', 'Seasoning cubes', 'Oil', 'Salt'],
    instructions: ['Marinate chicken in lemon, garlic, ginger, chilli, onion, and oil for 1 hour.', 'Grill over charcoal, turning and basting often.', 'Cook until charred and cooked through.', 'Serve with attiéké or fried yam and pepper sauce.'],
    tags: ['koklo-meme', 'grilled-chicken', 'togo', 'street-food'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Animal_disease_thesaurus_%28IA_CAT80734093005%29.pdf/page1-854px-Animal_disease_thesaurus_%28IA_CAT80734093005%29.pdf.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  BENIN 🇧🇯
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Klui-Klui (Peanut Sticks)', localName: 'Klui-Klui',
    description: 'Beninese fried peanut paste sticks — crunchy, savoury, and a popular snack across the country.',
    countryId: c.BJ.id, countryName: c.BJ.name, region: 'Nationwide',
    categories: ['snacks', 'street-food'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 15, servings: 6,
    estimatedCost: '300–600 CFA',
    ingredients: ['2 cups roasted peanuts', 'Salt', 'Oil for frying'],
    instructions: ['Grind roasted peanuts to a thick paste.', 'Add salt, knead until pliable.', 'Shape into thin sticks or flat discs.', 'Deep fry in oil until crispy and golden.', 'Drain and cool. Store in airtight container.'],
    tags: ['klui-klui', 'peanut', 'snack', 'benin'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Kulikuli.jpg/960px-Kulikuli.jpg',
    isFeatured: true, rating: 4.4,
  },
  {
    name: 'Pâte Noire & Sauce Gombo', localName: 'Pâte Noire',
    description: 'Dark fermented corn paste (similar to amala) served with sticky okra sauce — Benin\'s daily staple.',
    countryId: c.BJ.id, countryName: c.BJ.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '200–500 CFA',
    ingredients: ['Fermented corn flour', 'Water', 'Okra', 'Palm oil', 'Crayfish', 'Meat or fish', 'Salt'],
    instructions: ['Boil water. Stir in fermented corn flour gradually.', 'Stir until thick and smooth. Shape into mounds.', 'Cook chopped okra with palm oil, crayfish, and meat.', 'Serve pâte noire with gombo sauce.'],
    tags: ['pate-noire', 'okra', 'benin', 'staple'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Pineapple_Pastry.JPG/960px-Pineapple_Pastry.JPG',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  GAMBIA 🇬🇲
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Domoda (Gambian Peanut Stew)', localName: 'Domoda',
    description: 'The Gambia\'s national dish — thick, comforting peanut stew with meat and tomato. Ultimate West African comfort.',
    countryId: c.GM.id, countryName: c.GM.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 45, servings: 6,
    estimatedCost: '150–300 GMD',
    ingredients: ['1 cup peanut paste', '500 g beef or chicken', 'Tomato paste', '2 onions', 'Bitter tomato (optional)', 'Chilli', 'Pumpkin', 'Salt', 'Oil'],
    instructions: ['Brown meat in oil.', 'Add onion and tomato paste, fry 5 min.', 'Add water, peanut paste, and vegetables.', 'Simmer 40 min, stirring often.', 'Serve over steamed white rice.'],
    tags: ['domoda', 'peanut', 'gambia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Domoda_Senegal.jpg/960px-Domoda_Senegal.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Benachin (One-Pot Rice)', localName: 'Benachin',
    description: 'Gambian one-pot rice — their version of jollof rice, cooked with fish and vegetables.',
    countryId: c.GM.id, countryName: c.GM.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 50, servings: 6,
    estimatedCost: '200–400 GMD',
    ingredients: ['3 cups rice', 'Large fish', 'Tomato paste', 'Pumpkin, cassava, cabbage', 'Oil', 'Onion', 'Chilli', 'Salt', 'Seasoning'],
    instructions: ['Fry fish in oil, set aside.', 'Fry onions, add tomato paste.', 'Add water and vegetables. Simmer 15 min.', 'Remove vegetables, add rice.', 'Cook covered until rice is done.', 'Arrange with fish and vegetables on top.'],
    tags: ['benachin', 'jollof', 'one-pot', 'gambia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: true, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  GUINEA-BISSAU 🇬🇼
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Caldo de Mancarra', localName: 'Caldo de Mancarra',
    description: 'Guinea-Bissau\'s peanut stew with chicken — Portuguese-influenced West African cooking.',
    countryId: c.GW.id, countryName: c.GW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 4,
    estimatedCost: '300–600 CFA',
    ingredients: ['1 cup groundnut paste', 'Chicken pieces', 'Tomatoes', 'Onion', 'Palm oil', 'Chilli', 'Salt'],
    instructions: ['Cook chicken in water with onion.', 'Add tomatoes and palm oil.', 'Dissolve groundnut paste, add to pot.', 'Simmer 30 min until thick.', 'Serve with rice.'],
    tags: ['caldo-de-mancarra', 'peanut', 'guinea-bissau'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Mafe_SN.JPG',
    isFeatured: true, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CABO VERDE 🇨🇻
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Cachupa', localName: 'Cachupa',
    description: 'Cabo Verde\'s national dish — a slow-cooked stew of corn, beans, and meat/fish. Cachupa Rica is the festive version.',
    countryId: c.CV.id, countryName: c.CV.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 120, servings: 8,
    estimatedCost: '500–1,000 CVE',
    ingredients: ['2 cups dried corn (hominy)', '1 cup dried beans', 'Chorizo, bacon, pork ribs', 'Cassava, sweet potato, plantain', 'Cabbage', 'Onion, garlic', 'Bay leaves', 'Salt'],
    instructions: ['Soak corn and beans overnight.', 'Boil corn and beans until tender (1+ hour).', 'Add meats, sausage, and root vegetables.', 'Add cabbage, garlic, bay leaves.', 'Simmer until everything is tender and stew is thick.', 'Season well. Serve hot.', 'Leftover cachupa is fried for breakfast (Cachupa Refogada).'],
    tags: ['cachupa', 'cabo-verde', 'corn', 'stew'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Cachupa_2.jpg/960px-Cachupa_2.jpg',
    isFeatured: true, rating: 4.7,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MAURITANIA 🇲🇷
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Mechoui (Roast Lamb)', localName: 'Méchoui',
    description: 'Whole spit-roasted lamb — a Mauritanian feast dish, slow-cooked over coals until tender and smoky.',
    countryId: c.MR.id, countryName: c.MR.name, region: 'Nationwide',
    categories: ['dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 240, servings: 12,
    estimatedCost: '10,000–20,000 MRU',
    ingredients: ['1 whole lamb', 'Butter', 'Cumin', 'Salt', 'Garlic', 'Paprika'],
    instructions: ['Clean and prep the whole lamb.', 'Rub with butter, cumin, garlic, paprika, and salt.', 'Mount on a spit over hot coals.', 'Roast slowly for 3–4 hours, rotating and basting.', 'The meat should be fall-off-the-bone tender.', 'Serve on a large platter with bread and salad.'],
    tags: ['mechoui', 'lamb', 'roast', 'mauritania'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Pavement_braai_2.jpg/960px-Pavement_braai_2.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Thiéboudienne (Mauritania)', localName: 'Thiéboudienne',
    description: 'Mauritanian fish and rice — similar to Senegalese version but with local Saharan spice touches.',
    countryId: c.MR.id, countryName: c.MR.name, region: 'Southern Mauritania',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 25, cookTime: 55, servings: 6,
    estimatedCost: '3,000–5,000 MRU',
    ingredients: ['3 cups rice', 'Whole fish', 'Tomato paste', 'Vegetables (carrot, cabbage, cassava)', 'Tamarind', 'Oil', 'Onion', 'Dried fish', 'Salt'],
    instructions: ['Stuff fish with herb paste, fry until golden.', 'Fry onion and tomato paste.', 'Add water and vegetables. Simmer 20 min.', 'Remove veg and fish. Add rice to broth.', 'Cook covered until rice is tender.', 'Arrange rice, fish, and vegetables on platter.'],
    tags: ['thieboudienne', 'fish-rice', 'mauritania'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Thieboudienne.JPG/960px-Thieboudienne.JPG',
    isFeatured: false, rating: 4.5,
  },
];

// ─── Seeder ────────────────────────────────────────────────────
export const seedWestAfricanFoods = async () => {
  const CODES = ['GH', 'SN', 'CM', 'CI', 'ML', 'GN', 'SL', 'LR', 'BF', 'NE', 'TG', 'BJ', 'GM', 'GW', 'CV', 'MR'];
  const countryMap = await getCountryMap(CODES);
  console.log(`  📍 Found ${Object.keys(countryMap).length} West African countries`);

  const collectionRef = db.collection(COLLECTIONS.FOODS);
  const foodsData = makeFoods(countryMap);

  // Clear existing foods for these countries
  for (const code of CODES) {
    if (!countryMap[code]) continue;
    const existing = await collectionRef.where('countryId', '==', countryMap[code].id).get();
    if (!existing.empty) {
      const B = 500;
      for (let i = 0; i < existing.docs.length; i += B) {
        const batch = db.batch();
        existing.docs.slice(i, i + B).forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
      console.log(`  🗑️  Cleared ${existing.size} existing foods for ${countryMap[code].name}`);
    }
  }

  // Insert
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

  // Update food counts per country
  const counts = {};
  results.forEach(f => { counts[f.countryId] = (counts[f.countryId] || 0) + 1; });
  for (const [countryId, count] of Object.entries(counts)) {
    await db.collection(COLLECTIONS.COUNTRIES).doc(countryId).update({ foodCount: count });
  }

  return results;
};

// ─── Run standalone ────────────────────────────────────────────
const isMain = process.argv[1]?.replace(/\\/g, '/').endsWith('seedWestAfricanFoods.js');
if (isMain) {
  console.log('🌍 Seeding West African foods…\n');
  seedWestAfricanFoods()
    .then(foods => {
      console.log(`\n✅ Seeded ${foods.length} West African foods!`);
      foods.forEach((f, i) => console.log(`  ${i + 1}. ${f.name} — ${f.countryName}`));
      process.exit(0);
    })
    .catch(err => { console.error('❌', err.message); process.exit(1); });
}
