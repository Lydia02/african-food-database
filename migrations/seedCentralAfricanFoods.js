/**
 * Seed Central African foods.
 * Countries: DR Congo, Congo Republic, Gabon, Central African Republic,
 *            Chad, Equatorial Guinea, São Tomé & Príncipe
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
  //  DR CONGO 🇨🇩
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Moambe Chicken (Poulet Moambe)', localName: 'Poulet à la Moambe',
    description: 'DRC\'s national dish — chicken braised in rich red palm nut sauce with spinach and chilli. Deeply flavourful.',
    countryId: c.CD.id, countryName: c.CD.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 50, servings: 6,
    estimatedCost: '15,000–30,000 CDF',
    ingredients: ['1 whole chicken (jointed)', '1 can palm nut concentrate (moambe)', '2 onions', '3 tomatoes', '1 bunch spinach', '2 green chillies', '3 cloves garlic', 'Salt', 'Oil'],
    instructions: ['Season chicken with garlic and salt. Brown in oil.', 'Fry onions and tomatoes.', 'Add palm nut moambe paste and water. Stir.', 'Return chicken. Simmer 35 min on low.', 'Add spinach and chillies last 10 min.', 'Sauce should be thick and orange-red.', 'Serve with fufu, rice, or plantain.'],
    tags: ['moambe', 'poulet', 'palm-nut', 'congo', 'drc'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Poulet_%C3%A0_la_moambe.JPG/960px-Poulet_%C3%A0_la_moambe.JPG',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Fufu (Congolese)', localName: 'Fufu / Luku',
    description: 'Central Africa\'s staple dough — cassava flour pounded until smooth and stretchy. The base of every meal.',
    countryId: c.CD.id, countryName: c.CD.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 4,
    estimatedCost: '2,000–4,000 CDF',
    ingredients: ['2 cups cassava flour', 'Water', 'Salt'],
    instructions: ['Boil water with a pinch of salt.', 'Gradually add cassava flour, stirring vigorously.', 'Beat with a wooden spoon until smooth and elastic.', 'Cook 10 min on low, stirring constantly.', 'Shape into balls with wet hands.', 'Serve alongside moambe, pondu, or any stew.'],
    tags: ['fufu', 'cassava', 'staple', 'congo', 'drc'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wrapped_fufu.jpg',
    isFeatured: false, rating: 4.4,
  },
  {
    name: 'Pondu (Saka Saka)', localName: 'Pondu / Saka Saka',
    description: 'Pounded cassava leaves slow-cooked with palm oil, dried fish, and onion — DRC\'s beloved leafy stew.',
    countryId: c.CD.id, countryName: c.CD.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 60, servings: 6,
    estimatedCost: '8,000–15,000 CDF',
    ingredients: ['1 kg cassava leaves (pounded)', '1/2 cup palm oil', '200 g dried fish', '2 onions', '2 tomatoes', 'Salt', 'Chilli', 'Water'],
    instructions: ['Pound cassava leaves until very fine. Boil 30 min.', 'Drain. Transfer to pot with palm oil.', 'Add soaked dried fish (shredded), onions, tomatoes.', 'Add water. Simmer on low 30–45 min stirring occasionally.', 'Season with salt and chilli.', 'Serve with fufu or rice.'],
    tags: ['pondu', 'saka-saka', 'cassava-leaves', 'palm-oil', 'congo', 'drc'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Mr._Wathen%27s_Translation_of_the_Preceding_Inscription._Translation_of_an_Inscription_on_Three_Copper_Plates_Found_near_Bhand%C3%BAp_Village_in_Salsette._Dated_Saka_948_%28A._D._1027%29_%28IA_jstor-25207482%29.pdf/page1-750px-thumbnail.pdf.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Liboke ya Mbisi', localName: 'Liboke ya Mbisi',
    description: 'Congolese fish steamed in banana leaves with tomatoes, onion, and spices — the ultimate river fish dish.',
    countryId: c.CD.id, countryName: c.CD.name, region: 'Kinshasa / River regions',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 30, servings: 4,
    estimatedCost: '10,000–20,000 CDF',
    ingredients: ['1 whole freshwater fish (tilapia or capitaine)', 'Banana leaves', '2 tomatoes', '1 onion', '1 green pepper', 'Chilli', 'Garlic', 'Lemon juice', 'Salt', 'Palm oil'],
    instructions: ['Clean and season fish with lemon, garlic, salt.', 'Soften banana leaves over flame.', 'Layer vegetables on leaf: tomato, onion, pepper, chilli.', 'Place fish on top. Drizzle palm oil.', 'Wrap tightly. Tie with string.', 'Steam or grill over coals 25–30 min.', 'Serve in the leaf with fufu or rice.'],
    tags: ['liboke', 'fish', 'banana-leaf', 'steamed', 'congo', 'drc'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/The_agricultural_economy_of_the_Belgian_Congo_and_Ruanda-Urundi_%28IA_agriculturalecon22skin%29.pdf/page1-960px-The_agricultural_economy_of_the_Belgian_Congo_and_Ruanda-Urundi_%28IA_agriculturalecon22skin%29.pdf.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Makemba (Fried Plantain)', localName: 'Makemba',
    description: 'Congolese fried plantain — sweet, caramelised edges. Eaten as snack, side, or breakfast.',
    countryId: c.CD.id, countryName: c.CD.name, region: 'Nationwide',
    categories: ['snacks', 'breakfast', 'street-food', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 10, servings: 4,
    estimatedCost: '2,000–5,000 CDF',
    ingredients: ['4 ripe plantains', 'Oil for frying', 'Salt (optional)'],
    instructions: ['Peel plantains, slice diagonally.', 'Heat oil in pan.', 'Fry slices until golden brown on each side.', 'Drain on paper towel.', 'Serve alone, with beans, or alongside a main dish.'],
    tags: ['makemba', 'plantain', 'fried', 'snack', 'congo', 'drc'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Vendeuses_de_bananes_plantain.jpg/960px-Vendeuses_de_bananes_plantain.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Mikate (Congolese Doughnuts)', localName: 'Mikate / Beignets',
    description: 'Congolese street doughnuts — crispy balls of sweetened dough, perfect with coffee or tea.',
    countryId: c.CD.id, countryName: c.CD.name, region: 'Kinshasa / Nationwide',
    categories: ['breakfast', 'snacks', 'street-food', 'desserts'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 60, cookTime: 15, servings: 10,
    estimatedCost: '3,000–5,000 CDF',
    ingredients: ['3 cups flour', '1/2 cup sugar', '1 sachet yeast', '1 egg', 'Warm water', 'Oil for frying', 'Salt'],
    instructions: ['Dissolve yeast in warm water with sugar. Let froth.', 'Add flour, egg, salt. Mix to thick batter.', 'Cover, let rise 1 hour until doubled.', 'Heat oil. Drop spoonfuls of batter into oil.', 'Fry until golden and puffed (3 min each side).', 'Drain. Optionally dust with powdered sugar.'],
    tags: ['mikate', 'beignets', 'doughnuts', 'street-food', 'congo', 'drc'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Bowl_of_mandazi.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CONGO REPUBLIC 🇨🇬
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Mbika (Pumpkin Seed Stew)', localName: 'Mbika',
    description: 'Congo-Brazzaville pumpkin seed paste stew — thick, nutty, and served with smoked fish and fufu.',
    countryId: c.CG.id, countryName: c.CG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 30, servings: 4,
    estimatedCost: '3,000–5,000 XAF',
    ingredients: ['1 cup ground pumpkin seeds (mbika)', '200 g smoked fish', '2 onions', '2 tomatoes', 'Palm oil', 'Chilli', 'Salt', 'Water'],
    instructions: ['Dissolve ground pumpkin seeds in warm water.', 'Fry onions in palm oil. Add tomatoes.', 'Add pumpkin seed paste. Stir.', 'Add shredded smoked fish and chilli.', 'Simmer 20 min until thick.', 'Serve with fufu or boiled plantains.'],
    tags: ['mbika', 'pumpkin-seed', 'smoked-fish', 'congo-brazzaville'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/EGUSI.JPG/960px-EGUSI.JPG',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Mwambe (Palm Butter Sauce)', localName: 'Mwambe',
    description: 'Palm butter sauce with chicken or fish — shared heritage across both Congos. Rich and orange-hued.',
    countryId: c.CG.id, countryName: c.CG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 45, servings: 6,
    estimatedCost: '4,000–7,000 XAF',
    ingredients: ['1 kg chicken pieces', '1 can palm butter (palm fruit concentrate)', '2 onions', '3 tomatoes', 'Garlic', 'Chilli', 'Salt', 'Oil'],
    instructions: ['Brown chicken in oil. Set aside.', 'Fry onions, garlic, tomatoes.', 'Add palm butter and water. Stir until smooth.', 'Return chicken. Simmer 30 min.', 'Add chilli. Check consistency — should be rich and thick.', 'Serve with fufu, rice, or boiled cassava.'],
    tags: ['mwambe', 'palm-butter', 'chicken', 'congo-brazzaville'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Poulet_%C3%A0_la_moambe.JPG/960px-Poulet_%C3%A0_la_moambe.JPG',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  GABON 🇬🇦
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Nyembwe Chicken', localName: 'Poulet au Nyembwe',
    description: 'Gabon\'s national dish — chicken simmered in palm nut cream (nyembwe). The pride of Gabonese cuisine.',
    countryId: c.GA.id, countryName: c.GA.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 50, servings: 6,
    estimatedCost: '8,000–15,000 XAF',
    ingredients: ['1 whole chicken (jointed)', '1 can palm nut cream (nyembwe)', '2 onions', '3 tomatoes', '4 cloves garlic', 'Salt', 'Maggi cube', 'Hot pepper', 'Oil'],
    instructions: ['Season chicken with garlic and salt. Brown in oil.', 'Fry onions and tomatoes until soft.', 'Add palm nut cream. Mix well.', 'Return chicken. Add water to cover.', 'Simmer 40 min until chicken is cooked through.', 'Sauce should be thick, creamy, and orange.', 'Serve with plantain, rice, or cassava sticks (bâton de manioc).'],
    tags: ['nyembwe', 'poulet', 'palm-nut', 'gabon'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Poulet_%C3%A0_la_moambe.JPG/960px-Poulet_%C3%A0_la_moambe.JPG',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Bâton de Manioc', localName: 'Bâton de Manioc / Bobolo',
    description: 'Fermented cassava wrapped in banana leaves and steamed — Gabon and Central Africa\'s essential starchy side.',
    countryId: c.GA.id, countryName: c.GA.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 120, cookTime: 30, servings: 6,
    estimatedCost: '1,000–2,000 XAF',
    ingredients: ['2 kg cassava (peeled, soaked 3 days)', 'Banana leaves', 'Water'],
    instructions: ['Soak cassava in water 3 days to ferment.', 'Grate and press out liquid.', 'Wrap portions in softened banana leaves into sticks.', 'Tie with raffia or string.', 'Steam for 30 min.', 'Serve alongside any stew or grilled meat.'],
    tags: ['baton-de-manioc', 'bobolo', 'cassava', 'fermented', 'gabon'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wrapped_fufu.jpg',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CENTRAL AFRICAN REPUBLIC 🇨🇫
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Gozo (Cassava Bread)', localName: 'Gozo',
    description: 'CAR\'s staple — thick cassava flour bread served with every meal. Dense, filling, and traditional.',
    countryId: c.CF.id, countryName: c.CF.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '500–1,000 XAF',
    ingredients: ['3 cups cassava flour', 'Water', 'Salt'],
    instructions: ['Boil water with salt.', 'Add cassava flour gradually, stirring.', 'Cook on low heat 15 min, stirring constantly.', 'Shape into a thick mound.', 'Serve with kanda, palm nut sauce, or greens.'],
    tags: ['gozo', 'cassava', 'bread', 'car', 'central-african-republic'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Koekjestrommel_open.jpg',
    isFeatured: true, rating: 4.3,
  },
  {
    name: 'Kanda (Meatballs in Sauce)', localName: 'Kanda ti Nyama',
    description: 'Central African meatballs in tomato-peanut sauce — hearty and flavourful, served with gozo.',
    countryId: c.CF.id, countryName: c.CF.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 30, servings: 4,
    estimatedCost: '2,000–4,000 XAF',
    ingredients: ['500 g ground beef', '2 tbsp peanut butter', '2 tomatoes', '1 onion', '1 green pepper', 'Garlic', 'Oil', 'Salt', 'Chilli'],
    instructions: ['Season ground beef. Form into small balls.', 'Fry meatballs in oil until browned. Set aside.', 'Fry onion, garlic. Add tomatoes and pepper.', 'Dissolve peanut butter in warm water. Add to sauce.', 'Return meatballs. Simmer 20 min.', 'Serve over gozo.'],
    tags: ['kanda', 'meatballs', 'peanut', 'car', 'central-african-republic'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/2011_Horn_of_Africa_famine_Oxfam_01.jpg/960px-2011_Horn_of_Africa_famine_Oxfam_01.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CHAD 🇹🇩
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Daraba (Okra Stew)', localName: 'Daraba',
    description: 'Chadian okra and peanut butter stew — creamy, thick, and served with boule (millet porridge).',
    countryId: c.TD.id, countryName: c.TD.name, region: 'Southern Chad',
    categories: ['lunch', 'dinner', 'traditional', 'vegetarian'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 25, servings: 4,
    estimatedCost: '1,000–2,000 XAF',
    ingredients: ['10 fresh okra (chopped)', '3 tbsp peanut butter', '2 tomatoes', '1 onion', '1 bunch greens (amaranth)', 'Oil', 'Salt'],
    instructions: ['Boil okra until slimy and soft.', 'Add peanut butter dissolved in warm water.', 'Add chopped tomatoes and greens.', 'Simmer 15 min until creamy.', 'Season with salt.', 'Serve with boule (millet ball porridge).'],
    tags: ['daraba', 'okra', 'peanut', 'chad'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Sayur_oyong.JPG/960px-Sayur_oyong.JPG',
    isFeatured: true, rating: 4.4,
  },
  {
    name: 'Boule (Millet Ball)', localName: 'Boule / Aiysh',
    description: 'Chad\'s staple — stiff millet porridge formed into a ball. Eaten by tearing pieces and dipping in stew.',
    countryId: c.TD.id, countryName: c.TD.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 20, servings: 4,
    estimatedCost: '500–1,000 XAF',
    ingredients: ['2 cups millet flour', 'Water', 'Salt'],
    instructions: ['Boil water. Gradually add millet flour.', 'Stir vigorously with a wooden stick.', 'Cook 15 min until very thick and smooth.', 'Shape into a round ball with wet hands.', 'Serve with daraba, meat sauce, or dried fish stew.'],
    tags: ['boule', 'aiysh', 'millet', 'chad'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wrapped_fufu.jpg',
    isFeatured: false, rating: 4.2,
  },
  {
    name: 'Kissar (Chadian Crêpe)', localName: 'Kissar',
    description: 'Thin fermented sorghum crêpes — Chad\'s answer to injera. Slightly sour and spongy.',
    countryId: c.TD.id, countryName: c.TD.name, region: 'Central / Northern Chad',
    categories: ['breakfast', 'lunch', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 720, cookTime: 15, servings: 6,
    estimatedCost: '500–1,000 XAF',
    ingredients: ['2 cups sorghum flour', 'Water', 'Pinch of yeast or natural ferment', 'Salt'],
    instructions: ['Mix sorghum flour with water to thin batter.', 'Let ferment overnight (8–12 hours).', 'Heat a flat griddle (non-stick).', 'Pour thin layer of batter, swirl to spread.', 'Cook 2 min until set. Do not flip. Remove.', 'Serve with stews, meats, or dried fish sauce.'],
    tags: ['kissar', 'crepe', 'sorghum', 'fermented', 'chad'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Kisra_maker.jpeg/960px-Kisra_maker.jpeg',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  EQUATORIAL GUINEA 🇬🇶
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Succotash de Mariscos', localName: 'Succotash de Mariscos',
    description: 'Equatoguinean seafood stew — prawns, fish, and vegetables in a peppery tomato broth. Spanish-African fusion.',
    countryId: c.GQ.id, countryName: c.GQ.name, region: 'Bioko Island',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 30, servings: 4,
    estimatedCost: '15,000–25,000 XAF',
    ingredients: ['300 g prawns', '300 g white fish fillets', '3 tomatoes', '1 onion', '2 green peppers', '1 plantain (sliced)', 'Chilli', 'Palm oil', 'Garlic', 'Salt'],
    instructions: ['Fry onion and garlic in palm oil.', 'Add tomatoes, peppers, chilli. Cook 10 min.', 'Add fish and plantain. Simmer 10 min.', 'Add prawns last 5 min.', 'Season well.', 'Serve with rice or boiled plantain.'],
    tags: ['succotash', 'seafood', 'prawns', 'equatorial-guinea'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Calulu.jpg/960px-Calulu.jpg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Pepesoup (Equatoguinean)', localName: 'Pepesoup',
    description: 'Spicy fish pepper soup — a Central African version with scotch bonnets, ginger, and fresh fish.',
    countryId: c.GQ.id, countryName: c.GQ.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 25, servings: 4,
    estimatedCost: '5,000–10,000 XAF',
    ingredients: ['1 kg whole fish (cleaned)', '2 scotch bonnet peppers', 'Ginger', '3 cloves garlic', '2 onions', '2 tomatoes', '2 limes', 'Salt'],
    instructions: ['Boil water with ginger, garlic, onion.', 'Add chopped tomatoes and peppers.', 'Add fish. Simmer 15 min.', 'Season with lime juice and salt.', 'Serve hot in bowls. Drink the broth.'],
    tags: ['pepesoup', 'fish', 'spicy', 'equatorial-guinea'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/African_Cat-Fish_Pepper_Soup.jpg/960px-African_Cat-Fish_Pepper_Soup.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SÃO TOMÉ & PRÍNCIPE 🇸🇹
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Calulu São-tomense', localName: 'Calulu',
    description: 'São Tomé\'s national dish — smoked and fresh fish stewed with okra, tomatoes, and palm oil over slow heat.',
    countryId: c.ST.id, countryName: c.ST.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 45, servings: 6,
    estimatedCost: '200–400 STN',
    ingredients: ['300 g smoked fish', '300 g fresh fish', '8 okra', '3 tomatoes', '2 onions', '1/2 cup palm oil', 'Aubergine', 'Sweet potato leaves', 'Chilli', 'Salt'],
    instructions: ['Soak and shred smoked fish.', 'Layer in pot: onions, tomatoes, okra, aubergine, leaves.', 'Add both fish on top. Drizzle palm oil.', 'Add water to just cover.', 'Cook on low heat 40 min without stirring.', 'Serve with ângu de banana (mashed starches).'],
    tags: ['calulu', 'smoked-fish', 'okra', 'sao-tome'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Calulu.jpg/960px-Calulu.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Ângu de Banana', localName: 'Ângu',
    description: 'Mashed green banana side dish — São Tomé\'s starchy base, similar to fufu but with banana.',
    countryId: c.ST.id, countryName: c.ST.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '50–100 STN',
    ingredients: ['6 green bananas', 'Palm oil', 'Salt', 'Water'],
    instructions: ['Peel and boil green bananas until very soft.', 'Drain. Mash thoroughly with wooden spoon.', 'Add a drizzle of palm oil and salt. Mix.', 'Shape into a mound.', 'Serve alongside calulu or any stew.'],
    tags: ['angu', 'banana', 'mashed', 'sao-tome'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Matooke_to_the_market.jpg/960px-Matooke_to_the_market.jpg',
    isFeatured: false, rating: 4.2,
  },
];

// ─── Seeder ────────────────────────────────────────────────────
export const seedCentralAfricanFoods = async () => {
  const codes = ['CD', 'CG', 'GA', 'CF', 'TD', 'GQ', 'ST'];
  const c = await getCountryMap(codes);
  console.log(`  📍 Found ${Object.keys(c).length} countries`);

  const collectionRef = db.collection(COLLECTIONS.FOODS);

  // Clear existing for these countries
  for (const { id } of Object.values(c)) {
    const snap = await collectionRef.where('countryId', '==', id).get();
    if (!snap.empty) {
      const B = 500;
      for (let i = 0; i < snap.docs.length; i += B) {
        const batch = db.batch();
        snap.docs.slice(i, i + B).forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
    }
  }

  const foodsData = makeFoods(c);

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

  const counts = {};
  results.forEach(f => { counts[f.countryId] = (counts[f.countryId] || 0) + 1; });
  for (const [countryId, count] of Object.entries(counts)) {
    await db.collection(COLLECTIONS.COUNTRIES).doc(countryId).update({ foodCount: count });
  }

  return results;
};

const isMain = process.argv[1]?.replace(/\\/g, '/').endsWith('seedCentralAfricanFoods.js');
if (isMain) {
  console.log('🌍 Seeding Central African foods…\n');
  seedCentralAfricanFoods()
    .then(foods => {
      console.log(`\n✅ Seeded ${foods.length} Central African foods!`);
      foods.forEach((f, i) => console.log(`  ${i + 1}. ${f.name} — ${f.countryName}`));
      process.exit(0);
    })
    .catch(err => { console.error('❌', err.message); process.exit(1); });
}
