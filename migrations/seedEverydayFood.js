/**
 * Seed African Everyday Foods.
 * Common home-cooked meals people eat daily across Africa —
 * rice dishes, bean dishes, porridges, stews, simple staples.
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

const makeEverydayFoods = (c) => [

  // ═══════════════════════════════════════════════════════════════
  //  NIGERIA 🇳🇬 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'White Rice and Stew', localName: 'Iresi àti Obe Ata',
    description: 'The everyday Nigerian lunch — plain boiled white rice with tomato-pepper stew and fried chicken, beef, or fish. Eaten daily nationwide.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'quick-meals'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 30, servings: 4,
    estimatedCost: '₦500–1,500',
    ingredients: ['3 cups white rice', '6 tomatoes', '4 red bell peppers', '2 scotch bonnet peppers', '2 onions', '1/3 cup vegetable oil', 'Seasoning cubes', 'Salt', 'Protein (chicken, beef, or fish)'],
    instructions: ['Boil rice until fluffy. Drain.', 'Blend tomatoes, peppers. Fry onion in oil.', 'Add blended pepper. Cook 20 min until oil floats.', 'Season with salt and seasoning cubes.', 'Fry or cook protein of choice.', 'Serve rice with stew and protein.'],
    tags: ['rice', 'stew', 'everyday', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Eba and Egusi Soup', localName: 'Eba àti Ofe Egusi',
    description: 'Nigeria\'s everyday swallow — garri (cassava flakes) stirred into hot water and eaten with melon seed soup. Quick and filling.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 30, servings: 4,
    estimatedCost: '₦600–1,500',
    ingredients: ['Eba: 2 cups garri, hot water', 'Egusi: 1 cup ground melon seeds, spinach or bitter leaf, palm oil, assorted meat, stockfish, crayfish, onion, locust beans, seasoning'],
    instructions: ['Eba: boil water, add garri, stir quickly until firm.', 'Fry onion in palm oil. Add locust beans, crayfish.', 'Dissolve ground egusi. Add to pot. Stir.', 'Add meat, stockfish. Cook 15 min.', 'Add chopped spinach. Cook 5 min more.', 'Serve eba with egusi soup.'],
    tags: ['eba', 'egusi', 'swallow', 'everyday', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Egusi_Soup_and_Semo.jpg/960px-Egusi_Soup_and_Semo.jpg',
    isFeatured: false, rating: 4.7,
  },
  {
    name: 'Yam Porridge (Asaro)', localName: 'Asaro',
    description: 'Chunky yam cooked in peppery tomato sauce until soft and semi-mashed. A quick everyday one-pot meal across Nigeria.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 25, servings: 4,
    estimatedCost: '₦400–800',
    ingredients: ['1 medium yam (cubed)', '3 tomatoes', '2 red bell peppers', '1 scotch bonnet', '1 onion', '3 tbsp palm oil', 'Crayfish', 'Salt', 'Seasoning'],
    instructions: ['Blend tomatoes, peppers, onion.', 'Boil yam in salted water — halfway cooked.', 'Add blended pepper, palm oil, crayfish, seasoning.', 'Cook until yam is soft and sauce is thick.', 'Mash lightly or leave chunky.', 'Serve in bowls.'],
    tags: ['asaro', 'yam-porridge', 'one-pot', 'everyday', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Yams_species_called_Parkistan._The_size_is_for_eating_but_smaller_sizes_can_be_cultivated.jpg/960px-Yams_species_called_Parkistan._The_size_is_for_eating_but_smaller_sizes_can_be_cultivated.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Beans Porridge', localName: 'Ewa Riro',
    description: 'Honey beans cooked in palm oil with pepper and crayfish until thick and porridge-like. Everyday Nigerian protein fix.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 40, servings: 4,
    estimatedCost: '₦400–700',
    ingredients: ['2 cups honey beans', '1/4 cup palm oil', '2 scotch bonnet peppers', '1 onion', 'Crayfish', 'Seasoning cubes', 'Salt'],
    instructions: ['Parboil beans 10 min. Drain and rinse.', 'Add fresh water and cook until tender.', 'Add palm oil, diced onion, blended pepper.', 'Add crayfish and seasoning.', 'Cook until thick and porridge-like.', 'Serve with bread, garri, or fried plantain.'],
    tags: ['ewa-riro', 'beans-porridge', 'everyday', 'budget', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Rice_and_beans%2C_Hotel_in_Itatiaia.jpeg/960px-Rice_and_beans%2C_Hotel_in_Itatiaia.jpeg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Fried Rice (Nigerian)', localName: 'Fried Rice',
    description: 'Nigerian party-style fried rice — basmati rice stir-fried with mixed vegetables, liver, prawns, and curry. Sunday special.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 30, servings: 6,
    estimatedCost: '₦1,000–3,000',
    ingredients: ['3 cups parboiled rice', 'Mixed vegetables (carrots, green beans, peas, sweetcorn)', '2 eggs', 'Liver', 'Prawns (optional)', 'Curry powder', 'Thyme', 'Soy sauce', 'Oil', 'Salt'],
    instructions: ['Boil rice until almost done. Drain.', 'Dice and blanch vegetables.', 'Scramble eggs separately. Set aside.', 'Heat oil. Add rice and vegetables.', 'Add curry, thyme, soy sauce.', 'Stir-fry 5 min. Add egg and liver.', 'Serve with grilled chicken and coleslaw.'],
    tags: ['fried-rice', 'party', 'everyday', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Spaghetti Jollof', localName: 'Spaghetti Jollof',
    description: 'Spaghetti cooked in peppery tomato sauce — Nigeria\'s quick weeknight pasta. Student and office-worker favourite.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'quick-meals', 'budget-friendly'], targetAudience: ['university-students', 'young-professionals'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '₦300–700',
    ingredients: ['1 pack spaghetti', '4 tomatoes', '2 red bell peppers', '1 scotch bonnet', '1 onion', '2 tbsp oil', 'Seasoning cubes', 'Salt', 'Protein (egg, sardine, or corned beef)'],
    instructions: ['Boil spaghetti al dente. Drain.', 'Blend tomatoes and peppers.', 'Fry onion in oil. Add blended pepper.', 'Cook sauce 15 min.', 'Add spaghetti. Toss to coat.', 'Add protein of choice.', 'Serve hot.'],
    tags: ['spaghetti', 'jollof', 'pasta', 'quick-meals', 'everyday', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  GHANA 🇬🇭 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Fufu and Light Soup', localName: 'Fufu ne Nkrakra',
    description: 'Pounded cassava and plantain with spicy tomato broth and goat or chicken. Ghana\'s most-eaten evening meal.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 4,
    estimatedCost: 'GH₵10–25',
    ingredients: ['Fufu: 2 cups cassava, 2 plantains', 'Soup: whole chicken or goat, tomatoes, onion, pepper, ginger, garden eggs'],
    instructions: ['Boil cassava and plantain until soft. Pound in pestle until smooth.', 'Make soup: cook meat until tender.', 'Add blended tomatoes, onion, pepper, ginger.', 'Simmer 20 min.', 'Shape fufu into ball in soup bowl. Ladle soup over.', 'Eat by tearing fufu and dipping into soup.'],
    tags: ['fufu', 'light-soup', 'pounded', 'everyday', 'ghanaian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Fufu_%26_Soup.jpg/960px-Fufu_%26_Soup.jpg',
    isFeatured: false, rating: 4.7,
  },
  {
    name: 'Jollof Rice (Ghanaian)', localName: 'Jollof',
    description: 'Ghana\'s own jollof — basmati rice cooked in rich tomato sauce with spices. Everyday celebration food and weeknight dinner.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: 'GH₵8–20',
    ingredients: ['3 cups basmati rice', '6 tomatoes', '3 onions', 'Tomato paste', 'Scotch bonnet', 'Ginger', 'Garlic', 'Bay leaves', 'Thyme', 'Oil', 'Salt', 'Seasoning'],
    instructions: ['Blend tomatoes, onion, pepper, ginger, garlic.', 'Fry remaining onion in oil. Add tomato paste.', 'Add blended mix. Cook 20 min until oil separates.', 'Add washed rice, water level with rice.', 'Add bay leaves, thyme.', 'Cook on low heat until rice is done.', 'Serve with shito and fried chicken.'],
    tags: ['jollof', 'rice', 'everyday', 'ghanaian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: false, rating: 4.8,
  },
  {
    name: 'Ampesi (Boiled Yam/Plantain) with Kontomire', localName: 'Ampesi ne Kontomire',
    description: 'Boiled yam, plantain, or cocoyam with kontomire (cocoyam leaf) stew. Ghana\'s simple healthy everyday meal.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Ashanti / Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 25, servings: 4,
    estimatedCost: 'GH₵5–12',
    ingredients: ['2 yams or 4 plantains (or mix)', 'Kontomire stew: cocoyam leaves, palm oil, tomatoes, onion, smoked fish, agushie (melon seeds)'],
    instructions: ['Boil yam/plantain in salted water until tender.', 'Make stew: blend or chop kontomire leaves.', 'Fry onion in palm oil. Add tomatoes, agushie.', 'Add leaves and smoked fish. Simmer 15 min.', 'Serve boiled tuber with kontomire stew.'],
    tags: ['ampesi', 'kontomire', 'boiled', 'everyday', 'ghanaian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Fufu_%26_Soup.jpg/960px-Fufu_%26_Soup.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  KENYA 🇰🇪 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Githeri', localName: 'Githeri',
    description: 'Boiled maize and beans — Kenya\'s simplest everyday meal. Often upgraded with potatoes, tomatoes, and onion.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Central Kenya / Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly', 'traditional'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 60, servings: 6,
    estimatedCost: 'KSh 100–200',
    ingredients: ['2 cups dried maize', '1 cup kidney beans', '2 potatoes (cubed)', '2 tomatoes', '1 onion', '2 tbsp oil', 'Salt'],
    instructions: ['Soak maize and beans overnight.', 'Boil together until both are tender (about 1 hr).', 'Fry onion in oil. Add tomatoes.', 'Add potatoes and cooked maize-beans.', 'Season and simmer 15 min.', 'Serve as a complete one-pot meal.'],
    tags: ['githeri', 'maize-beans', 'one-pot', 'everyday', 'kenyan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Ugali_%26_Sukuma_Wiki.jpg',
    isFeatured: false, rating: 4.3,
  },
  {
    name: 'Mukimo', localName: 'Mukimo',
    description: 'Mashed potatoes, peas, maize, and greens all pounded together — Kikuyu comfort food eaten daily in central Kenya.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Central Kenya',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 30, servings: 4,
    estimatedCost: 'KSh 150–300',
    ingredients: ['4 potatoes', '1 cup green peas', '1 cup maize kernels', '1 bunch pumpkin leaves or spinach', 'Salt'],
    instructions: ['Boil potatoes, peas, and maize until tender.', 'Boil greens separately. Drain and chop.', 'Mash everything together.', 'Season with salt.', 'Serve as a mound with stew or grilled meat.'],
    tags: ['mukimo', 'mashed', 'potato', 'everyday', 'kikuyu', 'kenyan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Ugali_%26_Sukuma_Wiki.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Ugali and Nyama Choma', localName: 'Ugali na Nyama Choma',
    description: 'Stiff maize porridge with charcoal-grilled beef — Kenya\'s favourite dinner. Eaten with kachumbari salsa.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Nationwide',
    categories: ['dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 30, servings: 4,
    estimatedCost: 'KSh 300–600',
    ingredients: ['Ugali: 2 cups maize flour, water', 'Nyama Choma: 1 kg beef ribs, salt, lemon', 'Kachumbari: tomato, onion, coriander, chilli, lemon'],
    instructions: ['Make ugali: boil water, add flour, stir 10 min until stiff.', 'Season meat with salt and lemon.', 'Grill over charcoal until cooked and charred.', 'Make kachumbari: dice tomato, onion, coriander, chilli, lemon.', 'Serve ugali, nyama choma, and kachumbari together.'],
    tags: ['ugali', 'nyama-choma', 'grilled', 'everyday', 'kenyan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Ugali_%26_Sukuma_Wiki.jpg',
    isFeatured: false, rating: 4.7,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ETHIOPIA 🇪🇹 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Shiro Wot', localName: 'Shiro Wot',
    description: 'Chickpea flour stew cooked with berbere, garlic, and onion — Ethiopia\'s most eaten everyday dish, especially during fasting days.',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'vegetarian', 'budget-friendly', 'traditional'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '30–60 ETB',
    ingredients: ['1 cup shiro (roasted chickpea flour)', '2 onions (finely chopped)', '3 tbsp oil or kibbeh', '2 tbsp berbere', 'Garlic', 'Ginger', 'Water', 'Salt'],
    instructions: ['Slowly cook onion in oil without browning (30 min).', 'Add berbere, garlic, ginger. Cook 5 min.', 'Dissolve shiro in water. Pour into pot.', 'Stir continuously on medium 10 min.', 'Adjust thickness. Season.', 'Serve on injera.'],
    tags: ['shiro', 'chickpea', 'stew', 'everyday', 'ethiopian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Alicha_1.jpg/960px-Alicha_1.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Misir Wot (Red Lentil Stew)', localName: 'Misir Wot',
    description: 'Spiced red lentil stew — Ethiopia\'s staple protein during Orthodox fasting. Earthy, spicy, and comforting on injera.',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'vegetarian', 'budget-friendly', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 25, servings: 4,
    estimatedCost: '30–60 ETB',
    ingredients: ['1.5 cups red lentils', '2 onions (diced)', '3 tbsp berbere', 'Oil or kibbeh', 'Garlic', 'Ginger', 'Tomato paste', 'Salt'],
    instructions: ['Cook onion in oil until deep brown.', 'Add berbere, garlic, ginger. Cook 5 min.', 'Add tomato paste and lentils.', 'Add water. Bring to boil.', 'Simmer 20 min until lentils dissolve.', 'Serve on injera.'],
    tags: ['misir-wot', 'lentil', 'stew', 'everyday', 'ethiopian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Alicha_1.jpg/960px-Alicha_1.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SOUTH AFRICA 🇿🇦 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Pap and Chakalaka', localName: 'Pap en Chakalaka',
    description: 'South Africa\'s daily staple — maize porridge with spicy vegetable and bean relish. Found at every braai and dinner table.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 25, servings: 4,
    estimatedCost: 'R20–50',
    ingredients: ['Pap: 2 cups maize meal, water, salt', 'Chakalaka: 1 can baked beans, 2 carrots, 1 green pepper, 1 onion, 2 tomatoes, chilli, curry powder, oil'],
    instructions: ['Make pap: boil water, add maize meal, stir 15 min.', 'Chakalaka: fry onion, add carrots, peppers, tomatoes.', 'Add curry powder and chilli. Cook 5 min.', 'Add baked beans. Simmer 10 min.', 'Serve pap with chakalaka spooned on top.'],
    tags: ['pap', 'chakalaka', 'maize', 'everyday', 'south-african'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Boerewors_raw.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Umngqusho (Samp and Beans)', localName: 'Umngqusho',
    description: 'Dried corn kernels (samp) cooked slowly with sugar beans — Xhosa staple and Nelson Mandela\'s favourite dish.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Eastern Cape / Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 120, servings: 6,
    estimatedCost: 'R20–40',
    ingredients: ['2 cups samp (dried corn kernels)', '1 cup sugar beans', 'Butter', 'Onion', 'Salt', 'Pepper'],
    instructions: ['Soak samp and beans overnight.', 'Boil together until tender (2+ hours).', 'Add butter, fried onion, salt, pepper.', 'Cook until creamy and well-combined.', 'Serve as a main or side dish.'],
    tags: ['umngqusho', 'samp', 'beans', 'xhosa', 'everyday', 'south-african'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Boerewors_raw.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  EGYPT 🇪🇬 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Ful Medames', localName: 'Ful Medames',
    description: 'Slow-cooked fava beans mashed with olive oil, lemon, and cumin — Egypt\'s daily breakfast, eaten by millions every morning.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['breakfast', 'traditional', 'budget-friendly', 'vegetarian'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 4,
    estimatedCost: '5–20 EGP',
    ingredients: ['2 cups cooked fava beans', '3 tbsp olive oil', 'Lemon juice', 'Cumin', 'Garlic', 'Parsley', 'Pita bread', 'Boiled eggs'],
    instructions: ['Heat beans with liquid.', 'Mash partially. Season with cumin, garlic, lemon, olive oil.', 'Serve in bowls with more olive oil drizzled on top.', 'Eat with warm pita bread and boiled eggs.'],
    tags: ['ful-medames', 'fava', 'breakfast', 'everyday', 'egyptian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Ful_medames_%28arabic_meal%29.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Kushari', localName: 'Kushari',
    description: 'Egypt\'s everyday carb bowl — rice, lentils, macaroni, chickpeas, spicy tomato sauce, and crispy onions layered together.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['lunch', 'vegetarian', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 30, servings: 6,
    estimatedCost: '10–25 EGP',
    ingredients: ['1 cup rice', '1 cup brown lentils', '1 cup elbow macaroni', '1 cup chickpeas', '3 onions (sliced)', 'Tomato sauce with vinegar and chilli', 'Garlic', 'Oil', 'Salt'],
    instructions: ['Cook rice, lentils, macaroni separately.', 'Fry onion rings until crispy dark brown.', 'Make tomato-vinegar-chilli sauce.', 'Layer in bowls: rice, lentils, pasta, chickpeas.', 'Top with sauce and fried onions.'],
    tags: ['kushari', 'koshari', 'rice', 'lentils', 'everyday', 'egyptian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Koshary2.JPG/960px-Koshary2.JPG',
    isFeatured: false, rating: 4.7,
  },
  {
    name: 'Molokhia', localName: 'Molokhia',
    description: 'Jute leaf soup — slimy, garlicky, and deeply flavourful green stew. Egypt\'s everyday pharaonic comfort food.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 15, servings: 4,
    estimatedCost: '15–30 EGP',
    ingredients: ['500 g fresh or frozen molokhia leaves (chopped)', 'Chicken or rabbit broth', 'Garlic (lots)', 'Coriander', 'Ghee or butter', 'Salt', 'Rice', 'Chicken or rabbit'],
    instructions: ['Finely chop molokhia leaves.', 'Bring broth to boil. Add molokhia.', 'Fry garlic with coriander in ghee until fragrant.', 'Pour garlic mixture into soup. Stir.', 'Serve over rice with chicken or rabbit.'],
    tags: ['molokhia', 'jute-leaf', 'soup', 'everyday', 'egyptian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Koshary2.JPG/960px-Koshary2.JPG',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MOROCCO 🇲🇦 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Harira', localName: 'Harira',
    description: 'Tomato-lentil-chickpea soup — Morocco\'s daily dinner and the traditional Ramadan iftar soup. Thick, hearty, and warming.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: '15–30 MAD',
    ingredients: ['1 cup lentils', '1 cup chickpeas (soaked)', '200 g lamb or beef (cubed)', '4 tomatoes', '1 onion', 'Celery', 'Cilantro', 'Parsley', 'Flour (for thickening)', 'Ginger', 'Turmeric', 'Cinnamon', 'Salt', 'Pepper'],
    instructions: ['Brown meat with onion, spices.', 'Add tomatoes, celery, herbs. Cover with water.', 'Simmer 30 min.', 'Add lentils and chickpeas. Cook 20 min more.', 'Thicken with flour-water mixture.', 'Serve with dates and chebakia (honey pastry).'],
    tags: ['harira', 'soup', 'lentil', 'ramadan', 'everyday', 'moroccan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/960px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg',
    isFeatured: false, rating: 4.7,
  },
  {
    name: 'Rfissa', localName: 'Rfissa',
    description: 'Shredded msemen flatbread layered with lentils and chicken in a fenugreek-saffron sauce. Moroccan everyday comfort food.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 45, servings: 4,
    estimatedCost: '30–60 MAD',
    ingredients: ['4 msemen (shredded)', '1 cup lentils', 'Chicken (pieces)', 'Onion', 'Fenugreek', 'Saffron', 'Ras el hanout', 'Oil', 'Salt'],
    instructions: ['Cook chicken with onion, spices, saffron in water.', 'Cook lentils separately.', 'Shred msemen into pieces. Layer on platter.', 'Add lentils over msemen.', 'Place chicken on top. Pour broth over all.', 'Serve communally.'],
    tags: ['rfissa', 'msemen', 'lentils', 'chicken', 'everyday', 'moroccan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/960px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SENEGAL 🇸🇳 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Yassa Poulet', localName: 'Yassa Ginaar',
    description: 'Chicken marinated in lemon and onion then braised — Senegal\'s everyday chicken and rice dinner. Casamance origin.',
    countryId: c.SN.id, countryName: c.SN.name, region: 'Casamance / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 60, cookTime: 30, servings: 4,
    estimatedCost: '2,500–4,000 XOF',
    ingredients: ['1 chicken (jointed)', '6 onions (sliced)', '4 lemons (juiced)', 'Dijon mustard', 'Oil', 'Garlic', 'Black pepper', 'Olives', 'Salt', 'Rice'],
    instructions: ['Marinate chicken in lemon juice, onion, mustard, garlic (1 hr minimum).', 'Grill or fry chicken until golden.', 'Fry marinated onions slowly until caramelised.', 'Add chicken back, olives. Simmer 20 min.', 'Serve over steamed white rice.'],
    tags: ['yassa', 'chicken', 'lemon', 'onion', 'everyday', 'senegalese'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Thieboudienne.JPG/960px-Thieboudienne.JPG',
    isFeatured: false, rating: 4.7,
  },
  {
    name: 'Mafé (Peanut Stew)', localName: 'Mafé',
    description: 'Rich peanut butter stew with beef or chicken and root vegetables — West Africa\'s everyday comfort food.',
    countryId: c.SN.id, countryName: c.SN.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: '2,000–3,500 XOF',
    ingredients: ['500 g beef or chicken', '4 tbsp peanut butter', '3 tomatoes', '1 onion', '2 potatoes', '1 carrot', '1 sweet potato', 'Cabbage', 'Tomato paste', 'Oil', 'Salt', 'Rice'],
    instructions: ['Brown meat. Add onion.', 'Add tomato paste and tomatoes. Cook 10 min.', 'Dissolve peanut butter in water. Add to pot.', 'Add potatoes, carrot, sweet potato.', 'Simmer 30 min until thick and vegetables done.', 'Serve over rice.'],
    tags: ['mafe', 'peanut', 'stew', 'groundnut', 'everyday', 'senegalese'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Thieboudienne.JPG/960px-Thieboudienne.JPG',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  TANZANIA 🇹🇿 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Wali wa Nazi (Coconut Rice)', localName: 'Wali wa Nazi',
    description: 'Rice cooked in coconut milk — the everyday Swahili staple. Fragrant, slightly sweet, and pairs with everything.',
    countryId: c.TZ.id, countryName: c.TZ.name, region: 'Dar es Salaam / Coastal',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 20, servings: 4,
    estimatedCost: 'TZS 2,000–4,000',
    ingredients: ['2 cups rice', '1 cup coconut milk', '1 cup water', 'Salt'],
    instructions: ['Wash rice. Add to pot with coconut milk and water.', 'Add salt. Bring to boil.', 'Reduce heat. Cover and cook 18 min.', 'Fluff with fork.', 'Serve with mchuzi (stew), fish, or beans.'],
    tags: ['wali', 'coconut-rice', 'swahili', 'everyday', 'tanzanian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/2_Chapati_warm_and_ready_to_be_eaten.jpg/960px-2_Chapati_warm_and_ready_to_be_eaten.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Makande (Maize and Beans)', localName: 'Makande',
    description: 'Boiled maize and kidney beans — Tanzania\'s cheap everyday sustenance. Similar to Kenya\'s githeri.',
    countryId: c.TZ.id, countryName: c.TZ.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 60, servings: 6,
    estimatedCost: 'TZS 1,500–3,000',
    ingredients: ['2 cups dried maize', '1 cup kidney beans', '1 onion', '2 tomatoes', 'Salt', 'Oil', 'Coconut milk (optional)'],
    instructions: ['Soak maize and beans overnight.', 'Boil until both are tender (1 hr).', 'Fry onion and tomatoes.', 'Add to maize and beans.', 'Add coconut milk for creaminess (coastal style).', 'Serve hot.'],
    tags: ['makande', 'maize', 'beans', 'everyday', 'tanzanian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Ugali_%26_Sukuma_Wiki.jpg',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  UGANDA 🇺🇬 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Posho and Beans', localName: 'Posho na Bijanjalo',
    description: 'Uganda\'s daily bread — stiff maize porridge (posho) with bean stew. School lunch, home dinner, everywhere.',
    countryId: c.UG.id, countryName: c.UG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'budget-friendly', 'traditional'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 25, servings: 4,
    estimatedCost: 'UGX 2,000–5,000',
    ingredients: ['Posho: 2 cups maize flour, water', 'Beans: 2 cups kidney beans, onion, tomato, oil, salt'],
    instructions: ['Make posho: boil water, add maize flour, stir 10 min until stiff.', 'Cook pre-soaked beans until tender.', 'Fry onion in oil. Add tomato.', 'Add beans. Simmer.', 'Serve posho with bean stew.'],
    tags: ['posho', 'beans', 'maize', 'everyday', 'ugandan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Ugali_%26_Sukuma_Wiki.jpg',
    isFeatured: false, rating: 4.3,
  },
  {
    name: 'Katogo', localName: 'Katogo',
    description: 'Green bananas cooked with beans, groundnuts, or offal in a one-pot stew — Buganda\'s traditional everyday breakfast.',
    countryId: c.UG.id, countryName: c.UG.name, region: 'Central Uganda',
    categories: ['breakfast', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 30, servings: 4,
    estimatedCost: 'UGX 3,000–6,000',
    ingredients: ['6 green bananas (peeled, cubed)', '1 cup beans or offal', '2 tomatoes', '1 onion', 'Oil', 'Salt'],
    instructions: ['Peel and cube green bananas.', 'Fry onion and tomato.', 'Add beans or offal and water.', 'Add bananas. Simmer 25 min until all soft.', 'Season.', 'Serve as a hearty breakfast.'],
    tags: ['katogo', 'banana', 'one-pot', 'everyday', 'ugandan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Matooke_to_the_market.jpg/960px-Matooke_to_the_market.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CÔTE D'IVOIRE 🇨🇮 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Sauce Graine (Palm Nut Soup)', localName: 'Sauce Graine',
    description: 'Rich palm fruit soup — daily dinner across Ivorian households. Served with foutou (pounded yam/plantain).',
    countryId: c.CI.id, countryName: c.CI.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 6,
    estimatedCost: '1,500–3,000 XOF',
    ingredients: ['Palm fruit pulp or palm nut cream', 'Fish or meat', 'Tomatoes', 'Onion', 'Aubergine', 'Okra', 'Crab or crayfish', 'Chilli', 'Salt'],
    instructions: ['Extract cream from palm fruits (or use canned).', 'Cook meat or fish until tender.', 'Add palm cream. Bring to boil.', 'Add vegetables, crab, crayfish.', 'Simmer until thick and orange.', 'Serve with foutou.'],
    tags: ['sauce-graine', 'palm-nut', 'soup', 'everyday', 'ivorian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Atti%C3%A9k%C3%A9-poissons.jpg/960px-Atti%C3%A9k%C3%A9-poissons.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CAMEROON 🇨🇲 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Eru Soup', localName: 'Eru',
    description: 'Shredded wild spinach (eru) cooked with waterleaf, palm oil, smoked fish, and cow skin. Daily Cameroonian dinner.',
    countryId: c.CM.id, countryName: c.CM.name, region: 'Southwest / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 30, servings: 4,
    estimatedCost: '2,000–5,000 XAF',
    ingredients: ['300 g eru leaves (shredded)', '1 bunch waterleaf', '1/2 cup palm oil', 'Smoked fish', 'Cow skin (kanda)', 'Crayfish', 'Salt', 'Pepper'],
    instructions: ['Shred eru leaves very fine.', 'Chop waterleaf. Cook and squeeze out water.', 'Add palm oil, crayfish, smoked fish, cow skin to a pot.', 'Add waterleaf. Cook 10 min.', 'Add eru leaves. Stir.', 'Cook 15 min on low heat. Do NOT add water.', 'Serve with garri, fufu, or boiled cassava.'],
    tags: ['eru', 'spinach', 'soup', 'everyday', 'cameroonian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Ndol%C3%A8_%C3%A0_la_viande%2C_morue_et_crevettes.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  DRC CONGO 🇨🇩 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Fufu and Pondu', localName: 'Fufu na Pondu',
    description: 'Cassava fufu with pounded cassava leaf stew — the DRC\'s daily meal. Eaten for lunch and dinner across the country.',
    countryId: c.CD.id, countryName: c.CD.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 60, servings: 6,
    estimatedCost: '3,000–8,000 CDF',
    ingredients: ['Fufu: 3 cups cassava flour, water', 'Pondu: 1 kg pounded cassava leaves, palm oil, dried fish, onion, garlic, salt'],
    instructions: ['Boil water. Add cassava flour stirring vigorously for 10 min.', 'Pondu: boil pounded leaves 30 min until dark.', 'Add palm oil, dried fish, onion, garlic.', 'Simmer 30 min more.', 'Shape fufu into ball. Serve with pondu.'],
    tags: ['fufu', 'pondu', 'cassava', 'everyday', 'congolese'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wrapped_fufu.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ZIMBABWE 🇿🇼 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Sadza and Muriwo', localName: 'Sadza ne Muriwo',
    description: 'Maize porridge with sautéed collard greens — Zimbabwe\'s daily plate. Sometimes the only meal of the day.',
    countryId: c.ZW.id, countryName: c.ZW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '$1–3 USD',
    ingredients: ['Sadza: 2 cups maize meal, water', 'Muriwo: 1 large bunch greens (spinach or rape), tomato, onion, oil, salt'],
    instructions: ['Make sadza: boil water, add maize meal, stir until stiff.', 'Sauté onion and tomato in oil.', 'Add chopped greens. Cook 5 min.', 'Season.', 'Serve sadza with muriwo.'],
    tags: ['sadza', 'muriwo', 'greens', 'everyday', 'zimbabwean'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Sadza_and_Sausage.jpg/960px-Sadza_and_Sausage.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ZAMBIA 🇿🇲 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Nshima and Ifisashi', localName: 'Nshima na Ifisashi',
    description: 'Maize porridge with greens in peanut sauce — Zambia\'s classic home-cooked dinner. Nutritious and affordable.',
    countryId: c.ZM.id, countryName: c.ZM.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 25, servings: 4,
    estimatedCost: '20–40 ZMW',
    ingredients: ['Nshima: 2 cups mealie meal, water', 'Ifisashi: 1 bunch spinach or pumpkin leaves, 3 tbsp ground peanuts, tomato, onion, salt'],
    instructions: ['Make nshima: boil water, add mealie meal, stir 15 min.', 'Cook greens with onion and tomato.', 'Add ground peanuts. Stir.', 'Simmer 10 min until thick.', 'Serve nshima with ifisashi.'],
    tags: ['nshima', 'ifisashi', 'peanut', 'greens', 'everyday', 'zambian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Nshima_and_mice.JPG/960px-Nshima_and_mice.JPG',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MOZAMBIQUE 🇲🇿 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Matapa', localName: 'Matapa',
    description: 'Cassava leaf stew cooked with peanuts, coconut milk, and garlic. Mozambique\'s everyday green dish.',
    countryId: c.MZ.id, countryName: c.MZ.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 30, servings: 4,
    estimatedCost: '100–300 MZN',
    ingredients: ['500 g cassava leaves (pounded)', '3 tbsp peanut butter', '1 cup coconut milk', '4 garlic cloves', 'Salt'],
    instructions: ['Boil pounded cassava leaves for 20 min.', 'Add peanut butter dissolved in coconut milk.', 'Add garlic. Stir.', 'Simmer 15 min until thick.', 'Serve with rice or xima.'],
    tags: ['matapa', 'cassava-leaf', 'peanut', 'everyday', 'mozambican'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Matapa.jpg/960px-Matapa.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  RWANDA 🇷🇼 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Isombe', localName: 'Isombe',
    description: 'Pounded cassava leaves cooked with peanut paste and eggplant — Rwanda\'s everyday vegetable dish.',
    countryId: c.RW.id, countryName: c.RW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 30, servings: 4,
    estimatedCost: '500–1,500 RWF',
    ingredients: ['500 g cassava leaves (pounded)', '3 tbsp peanut paste', '1 eggplant (diced)', 'Onion', 'Oil', 'Salt'],
    instructions: ['Boil cassava leaves until tender.', 'Add diced eggplant and peanut paste.', 'Fry onion. Add to pot.', 'Simmer 15 min.', 'Serve with rice, boiled plantain, or ugali.'],
    tags: ['isombe', 'cassava-leaf', 'peanut', 'everyday', 'rwandan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Wrapped_fufu.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MADAGASCAR 🇲🇬 — EVERYDAY MEALS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Romazava', localName: 'Romazava',
    description: 'Madagascar\'s national stew — beef with mixed leafy greens (brèdes). Served over rice three times a day.',
    countryId: c.MG.id, countryName: c.MG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 30, servings: 4,
    estimatedCost: '3,000–8,000 MGA',
    ingredients: ['500 g beef (cubed)', 'Mixed greens (brèdes mafana, watercress, spinach)', '2 tomatoes', '1 onion', 'Ginger', 'Garlic', 'Oil', 'Salt'],
    instructions: ['Brown beef with onion, garlic, ginger.', 'Add tomatoes. Cook 5 min.', 'Add water. Simmer 20 min until tender.', 'Add mixed greens. Cook 5 more min.', 'Serve over white rice (vary).'],
    tags: ['romazava', 'beef', 'greens', 'everyday', 'malagasy'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg',
    isFeatured: false, rating: 4.5,
  },
];

// ─── Seeder ────────────────────────────────────────────────────
export const seedEverydayFood = async () => {
  const codes = ['NG', 'GH', 'KE', 'ET', 'ZA', 'EG', 'MA', 'SN', 'TZ', 'UG', 'CI', 'CM', 'CD', 'ZW', 'ZM', 'MZ', 'RW', 'MG'];
  const c = await getCountryMap(codes);
  console.log(`  📍 Found ${Object.keys(c).length} countries`);

  const collectionRef = db.collection(COLLECTIONS.FOODS);
  const foodsData = makeEverydayFoods(c);

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

  // Update country food counts
  const counts = {};
  results.forEach(f => { counts[f.countryId] = (counts[f.countryId] || 0) + 1; });
  for (const [countryId, count] of Object.entries(counts)) {
    const doc = await db.collection(COLLECTIONS.COUNTRIES).doc(countryId).get();
    const current = doc.data()?.foodCount || 0;
    await db.collection(COLLECTIONS.COUNTRIES).doc(countryId).update({ foodCount: current + count });
  }

  return results;
};

const isMain = process.argv[1]?.replace(/\\/g, '/').endsWith('seedEverydayFood.js');
if (isMain) {
  console.log('🍲 Seeding African Everyday Foods…\n');
  seedEverydayFood()
    .then(foods => {
      console.log(`\n✅ Seeded ${foods.length} everyday foods!`);
      foods.forEach((f, i) => console.log(`  ${i + 1}. ${f.name} — ${f.countryName}`));
      process.exit(0);
    })
    .catch(err => { console.error('❌', err.message); process.exit(1); });
}
