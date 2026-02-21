/**
 * Seed East African foods.
 * Countries: Kenya, Tanzania, Uganda, Ethiopia, Somalia, Rwanda,
 *            Burundi, Eritrea, Djibouti, South Sudan, Sudan
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
  //  ETHIOPIA 🇪🇹
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Injera with Doro Wat', localName: 'Injera be Doro Wet',
    description: 'Ethiopia\'s festive dish — spicy chicken stew with hard-boiled eggs on sourdough injera. Quintessential Ethiopian cuisine.',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 90, servings: 6,
    estimatedCost: '300–600 ETB',
    ingredients: ['1 whole chicken (pieces)', '6 hard-boiled eggs', '4 large onions (diced, no oil)', '3 tbsp berbere spice', '1/4 cup niter kibbeh (spiced butter)', 'Garlic', 'Ginger', 'Tomato paste', 'Salt', 'Injera for serving'],
    instructions: ['Dry-fry diced onions (no oil) stirring 20 min until browned and sweet.', 'Add niter kibbeh, garlic, and ginger. Cook 5 min.', 'Add berbere and tomato paste. Stir 10 min.', 'Add chicken pieces. Cook in sauce 45 min adding water as needed.', 'Score hard-boiled eggs and add to stew last 15 min.', 'Serve on a large injera, with rolled injera for scooping.'],
    tags: ['injera', 'doro-wat', 'chicken', 'berbere', 'ethiopia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Injera_with_eight_kinds_of_stew.jpg/960px-Injera_with_eight_kinds_of_stew.jpg',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Kitfo (Ethiopian Steak Tartare)', localName: 'Kitfo',
    description: 'Hand-minced raw beef seasoned with mitmita spice and niter kibbeh — Ethiopia\'s raw delicacy, can be served leb leb (lightly cooked).',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Gurage / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 5, servings: 2,
    estimatedCost: '200–400 ETB',
    ingredients: ['500 g lean beef', '3 tbsp niter kibbeh (melted)', '2 tbsp mitmita spice', 'Kocho (false banana bread)', 'Ayib (Ethiopian cottage cheese)', 'Gomen (collard greens)'],
    instructions: ['Finely mince fresh lean beef with a sharp knife (not ground).', 'Warm niter kibbeh until liquid.', 'Mix beef with warm kibbeh and mitmita.', 'For leb leb: lightly warm in a pan.', 'Serve with ayib (cheese), gomen, and kocho.'],
    tags: ['kitfo', 'raw-beef', 'gurage', 'ethiopia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Kitfo_with_Ayibe..JPG',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Shiro Wat', localName: 'Shiro',
    description: 'Chickpea flour stew — Ethiopia\'s most beloved vegan dish. Eaten on fasting days and loved every other day too.',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'vegan', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '50–120 ETB',
    ingredients: ['1 cup shiro powder (roasted chickpea flour)', '2 onions (diced)', '3 tbsp oil', 'Garlic', 'Tomato (diced)', 'Berbere or turmeric', 'Salt', 'Water'],
    instructions: ['Fry onions in oil until golden.', 'Add garlic, tomato, and berbere.', 'Add water, bring to simmer.', 'Gradually whisk in shiro powder to avoid lumps.', 'Stir continuously on low heat 15 min until thick.', 'Serve on injera.'],
    tags: ['shiro', 'chickpea', 'vegan', 'fasting', 'ethiopia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Taita_and_shiro.jpg/960px-Taita_and_shiro.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Tibs (Sautéed Meat)', localName: 'Tibs',
    description: 'Pan-fried cubed beef or lamb with peppers, onions, and rosemary — the go-to quick Ethiopian meat dish.',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'quick-meals'], targetAudience: ['young-professionals', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 15, servings: 2,
    estimatedCost: '150–300 ETB',
    ingredients: ['500 g beef or lamb (cubed)', '2 onions', '2 green peppers', 'Jalapeños', 'Rosemary', 'Garlic', 'Niter kibbeh or oil', 'Salt', 'Black pepper'],
    instructions: ['Heat niter kibbeh in a hot pan.', 'Add meat cubes, sear on high heat.', 'Add onions, peppers, garlic.', 'Add rosemary and seasoning.', 'Stir-fry 10 min.', 'Serve on injera or with bread (ambasha).'],
    tags: ['tibs', 'sauteed', 'beef', 'ethiopia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Injera_with_eight_kinds_of_stew.jpg/960px-Injera_with_eight_kinds_of_stew.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Beyaynetu (Ethiopian Fasting Platter)', localName: 'Beyaynetu',
    description: 'A colourful platter of various lentil, vegetable, and chickpea stews on injera — the ultimate Ethiopian vegan feast.',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'vegan', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 30, cookTime: 60, servings: 4,
    estimatedCost: '100–250 ETB',
    ingredients: ['Misir wat (red lentils)', 'Gomen (collard greens)', 'Shiro', 'Kik alicha (split peas)', 'Tikil gomen (cabbage & carrot)', 'Beet salad', 'Injera'],
    instructions: ['Prepare each component separately:', 'Misir: cook red lentils with berbere and onion.', 'Gomen: sauté collard greens with garlic.', 'Shiro: chickpea flour stew as above.', 'Kik alicha: yellow split peas with turmeric.', 'Tikil gomen: sauté cabbage, carrot, potato.', 'Arrange all on a large injera platter.'],
    tags: ['beyaynetu', 'fasting', 'vegan', 'platter', 'ethiopia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Injera_with_eight_kinds_of_stew.jpg/960px-Injera_with_eight_kinds_of_stew.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Ethiopian Coffee Ceremony', localName: 'Buna',
    description: 'More than a drink — a cultural ritual. Beans are roasted, ground, and brewed in a jebena pot. Served three rounds.',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Nationwide',
    categories: ['beverages', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 10, cookTime: 30, servings: 6,
    estimatedCost: '30–80 ETB',
    ingredients: ['Green coffee beans (Ethiopian)', 'Water', 'Sugar (optional)', 'Frankincense or incense', 'Popcorn for serving'],
    instructions: ['Wash green coffee beans.', 'Roast beans in a flat pan, shaking until dark and fragrant.', 'Pass the aromatic beans around for guests to smell.', 'Grind roasted beans with a mortar and pestle.', 'Brew in a jebena (clay pot) with water.', 'Pour from height into small cups (sini).', 'Serve with sugar and popcorn. Repeat 3 rounds: abol, tona, baraka.'],
    tags: ['buna', 'coffee', 'ceremony', 'jebena', 'ethiopia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Injera_with_eight_kinds_of_stew.jpg/960px-Injera_with_eight_kinds_of_stew.jpg',
    isFeatured: true, rating: 4.9,
  },

  // ═══════════════════════════════════════════════════════════════
  //  KENYA 🇰🇪
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Ugali & Sukuma Wiki', localName: 'Ugali na Sukuma',
    description: 'Kenya\'s everyday meal — firm maize flour porridge with sautéed collard greens. "Sukuma wiki" means "push the week" (stretch the budget).',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 20, servings: 4,
    estimatedCost: '100–250 KES',
    ingredients: ['2 cups maize flour (unga)', 'Water', '1 bunch sukuma wiki (collard greens)', '2 tomatoes', '1 onion', 'Oil', 'Salt'],
    instructions: ['Boil water. Gradually add maize flour, stirring with a wooden spoon.', 'Stir vigorously until very thick and pulls from the pot.', 'Cook on low 5 min. Shape into a mound.', 'For sukuma: fry onion, add tomatoes, then shredded greens.', 'Cook greens 5 min. Season with salt.', 'Serve ugali with sukuma wiki.'],
    tags: ['ugali', 'sukuma-wiki', 'maize', 'kenya', 'budget'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Ugali_%26_Sukuma_Wiki.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Nyama Choma (Roast Meat)', localName: 'Nyama Choma',
    description: 'Kenya\'s beloved charcoal-grilled goat meat — a social event more than a meal. Best enjoyed with friends and cold Tusker.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Nationwide',
    categories: ['dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 10, cookTime: 60, servings: 6,
    estimatedCost: '500–1,500 KES',
    ingredients: ['2 kg goat meat (ribs or leg)', 'Salt', 'Lemon', 'Kachumbari (onion-tomato salad)', 'Ugali'],
    instructions: ['Season goat meat simply with salt.', 'Grill slowly over charcoal for 45–60 min.', 'Turn occasionally. Baste with lemon juice.', 'Meat should be smoky and tender.', 'Slice and serve with kachumbari and ugali.'],
    tags: ['nyama-choma', 'goat', 'grill', 'kenya'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg/960px-Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Githeri', localName: 'Githeri',
    description: 'Kikuyu staple of boiled maize and beans — simple, hearty, and the backbone of rural Kenyan cooking.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Central (Kikuyu)',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 60, servings: 6,
    estimatedCost: '80–200 KES',
    ingredients: ['2 cups dried maize', '1 cup dried beans', 'Potatoes (optional)', 'Onion', 'Oil', 'Salt'],
    instructions: ['Soak maize and beans overnight.', 'Boil together until tender (1 hour).', 'Optional: fry onion, add boiled githeri and potatoes.', 'Season with salt.', 'Serve hot.'],
    tags: ['githeri', 'maize', 'beans', 'kikuyu', 'kenya'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Githeri_Meal.jpg/960px-Githeri_Meal.jpg',
    isFeatured: false, rating: 4.4,
  },
  {
    name: 'Mukimo', localName: 'Mukimo',
    description: 'Kikuyu mashed potato, pumpkin leaves, corn, and beans — a vibrant green mash and festive favourite.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Central (Kikuyu)',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 30, servings: 6,
    estimatedCost: '200–400 KES',
    ingredients: ['4 potatoes', '2 cups pumpkin leaves (or spinach)', '1 cup corn kernels', '1 cup boiled beans', 'Salt'],
    instructions: ['Boil potatoes, corn, and beans until tender.', 'Boil pumpkin leaves separately. Chop.', 'Mash everything together until smooth and green.', 'Season with salt.', 'Serve with nyama choma or stew.'],
    tags: ['mukimo', 'mashed', 'kikuyu', 'kenya'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Rainbow_of_food_natural_food_colors.jpg/960px-Rainbow_of_food_natural_food_colors.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Chapati (Kenyan)', localName: 'Chapati',
    description: 'Kenyan layered flatbread — flakier and richer than Indian version. Everyone\'s favourite accompaniment.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Coast / Nationwide',
    categories: ['breakfast', 'snacks', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 20, cookTime: 20, servings: 6,
    estimatedCost: '50–100 KES',
    ingredients: ['3 cups flour', '1 cup warm water', '3 tbsp oil', '1 tsp sugar', 'Salt'],
    instructions: ['Mix flour, salt, sugar. Add warm water and oil.', 'Knead until smooth. Rest 30 min.', 'Divide into balls. Roll thin circles.', 'Brush with oil, fold, and roll again (creates layers).', 'Cook on a hot pan with oil until golden on both sides.', 'Stack and keep warm.'],
    tags: ['chapati', 'flatbread', 'kenya'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/2_Chapati_warm_and_ready_to_be_eaten.jpg/960px-2_Chapati_warm_and_ready_to_be_eaten.jpg',
    isFeatured: false, rating: 4.7,
  },
  {
    name: 'Pilau (Kenyan Spiced Rice)', localName: 'Pilau',
    description: 'Swahili spiced rice — fragrant with pilau masala, cooked in meat broth. A coastal delicacy now beloved nationwide.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Coast / Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: '300–600 KES',
    ingredients: ['3 cups basmati rice', '500 g beef', '2 onions', '2 tbsp pilau masala', 'Garlic', '2 potatoes', 'Oil', 'Beef stock', 'Salt'],
    instructions: ['Cook beef until tender. Reserve broth.', 'Fry onions in oil until very dark (caramelised).', 'Add garlic and pilau masala. Fry 2 min.', 'Add meat and potatoes. Stir.', 'Add rice and stock. Stir once.', 'Cover tight, cook on low 25 min.', 'Serve with kachumbari.'],
    tags: ['pilau', 'spiced-rice', 'swahili', 'kenya'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Afghan_Palo.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Samosa (Kenyan)', localName: 'Samosa / Sambusa',
    description: 'Crispy triangular pastries stuffed with spiced mince — Kenya\'s top street snack, influenced by Indian and Arab cuisine.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Coast / Nationwide',
    categories: ['snacks', 'street-food'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 20, servings: 12,
    estimatedCost: '100–200 KES',
    ingredients: ['2 cups flour', 'Water', 'Oil', 'Salt', '300 g minced beef', 'Onion', 'Coriander', 'Chilli', 'Cumin', 'Oil for frying'],
    instructions: ['Make dough: flour, water, oil, salt. Knead and rest.', 'Cook filling: fry mince with onion, spices, coriander.', 'Roll dough thin, cut strips.', 'Fold into cone, fill, and seal.', 'Deep fry until golden.'],
    tags: ['samosa', 'pastry', 'street-food', 'kenya'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Samosa-and-Chatni.jpg/960px-Samosa-and-Chatni.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  TANZANIA 🇹🇿
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Ugali na Nyama', localName: 'Ugali na Nyama',
    description: 'Tanzania\'s daily sustenance — stiff maize porridge with meat stew. The nation\'s favourite combination.',
    countryId: c.TZ.id, countryName: c.TZ.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 35, servings: 4,
    estimatedCost: '5,000–10,000 TZS',
    ingredients: ['2 cups maize flour', 'Water', '500 g beef', 'Tomatoes', 'Onion', 'Pilipili (chilli)', 'Oil', 'Salt'],
    instructions: ['Cook meat stew: fry onion, add beef, tomatoes, chilli, and water.', 'Simmer until meat is tender and sauce thickens.', 'For ugali: boil water, add maize flour gradually, stir hard.', 'Cook until very firm. Mould.', 'Serve ugali with meat stew.'],
    tags: ['ugali', 'nyama', 'tanzania'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Ugali_%26_Sukuma_Wiki.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Zanzibar Pilau', localName: 'Pilau ya Zanzibar',
    description: 'Zanzibar\'s aromatic spiced rice — rich with cloves, cinnamon, and cardamom from the Spice Island.',
    countryId: c.TZ.id, countryName: c.TZ.name, region: 'Zanzibar',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: '8,000–15,000 TZS',
    ingredients: ['3 cups basmati rice', '500 g beef', '3 onions', '4 cloves', '2 cinnamon sticks', '6 cardamom pods', '1 tsp cumin', 'Garlic', 'Oil', 'Salt'],
    instructions: ['Toast whole spices in oil until fragrant.', 'Fry onions until very dark brown.', 'Add garlic and meat, brown well.', 'Add water, cook meat until tender.', 'Add rice and stock. Cover tight.', 'Cook low heat 25 min. Rest 10 min.'],
    tags: ['pilau', 'zanzibar', 'spices', 'tanzania'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Afghan_Palo.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Chipsi Mayai (Chips Mayai)', localName: 'Chipsi Mayai',
    description: 'Tanzanian omelette loaded with French fries — street food fusion that became a national obsession.',
    countryId: c.TZ.id, countryName: c.TZ.name, region: 'Dar es Salaam / Nationwide',
    categories: ['street-food', 'snacks', 'quick-meals'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 10, servings: 2,
    estimatedCost: '2,000–4,000 TZS',
    ingredients: ['2 cups French fries', '4 eggs', 'Onion', 'Tomato', 'Chilli', 'Oil', 'Salt'],
    instructions: ['Fry chips until golden and crispy.', 'Beat eggs with diced onion, tomato, chilli, and salt.', 'Pour egg mixture over chips in the pan.', 'Cook until set, flip once.', 'Serve hot with chilli sauce and kachumbari.'],
    tags: ['chipsi-mayai', 'chips', 'omelette', 'street-food', 'tanzania'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Foreign_agriculture_-weekly_magazine_of_the_United_States_Department_of_Agriculture%2C_Foreign_Agricultural_Service%2C_U.S._Department_of_Agriculture_%28IA_CAT10252662567%29.pdf/page1-960px-thumbnail.pdf.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Ndizi Nyama (Plantain & Meat)', localName: 'Ndizi Nyama',
    description: 'Tanzanian green banana stew with beef — hearty, thick, and popular in the northern highlands.',
    countryId: c.TZ.id, countryName: c.TZ.name, region: 'Kilimanjaro / Arusha',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 4,
    estimatedCost: '5,000–10,000 TZS',
    ingredients: ['6 green bananas (ndizi)', '500 g beef', '2 tomatoes', '1 onion', 'Coconut milk', 'Garlic', 'Salt', 'Oil'],
    instructions: ['Peel green bananas, soak in salted water.', 'Brown beef with onions and garlic.', 'Add tomatoes, cook 10 min.', 'Add bananas and coconut milk.', 'Simmer until bananas are tender (25 min).', 'Season and serve.'],
    tags: ['ndizi-nyama', 'banana', 'stew', 'tanzania'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Matooke_to_the_market.jpg/960px-Matooke_to_the_market.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  UGANDA 🇺🇬
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Matoke (Steamed Green Banana)', localName: 'Matooke',
    description: 'Uganda\'s national dish — steamed green bananas mashed and served with peanut sauce, meat, or bean stew.',
    countryId: c.UG.id, countryName: c.UG.name, region: 'Central / Western',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 30, servings: 4,
    estimatedCost: '5,000–10,000 UGX',
    ingredients: ['8 green bananas (matooke)', 'Banana leaves for steaming', 'Salt'],
    instructions: ['Peel green bananas.', 'Wrap in banana leaves.', 'Steam in a pot for 30 min until very soft.', 'Mash inside the leaves until smooth.', 'Serve with groundnut sauce, beef stew, or beans.'],
    tags: ['matoke', 'matooke', 'banana', 'uganda'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Matooke_to_the_market.jpg/960px-Matooke_to_the_market.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Luwombo (Banana Leaf Stew)', localName: 'Luwombo',
    description: 'Royal Buganda stew — chicken, beef, or groundnut wrapped in banana leaves and slow-steamed. Uganda\'s court food.',
    countryId: c.UG.id, countryName: c.UG.name, region: 'Central (Buganda)',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 25, cookTime: 90, servings: 6,
    estimatedCost: '15,000–30,000 UGX',
    ingredients: ['Chicken pieces or beef', 'Tomatoes', 'Onions', 'Mushrooms', 'Green peppers', 'Banana leaves', 'Groundnut paste', 'Salt', 'Seasoning'],
    instructions: ['Mix meat with tomatoes, onions, mushrooms, peppers, and groundnut paste.', 'Soften banana leaves over heat.', 'Place mixture in banana leaves, wrap tightly.', 'Tie securely with banana fibre.', 'Steam in a pot for 1.5 hours.', 'Unwrap carefully. Serve with matooke or rice.'],
    tags: ['luwombo', 'banana-leaf', 'buganda', 'uganda'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Chicken_Luwombo.JPG/960px-Chicken_Luwombo.JPG',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Rolex (Rolled Eggs)', localName: 'Rolex',
    description: 'Uganda\'s iconic street food — a chapati rolled around an omelette with cabbage and tomato. "Rolled eggs" → Rolex!',
    countryId: c.UG.id, countryName: c.UG.name, region: 'Nationwide',
    categories: ['breakfast', 'street-food', 'quick-meals'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 10, servings: 1,
    estimatedCost: '1,000–3,000 UGX',
    ingredients: ['1 chapati', '2 eggs', 'Cabbage (shredded)', 'Tomato', 'Onion', 'Oil', 'Salt'],
    instructions: ['Cook chapati on a flat pan with oil.', 'Beat eggs with diced onion, cabbage, and tomato.', 'Pour egg mixture on pan, place chapati on top.', 'Flip when egg is set.', 'Roll chapati around the omelette.', 'Serve immediately — Uganda\'s best street food.'],
    tags: ['rolex', 'rolled-eggs', 'chapati', 'street-food', 'uganda'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Well_prepared_rolex_red_to_eat.jpg/960px-Well_prepared_rolex_red_to_eat.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Groundnut Sauce (Uganda)', localName: 'Ebinyebwa',
    description: 'Thick peanut sauce — the universal accompaniment in Uganda. Goes with everything from matooke to rice.',
    countryId: c.UG.id, countryName: c.UG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 20, servings: 4,
    estimatedCost: '3,000–5,000 UGX',
    ingredients: ['1 cup groundnut paste', 'Water', 'Onion', 'Tomato', 'Salt'],
    instructions: ['Dissolve groundnut paste in warm water.', 'Add diced onion and tomato.', 'Simmer on low heat 15 min, stirring often.', 'It should be thick and oily on top.', 'Serve on matooke, rice, or posho.'],
    tags: ['groundnut', 'peanut', 'sauce', 'uganda'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Binyebwa_mu_kavera.jpg/960px-Binyebwa_mu_kavera.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SOMALIA 🇸🇴
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Bariis Iskukaris (Somali Spiced Rice)', localName: 'Bariis Iskukaris',
    description: 'Somali fragrant rice with meat — spiced with cumin, cardamom, and cinnamon. Every Somali household\'s pride.',
    countryId: c.SO.id, countryName: c.SO.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: '15,000–30,000 SOS',
    ingredients: ['3 cups basmati rice', '500 g goat or lamb', '3 onions', '2 potatoes', '1 tsp cumin', '1 tsp cardamom', '1 cinnamon stick', 'Oil', 'Tomato paste', 'Salt', 'Raisins'],
    instructions: ['Cook meat with spices until tender.', 'Fry onions until golden, add tomato paste.', 'Add rice, meat broth, and potatoes.', 'Sprinkle raisins on top.', 'Cook covered on low heat until rice is fluffy.'],
    tags: ['bariis', 'iskukaris', 'rice', 'somalia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/SOMALI_FAVORITE_MAIN_FOOD.jpg/960px-SOMALI_FAVORITE_MAIN_FOOD.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Canjeero (Somali Pancake)', localName: 'Canjeero / Laxoox',
    description: 'Spongy, fermented flatbread — Somalia\'s injera-like staple. Eaten with stew, tea, or sesame oil and sugar.',
    countryId: c.SO.id, countryName: c.SO.name, region: 'Nationwide',
    categories: ['breakfast', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 120, cookTime: 15, servings: 4,
    estimatedCost: '3,000–5,000 SOS',
    ingredients: ['2 cups flour', '1/2 cup cornflour', 'Yeast or sourdough starter', 'Sugar', 'Water', 'Salt'],
    instructions: ['Mix flour, cornflour, yeast, sugar, and water into a thin batter.', 'Cover and let ferment 2–4 hours.', 'Cook on a hot non-stick pan in circular motion.', 'Cook one side only until spongy and bubbly.', 'Serve with suqaar, sesame oil, or tea.'],
    tags: ['canjeero', 'laxoox', 'pancake', 'somalia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/LahohS.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Suqaar (Somali Sautéed Meat)', localName: 'Suqaar',
    description: 'Quick-cooked diced meat with peppers and spices — Somalia\'s everyday go-to protein dish.',
    countryId: c.SO.id, countryName: c.SO.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'quick-meals'], targetAudience: ['young-professionals', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 15, servings: 2,
    estimatedCost: '10,000–20,000 SOS',
    ingredients: ['500 g beef or lamb (diced)', 'Green pepper', 'Onion', 'Garlic', 'Cumin', 'Coriander', 'Oil', 'Salt'],
    instructions: ['Heat oil, sauté onion and garlic.', 'Add diced meat. Cook on high.', 'Add peppers and spices.', 'Cook 10 min until tender.', 'Serve with canjeero, rice, or pasta.'],
    tags: ['suqaar', 'meat', 'sauteed', 'somalia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg/960px-Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Cambuulo (Adzuki Bean Dessert)', localName: 'Cambuulo',
    description: 'Somali slow-cooked adzuki beans with butter and sugar — a sweet, hearty dish often eaten at night.',
    countryId: c.SO.id, countryName: c.SO.name, region: 'Nationwide',
    categories: ['desserts', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 120, servings: 4,
    estimatedCost: '5,000–8,000 SOS',
    ingredients: ['2 cups adzuki beans', 'Butter or ghee', 'Sugar', 'Water'],
    instructions: ['Soak beans overnight.', 'Boil until very soft (2+ hours).', 'Mash slightly.', 'Mix in butter and sugar.', 'Serve warm or at room temperature.'],
    tags: ['cambuulo', 'beans', 'sweet', 'somalia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/LahohS.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  RWANDA 🇷🇼
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Isombe (Cassava Leaf Stew)', localName: 'Isombe',
    description: 'Rwanda\'s signature dish — mashed cassava leaves cooked with eggplant, spinach, and palm oil. Creamy and green.',
    countryId: c.RW.id, countryName: c.RW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 4,
    estimatedCost: '1,000–2,500 RWF',
    ingredients: ['500 g cassava leaves (ground)', 'Eggplant', 'Spinach', 'Palm oil or groundnut paste', 'Onion', 'Dried fish', 'Salt'],
    instructions: ['Boil ground cassava leaves for 30 min.', 'Add diced eggplant and spinach.', 'Add palm oil or groundnut paste for creaminess.', 'Add dried fish and onion.', 'Simmer until thick. Season.', 'Serve with ubugali (maize porridge) or rice.'],
    tags: ['isombe', 'cassava-leaves', 'rwanda'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/ISOMBE.jpg/960px-ISOMBE.jpg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Brochettes (Rwandan Meat Skewers)', localName: 'Brochettes',
    description: 'Charcoal-grilled goat meat skewers — Rwanda\'s favourite evening street food, best with a cold Primus beer.',
    countryId: c.RW.id, countryName: c.RW.name, region: 'Kigali / Nationwide',
    categories: ['dinner', 'street-food'], targetAudience: ['young-professionals', 'everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 15, servings: 4,
    estimatedCost: '2,000–5,000 RWF',
    ingredients: ['1 kg goat meat (cubed)', 'Skewers', 'Salt', 'Chilli sauce', 'Fried plantains'],
    instructions: ['Thread goat meat onto skewers.', 'Season with salt.', 'Grill over charcoal until cooked and slightly charred.', 'Serve with fried plantains and chilli sauce.'],
    tags: ['brochettes', 'skewers', 'goat', 'rwanda'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Brochettes_braise5.jpg/960px-Brochettes_braise5.jpg',
    isFeatured: true, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  BURUNDI 🇧🇮
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Beans & Plantain (Burundi Style)', localName: 'Ibiharage n\'Igitoki',
    description: 'Burundi\'s staple meal — red beans stewed and served with cooked plantain. Simple, comforting, and nutritious.',
    countryId: c.BI.id, countryName: c.BI.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 45, servings: 4,
    estimatedCost: '2,000–4,000 BIF',
    ingredients: ['2 cups red kidney beans', 'Green plantains', 'Palm oil', 'Onion', 'Salt'],
    instructions: ['Boil beans until tender.', 'Peel and boil plantains separately.', 'Fry onion in palm oil, add to beans.', 'Serve beans alongside boiled plantain.'],
    tags: ['beans', 'plantain', 'burundi'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Mega_racimos_de_guineos.jpg/960px-Mega_racimos_de_guineos.jpg',
    isFeatured: true, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ERITREA 🇪🇷
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Zigni (Eritrean Beef Stew)', localName: 'Zigni / Tsebhi',
    description: 'Eritrea\'s berbere-spiced beef stew — very similar to Ethiopian wat but with its own Eritrean identity. Served on injera.',
    countryId: c.ER.id, countryName: c.ER.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 60, servings: 4,
    estimatedCost: '150–300 ERN',
    ingredients: ['500 g beef (cubed)', '4 onions (diced)', '3 tbsp berbere', 'Tomato paste', 'Ghee or oil', 'Garlic', 'Salt', 'Injera'],
    instructions: ['Dry-fry onions (no oil) for 20 min until brown.', 'Add ghee, garlic, and berbere. Fry 5 min.', 'Add tomato paste and beef.', 'Add water and simmer 45 min until tender.', 'Serve on injera.'],
    tags: ['zigni', 'tsebhi', 'beef', 'berbere', 'eritrea'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Zigni.jpg/960px-Zigni.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Ful (Eritrean Fava Beans)', localName: 'Ful',
    description: 'Eritrean-style fava beans with cumin, tomato, and egg — a hearty breakfast favourite.',
    countryId: c.ER.id, countryName: c.ER.name, region: 'Asmara / Nationwide',
    categories: ['breakfast', 'traditional', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 2,
    estimatedCost: '30–60 ERN',
    ingredients: ['1 can fava beans', 'Tomato', 'Onion', 'Jalapeño', 'Cumin', 'Oil', 'Egg', 'Salt', 'Bread'],
    instructions: ['Warm beans in a pan.', 'Add diced tomato, onion, and pepper.', 'Season with cumin and salt.', 'Top with fried egg and drizzle of oil.', 'Serve with bread.'],
    tags: ['ful', 'fava', 'breakfast', 'eritrea'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Ful_medames_%28arabic_meal%29.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  DJIBOUTI 🇩🇯
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Skoudehkaris (Djibouti Spiced Rice)', localName: 'Skoudehkaris',
    description: 'Djibouti\'s national dish — spiced rice with lamb or goat, fragrant with cardamom and cumin.',
    countryId: c.DJ.id, countryName: c.DJ.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 45, servings: 6,
    estimatedCost: '2,000–4,000 DJF',
    ingredients: ['3 cups rice', '500 g lamb or goat', 'Onion', 'Tomato', 'Cumin', 'Cardamom', 'Oil', 'Salt'],
    instructions: ['Brown meat with onion and spices.', 'Add tomato and water. Simmer until tender.', 'Add washed rice and cook covered.', 'Serve garnished with fried onions.'],
    tags: ['skoudehkaris', 'rice', 'djibouti'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/SOMALI_FAVORITE_MAIN_FOOD.jpg/960px-SOMALI_FAVORITE_MAIN_FOOD.jpg',
    isFeatured: true, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SOUTH SUDAN 🇸🇸  &  SUDAN 🇸🇩
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Kisra (Sudanese Flatbread)', localName: 'Kisra',
    description: 'Thin, fermented sorghum crepe — Sudan and South Sudan\'s daily bread, eaten with every stew.',
    countryId: c.SD.id, countryName: c.SD.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 120, cookTime: 20, servings: 6,
    estimatedCost: '100–300 SDG',
    ingredients: ['2 cups sorghum flour', 'Water', 'Sourdough starter or yeast', 'Salt'],
    instructions: ['Mix sorghum flour with water and starter.', 'Ferment 12–24 hours.', 'Heat a flat pan (doka).', 'Pour thin layer of batter, spread in circular motion.', 'Cook one side until set. Peel off.', 'Stack and serve with meat, vegetable, or peanut stew.'],
    tags: ['kisra', 'flatbread', 'sorghum', 'sudan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Kisra_maker.jpeg/960px-Kisra_maker.jpeg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Ful Medames (Sudan)', localName: 'Ful',
    description: 'Sudan\'s breakfast of champions — slow-cooked fava beans topped with cheese, egg, oil, and bread. A cross-border favourite.',
    countryId: c.SD.id, countryName: c.SD.name, region: 'Khartoum / Nationwide',
    categories: ['breakfast', 'traditional', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '50–150 SDG',
    ingredients: ['2 cups fava beans (cooked)', 'Sesame oil', 'White cheese', 'Egg', 'Cumin', 'Lemon', 'Bread', 'Salt', 'Black pepper'],
    instructions: ['Warm beans. Mash slightly.', 'Top with crumbled cheese, fried egg.', 'Drizzle with sesame oil and lemon.', 'Season with cumin.', 'Serve with fresh bread.'],
    tags: ['ful', 'fava', 'breakfast', 'sudan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Ful_medames_%28arabic_meal%29.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Asida', localName: 'Asida',
    description: 'Thick wheat/sorghum porridge shaped into a dome — eaten by hand with stew, a staple in Sudan and South Sudan.',
    countryId: c.SD.id, countryName: c.SD.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 4,
    estimatedCost: '50–100 SDG',
    ingredients: ['2 cups wheat or sorghum flour', 'Water', 'Salt'],
    instructions: ['Boil water.', 'Add flour gradually, stirring vigorously.', 'Cook until very thick and smooth.', 'Shape into a dome on a plate.', 'Make a well in the centre, fill with stew.', 'Serve with mulah (stew).'],
    tags: ['asida', 'porridge', 'sudan', 'south-sudan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/%D8%B9%D8%B5%D9%8A%D8%AF%D8%A9-%D9%82%D8%B7%D9%8A%D9%81%D9%8A%D8%A9.jpg/960px-%D8%B9%D8%B5%D9%8A%D8%AF%D8%A9-%D9%82%D8%B7%D9%8A%D9%81%D9%8A%D8%A9.jpg',
    isFeatured: false, rating: 4.3,
  },
  {
    name: 'Walwal (South Sudan Stew)', localName: 'Walwal',
    description: 'South Sudanese thick okra stew with meat, peanut butter, and greens — hearty and common in the south.',
    countryId: c.SS.id, countryName: c.SS.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 40, servings: 4,
    estimatedCost: '5,000–10,000 SSP',
    ingredients: ['Okra (sliced)', 'Beef or goat', 'Peanut paste', 'Greens', 'Onion', 'Oil', 'Salt'],
    instructions: ['Cook meat until tender.', 'Add sliced okra and greens.', 'Dissolve peanut paste in water, add to pot.', 'Simmer 25 min until thick.', 'Serve with asida or sorghum porridge.'],
    tags: ['walwal', 'okra', 'south-sudan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Red_pepper_and_tomato_soup%2C_with_chicken%2C_wild_rice%2C_and_black_pepper_-_Massachusetts.jpg/960px-Red_pepper_and_tomato_soup%2C_with_chicken%2C_wild_rice%2C_and_black_pepper_-_Massachusetts.jpg',
    isFeatured: true, rating: 4.3,
  },
];

// ─── Seeder ────────────────────────────────────────────────────
export const seedEastAfricanFoods = async () => {
  const CODES = ['ET', 'KE', 'TZ', 'UG', 'SO', 'RW', 'BI', 'ER', 'DJ', 'SS', 'SD'];
  const countryMap = await getCountryMap(CODES);
  console.log(`  📍 Found ${Object.keys(countryMap).length} East African countries`);

  const collectionRef = db.collection(COLLECTIONS.FOODS);
  const foodsData = makeFoods(countryMap);

  // Clear existing
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

  // Update food counts
  const counts = {};
  results.forEach(f => { counts[f.countryId] = (counts[f.countryId] || 0) + 1; });
  for (const [countryId, count] of Object.entries(counts)) {
    await db.collection(COLLECTIONS.COUNTRIES).doc(countryId).update({ foodCount: count });
  }

  return results;
};

// ─── Run standalone ────────────────────────────────────────────
const isMain = process.argv[1]?.replace(/\\/g, '/').endsWith('seedEastAfricanFoods.js');
if (isMain) {
  console.log('🌍 Seeding East African foods…\n');
  seedEastAfricanFoods()
    .then(foods => {
      console.log(`\n✅ Seeded ${foods.length} East African foods!`);
      foods.forEach((f, i) => console.log(`  ${i + 1}. ${f.name} — ${f.countryName}`));
      process.exit(0);
    })
    .catch(err => { console.error('❌', err.message); process.exit(1); });
}
