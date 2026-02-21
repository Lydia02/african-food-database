/**
 * Seed African Street Foods.
 * Popular grab-and-go foods sold at roadsides, markets, and stalls
 * across all African regions.
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

const makeStreetFoods = (c) => [

  // ═══════════════════════════════════════════════════════════════
  //  NIGERIA 🇳🇬 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Suya', localName: 'Tsire',
    description: 'Nigeria\'s king of street food — thinly sliced beef rubbed with ground peanut spice mix (yaji), skewered and charcoal-grilled. Served with sliced onions, tomatoes, and cabbage.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'dinner'], targetAudience: ['university-students', 'young-professionals', 'everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 15, servings: 4,
    estimatedCost: '₦500–2,000',
    ingredients: ['500 g beef (sirloin or tozo)', '4 tbsp suya spice (yaji)', '2 tbsp groundnut oil', 'Onion rings', 'Tomato slices', 'Cabbage', 'Newspaper for wrapping'],
    instructions: ['Slice beef very thin against the grain.', 'Coat generously with suya spice and oil. Marinate 1 hr.', 'Thread onto wooden skewers.', 'Grill over hot charcoal, turning frequently (10–15 min).', 'Sprinkle more yaji spice while hot.', 'Serve on newspaper with sliced onions, tomatoes, cabbage.'],
    tags: ['suya', 'grilled-meat', 'yaji', 'street-food', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Puff Puff', localName: 'Puff Puff',
    description: 'Deep-fried dough balls — golden, pillowy, and lightly sweetened. Nigeria\'s most popular street snack, found at every corner.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'desserts', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 60, cookTime: 15, servings: 6,
    estimatedCost: '₦100–500',
    ingredients: ['3 cups flour', '1/2 cup sugar', '1 tsp yeast', 'Warm water', 'Pinch of salt', 'Nutmeg (optional)', 'Oil for deep frying'],
    instructions: ['Mix flour, sugar, salt, yeast, nutmeg.', 'Add warm water gradually. Mix to thick batter.', 'Cover and rise 1–2 hours until doubled.', 'Heat oil to 170°C. Scoop balls of batter into oil.', 'Fry until golden brown all over (3–4 min).', 'Drain on paper towels. Serve warm.'],
    tags: ['puff-puff', 'doughnut', 'fried', 'street-food', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/960px-Puff-puff3.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Roasted Corn', localName: 'Agbado',
    description: 'Fresh corn on the cob roasted over charcoal until slightly charred and smoky. Often paired with roasted coconut or pear (ube).',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 1,
    estimatedCost: '₦100–300',
    ingredients: ['Fresh corn on the cob (in husk)', 'Charcoal fire'],
    instructions: ['Pull back husk partially. Remove silk.', 'Place directly on hot charcoal.', 'Turn every 2–3 minutes.', 'Roast until kernels are charred and smoky (10–15 min).', 'Eat straight off the cob. Pair with ube (African pear) if in season.'],
    tags: ['roasted-corn', 'agbado', 'street-food', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Roasted_corn.jpg/960px-Roasted_corn.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Bole (Roasted Plantain)', localName: 'Boli',
    description: 'Ripe plantain roasted whole over charcoal until caramelised and smoky. Served with roasted groundnuts or pepper sauce. Port Harcourt signature.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Rivers / Nationwide',
    categories: ['street-food', 'snacks', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 2,
    estimatedCost: '₦200–500',
    ingredients: ['4 ripe plantains', 'Groundnuts (roasted)', 'Pepper sauce: scotch bonnet, palm oil, onion', 'Charcoal fire'],
    instructions: ['Place whole unpeeled ripe plantains on charcoal grill.', 'Turn every 3–4 min until skin is blackened and flesh soft.', 'Peel. Serve with roasted groundnuts.', 'Or serve with spicy palm oil pepper sauce.'],
    tags: ['bole', 'boli', 'roasted-plantain', 'street-food', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Baked_plantain.jpg/960px-Baked_plantain.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Kilishi', localName: 'Kilishi',
    description: 'Nigerian beef jerky — sun-dried spiced beef sheets, thin as paper. Hausa specialty often called Africa\'s biltong.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'North (Hausa)',
    categories: ['street-food', 'snacks'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 60, cookTime: 360, servings: 8,
    estimatedCost: '₦2,000–5,000',
    ingredients: ['1 kg beef (lean, boneless)', 'Groundnut paste', 'Suya spice mix', 'Ginger', 'Garlic', 'Onion', 'Scotch bonnet', 'Salt', 'Seasoning'],
    instructions: ['Slice beef paper-thin. Sun-dry on wire mesh for 4–6 hours.', 'Make paste: groundnut paste, spices, ginger, garlic, pepper.', 'Coat dried beef sheets with the paste.', 'Sun-dry again for 2–3 hours.', 'Roast briefly over charcoal fire.', 'Store in airtight container. Lasts weeks.'],
    tags: ['kilishi', 'jerky', 'dried-meat', 'street-food', 'hausa', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Kilishi_in_a_Packaging.jpg/960px-Kilishi_in_a_Packaging.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Akara (Bean Cakes)', localName: 'Àkàrà',
    description: 'Deep-fried spiced black-eyed pea fritters — crispy outside, fluffy inside. The original West African falafel.',
    countryId: c.NG.id, countryName: c.NG.name, region: 'Nationwide',
    categories: ['street-food', 'breakfast', 'snacks', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 15, servings: 4,
    estimatedCost: '₦200–500',
    ingredients: ['2 cups black-eyed peas (peeled)', '1 onion', '1–2 scotch bonnet peppers', 'Salt', 'Oil for deep frying'],
    instructions: ['Soak and peel beans.', 'Blend with onion and pepper — no water.', 'Beat with wooden spoon until airy and fluffy.', 'Season with salt.', 'Drop spoonfuls into hot oil (170°C).', 'Fry until deep golden (3–4 min per side).', 'Drain. Serve hot with bread or pap.'],
    tags: ['akara', 'bean-cake', 'fried', 'street-food', 'nigerian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Beans_Ball-Akara.jpg',
    isFeatured: true, rating: 4.7,
  },

  // ═══════════════════════════════════════════════════════════════
  //  GHANA 🇬🇭 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Kelewele', localName: 'Kelewele',
    description: 'Spiced fried plantain cubes — ripe plantain tossed with ginger, chilli, and spices then deep-fried. Ghana\'s favourite sweet-spicy street snack.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['street-food', 'snacks'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 10, servings: 4,
    estimatedCost: 'GH₵3–8',
    ingredients: ['4 ripe plantains', '1 tbsp grated ginger', '1 tsp cayenne pepper', '1/2 tsp anise', '1/2 tsp cinnamon', 'Salt', 'Oil for frying'],
    instructions: ['Peel and dice plantain into cubes.', 'Mix ginger, cayenne, anise, cinnamon, salt.', 'Toss plantain cubes in spice mix. Rest 10 min.', 'Deep fry in batches until caramelised and crispy.', 'Drain. Serve with roasted peanuts.'],
    tags: ['kelewele', 'plantain', 'spiced', 'street-food', 'ghanaian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Kelewele.jpg/960px-Kelewele.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Bofrot (Ghanaian Doughnut)', localName: 'Bofrot',
    description: 'Pillowy fried dough balls, sweeter and denser than puff puff. Ghana\'s beloved afternoon street snack.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'desserts', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 90, cookTime: 15, servings: 8,
    estimatedCost: 'GH₵2–5',
    ingredients: ['4 cups flour', '3/4 cup sugar', '2 tsp yeast', '1/4 tsp nutmeg', 'Warm water', 'Oil for frying'],
    instructions: ['Mix dry ingredients. Add warm water to form soft dough.', 'Knead 5 min. Cover and rise 1.5 hours.', 'Shape into balls.', 'Deep fry in oil until golden brownish-red (4 min).', 'Roll in sugar if desired.', 'Serve warm.'],
    tags: ['bofrot', 'doughnut', 'fried', 'street-food', 'ghanaian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/960px-Puff-puff3.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Chinchinga (Ghanaian Kebab)', localName: 'Chinchinga',
    description: 'Spiced meat skewers grilled over charcoal — Ghana\'s answer to suya. Served with shito pepper and onions.',
    countryId: c.GH.id, countryName: c.GH.name, region: 'Nationwide',
    categories: ['street-food', 'dinner', 'snacks'], targetAudience: ['university-students', 'young-professionals', 'everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 15, servings: 4,
    estimatedCost: 'GH₵5–15',
    ingredients: ['500 g beef (cubed)', 'Suya/kebab spice', 'Ginger', 'Garlic', 'Onion', 'Groundnut oil', 'Wooden skewers'],
    instructions: ['Cube beef. Marinate in spice, ginger, garlic, oil for 1 hr.', 'Thread onto skewers.', 'Grill over charcoal, turning and basting.', 'Sprinkle extra spice while grilling.', 'Serve with shito, sliced onion, and bread.'],
    tags: ['chinchinga', 'kebab', 'grilled', 'street-food', 'ghanaian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SENEGAL 🇸🇳 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Fataya (Senegalese Meat Pie)', localName: 'Fataya',
    description: 'Crispy half-moon pastry stuffed with spiced fish or meat. Senegal\'s street food staple sold at every corner.',
    countryId: c.SN.id, countryName: c.SN.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'lunch'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 40, cookTime: 15, servings: 8,
    estimatedCost: '200–500 XOF',
    ingredients: ['Dough: 3 cups flour, water, oil, salt', 'Filling: 300 g fish or beef, onion, parsley, garlic, lemon, mustard, pepper, oil'],
    instructions: ['Make dough. Knead and rest 30 min.', 'Filling: flake cooked fish. Mix with fried onion, parsley, garlic, lemon, mustard.', 'Roll dough thin. Cut circles.', 'Fill, fold into half-moons, seal edges with fork.', 'Deep fry until golden and crispy.', 'Serve hot with chilli sauce.'],
    tags: ['fataya', 'meat-pie', 'pastry', 'street-food', 'senegalese'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Fataya.jpg/960px-Fataya.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Dibi (Grilled Lamb)', localName: 'Dibi',
    description: 'Charcoal-grilled marinated lamb, sliced and served with mustard-onion sauce on paper. Senegal\'s favourite late-night street food.',
    countryId: c.SN.id, countryName: c.SN.name, region: 'Dakar / Nationwide',
    categories: ['street-food', 'dinner'], targetAudience: ['young-professionals', 'everyone'],
    difficulty: 'medium', prepTime: 60, cookTime: 20, servings: 4,
    estimatedCost: '1,500–3,000 XOF',
    ingredients: ['1 kg lamb (ribs or leg)', 'Mustard', 'Lemon juice', 'Onion', 'Garlic', 'Black pepper', 'Maggi cube', 'Oil'],
    instructions: ['Marinate lamb in mustard, lemon, garlic, pepper for 1 hr.', 'Grill over very hot charcoal, turning regularly.', 'Slice onions into rings. Mix with mustard and lemon.', 'Slice grilled lamb into pieces.', 'Serve on paper with onion-mustard sauce and bread.'],
    tags: ['dibi', 'grilled-lamb', 'street-food', 'senegalese'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Thieboudienne.JPG/960px-Thieboudienne.JPG',
    isFeatured: false, rating: 4.7,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CÔTE D'IVOIRE 🇨🇮 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Alloco (Fried Plantain)', localName: 'Alloco',
    description: 'Ripe plantain sliced and deep-fried until golden, served with chilli-onion-tomato sauce. Côte d\'Ivoire\'s signature street snack.',
    countryId: c.CI.id, countryName: c.CI.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 10, servings: 4,
    estimatedCost: '500–1,000 XOF',
    ingredients: ['4 ripe plantains', 'Oil for frying', 'Sauce: 2 onions, 3 tomatoes, scotch bonnet, vinegar, salt'],
    instructions: ['Peel and slice plantains diagonally.', 'Deep fry in hot oil until golden caramelised.', 'Make sauce: dice onion, tomato, chilli. Mix with vinegar.', 'Drain alloco. Serve hot with onion-chilli sauce.', 'Optionally serve with grilled fish or boiled egg.'],
    tags: ['alloco', 'fried-plantain', 'street-food', 'ivorian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Atti%C3%A9k%C3%A9-poissons.jpg/960px-Atti%C3%A9k%C3%A9-poissons.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Garba', localName: 'Garba',
    description: 'Attiéké (cassava couscous) with deep-fried tuna, chilli, and onions. Named after a famous Abidjan street vendor.',
    countryId: c.CI.id, countryName: c.CI.name, region: 'Abidjan / Nationwide',
    categories: ['street-food', 'lunch', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 10, servings: 2,
    estimatedCost: '500–1,500 XOF',
    ingredients: ['2 cups attiéké', 'Fried tuna steaks', 'Onion rings', 'Scotch bonnet pepper', 'Maggi cube', 'Oil'],
    instructions: ['Steam or fluff attiéké.', 'Season tuna and fry until crispy.', 'Slice onion thinly. Dice pepper.', 'Serve attiéké with crumbled fried tuna on top.', 'Garnish with onion rings and pepper.'],
    tags: ['garba', 'attieke', 'tuna', 'street-food', 'ivorian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Atti%C3%A9k%C3%A9-poissons.jpg/960px-Atti%C3%A9k%C3%A9-poissons.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CAMEROON 🇨🇲 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Soya (Cameroonian Suya)', localName: 'Soya',
    description: 'Spiced beef skewers grilled over charcoal — Cameroon\'s most popular street food. Spicier than Nigerian suya.',
    countryId: c.CM.id, countryName: c.CM.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'dinner'], targetAudience: ['university-students', 'young-professionals', 'everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 15, servings: 4,
    estimatedCost: '500–2,000 XAF',
    ingredients: ['500 g beef (cubed)', 'White pepper', 'Garlic', 'Ginger', 'Cubeb pepper', 'Salt', 'Maggi', 'Groundnut oil', 'Wooden skewers'],
    instructions: ['Cube beef. Season with white pepper, garlic, ginger, cubeb pepper.', 'Marinate for 30 min.', 'Thread onto skewers.', 'Grill over charcoal, basting with oil.', 'Serve with raw onion, pepper, and baguette.'],
    tags: ['soya', 'skewers', 'grilled-meat', 'street-food', 'cameroonian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Puff Puff (Cameroonian)', localName: 'Gateau',
    description: 'Cameroonian puff puff — fried dough balls often flavoured with nutmeg, sold in little plastic bags at roadside stalls.',
    countryId: c.CM.id, countryName: c.CM.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'desserts', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 60, cookTime: 15, servings: 6,
    estimatedCost: '200–500 XAF',
    ingredients: ['3 cups flour', '1/2 cup sugar', '1 tsp yeast', 'Nutmeg', 'Warm water', 'Oil for frying'],
    instructions: ['Mix flour, sugar, yeast, nutmeg.', 'Add warm water. Mix to thick batter.', 'Cover and rise 1 hr.', 'Fry spoonfuls in hot oil until golden.', 'Drain. Serve in bags.'],
    tags: ['puff-puff', 'gateau', 'street-food', 'cameroonian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/960px-Puff-puff3.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  KENYA 🇰🇪 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Mutura (Kenyan Sausage)', localName: 'Mutura',
    description: 'African blood sausage — intestine casing stuffed with spiced mince, blood, and herbs then roasted over charcoal. Kenya\'s grillmaster snack.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Central Kenya / Nationwide',
    categories: ['street-food', 'snacks'], targetAudience: ['everyone'],
    difficulty: 'hard', prepTime: 60, cookTime: 30, servings: 6,
    estimatedCost: 'KSh 50–200',
    ingredients: ['Goat intestines (cleaned)', '500 g minced meat', 'Blood', 'Garlic', 'Ginger', 'Coriander', 'Chilli', 'Salt'],
    instructions: ['Clean intestines thoroughly. Turn inside out, scrub, rinse.', 'Mix mince, blood, garlic, ginger, coriander, chilli, salt.', 'Stuff mixture into intestines. Tie ends.', 'Smoke or boil first, then grill over charcoal until crispy.', 'Slice into rounds.', 'Serve with kachumbari (tomato-onion salsa).'],
    tags: ['mutura', 'sausage', 'grilled', 'street-food', 'kenyan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Ugali_%26_Sukuma_Wiki.jpg/960px-Ugali_%26_Sukuma_Wiki.jpg',
    isFeatured: false, rating: 4.4,
  },
  {
    name: 'Mahindi Choma (Roasted Corn)', localName: 'Mahindi Choma',
    description: 'Fresh maize cob roasted over charcoal and rubbed with chilli-lime salt. Kenya\'s favourite roadside snack.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 1,
    estimatedCost: 'KSh 20–50',
    ingredients: ['Fresh corn on the cob', 'Lime or lemon', 'Chilli powder', 'Salt'],
    instructions: ['Place corn directly on hot charcoal.', 'Turn every 2 min until charred all around.', 'Squeeze lime over the corn.', 'Sprinkle with chilli and salt.', 'Eat immediately.'],
    tags: ['mahindi', 'roasted-corn', 'street-food', 'kenyan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Roasted_corn.jpg/960px-Roasted_corn.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Samosa (Kenyan)', localName: 'Sambusa',
    description: 'Crispy triangular pastry stuffed with spiced minced meat or vegetables. East Africa\'s ultimate tea-time street snack.',
    countryId: c.KE.id, countryName: c.KE.name, region: 'Nationwide',
    categories: ['street-food', 'snacks'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 40, cookTime: 15, servings: 12,
    estimatedCost: 'KSh 20–50 each',
    ingredients: ['Wrappers: 2 cups flour, water, oil, salt', 'Filling: 300 g minced beef, onion, garlic, cilantro, cumin, chilli, peas, salt'],
    instructions: ['Make thin pastry. Cut into strips.', 'Brown mince with onion, garlic, spices, peas.', 'Form pastry into cone. Fill with mince.', 'Seal with flour-paste.', 'Deep fry until golden and crispy.', 'Serve with tamarind chutney.'],
    tags: ['samosa', 'sambusa', 'pastry', 'street-food', 'kenyan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Samosa_1.jpg/960px-Samosa_1.jpg',
    isFeatured: true, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ETHIOPIA 🇪🇹 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Sambusa (Ethiopian)', localName: 'Sambusa',
    description: 'Ethiopian triangular pastry filled with spiced lentils or meat. Crispy, flaky, and perfect for on-the-go eating.',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Nationwide',
    categories: ['street-food', 'snacks'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 40, cookTime: 15, servings: 12,
    estimatedCost: '10–30 ETB each',
    ingredients: ['Pastry: 2 cups flour, water, oil, salt', 'Filling: 2 cups cooked lentils, onion, garlic, berbere, turmeric, salt'],
    instructions: ['Make thin pastry sheets. Cut into strips.', 'Cook lentil filling with spices.', 'Shape triangles, fill, seal edges.', 'Deep fry until crispy golden.', 'Serve hot.'],
    tags: ['sambusa', 'pastry', 'lentil', 'street-food', 'ethiopian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Samosa_1.jpg/960px-Samosa_1.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Kolo (Roasted Barley)', localName: 'Kolo',
    description: 'Dry-roasted barley, chickpeas, and peanuts seasoned with salt — Ethiopia\'s ancient grab-and-munch snack.',
    countryId: c.ET.id, countryName: c.ET.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 4,
    estimatedCost: '10–30 ETB',
    ingredients: ['2 cups barley', '1/2 cup chickpeas', '1/2 cup peanuts', 'Salt', 'Sunflower seeds (optional)'],
    instructions: ['Dry-roast barley in a pan over medium heat, stirring constantly.', 'Roast until golden and fragrant (8–10 min).', 'Separately roast chickpeas and peanuts.', 'Mix all together. Season with salt.', 'Serve in paper cones or cups.'],
    tags: ['kolo', 'roasted-barley', 'snack', 'street-food', 'ethiopian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Taita_fit-fit.jpg/960px-Taita_fit-fit.jpg',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  TANZANIA 🇹🇿 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Mishkaki', localName: 'Mishkaki',
    description: 'Marinated beef skewers grilled over charcoal — Tanzania\'s beloved street barbecue. Swahili-spiced perfection.',
    countryId: c.TZ.id, countryName: c.TZ.name, region: 'Dar es Salaam / Nationwide',
    categories: ['street-food', 'dinner', 'snacks'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 60, cookTime: 15, servings: 4,
    estimatedCost: 'TZS 1,000–3,000',
    ingredients: ['500 g beef (cubed)', 'Lemon juice', 'Garlic', 'Ginger', 'Cumin', 'Coriander', 'Chilli', 'Oil', 'Salt'],
    instructions: ['Cube beef. Marinate in lemon, garlic, ginger, cumin, coriander, chilli, oil.', 'Rest 1 hour minimum.', 'Thread onto skewers.', 'Grill over charcoal, basting with marinade.', 'Serve with chilli sauce and naan or chips.'],
    tags: ['mishkaki', 'skewers', 'grilled', 'street-food', 'tanzanian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Chipsi Mayai (Chips Omelette)', localName: 'Chipsi Mayai',
    description: 'French fries baked into an egg omelette — Tanzania\'s cheap, filling street food. The original chips-and-eggs.',
    countryId: c.TZ.id, countryName: c.TZ.name, region: 'Nationwide',
    categories: ['street-food', 'lunch', 'budget-friendly', 'quick-meals'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 15, servings: 2,
    estimatedCost: 'TZS 2,000–4,000',
    ingredients: ['2 cups French fries (fresh or pre-cooked)', '4 eggs', '1 onion (diced)', '1 tomato (diced)', 'Salt', 'Oil'],
    instructions: ['Fry chips until golden. Drain.', 'Beat eggs with onion, tomato, salt.', 'Place chips in oiled pan. Pour egg mixture over.', 'Cook on medium heat until bottom is set.', 'Flip and cook other side (or finish under grill).', 'Cut into wedges and serve with kachumbari.'],
    tags: ['chipsi-mayai', 'chips-omelette', 'street-food', 'tanzanian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Zanzibari_pizza_Chips_Mayai.jpg/960px-Zanzibari_pizza_Chips_Mayai.jpg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Zanzibar Pizza', localName: 'Zanzibar Pizza',
    description: 'Thin dough folded around meat, egg, cheese, onion, and chilli — a Zanzibari night market classic. Not Italian pizza at all.',
    countryId: c.TZ.id, countryName: c.TZ.name, region: 'Zanzibar',
    categories: ['street-food', 'dinner', 'snacks'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 10, servings: 2,
    estimatedCost: 'TZS 3,000–5,000',
    ingredients: ['Thin dough (flour, water, oil)', '200 g minced meat', '2 eggs', 'Cheese', 'Onion', 'Green pepper', 'Chilli', 'Oil'],
    instructions: ['Roll dough paper-thin on oiled surface.', 'Spread minced meat, crack eggs, add cheese, onion, pepper.', 'Fold dough edges over filling like an envelope.', 'Fry on oiled flat griddle until golden each side.', 'Cut into squares. Serve with chilli sauce.'],
    tags: ['zanzibar-pizza', 'street-food', 'tanzanian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Zanzibari_pizza_Chips_Mayai.jpg/960px-Zanzibari_pizza_Chips_Mayai.jpg',
    isFeatured: false, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  UGANDA 🇺🇬 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Rolex (Chapati Egg Roll)', localName: 'Rolex',
    description: 'Uganda\'s most famous street food — a chapati wrapped around fried egg omelette with vegetables. "Rolled Egg" = Rolex.',
    countryId: c.UG.id, countryName: c.UG.name, region: 'Nationwide',
    categories: ['street-food', 'breakfast', 'quick-meals', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 10, servings: 1,
    estimatedCost: 'UGX 1,500–3,000',
    ingredients: ['1 chapati', '2 eggs', '1 tomato', '1/2 onion', 'Cabbage', 'Salt', 'Oil'],
    instructions: ['Beat eggs with salt.', 'Make omelette in pan with onion, tomato, cabbage.', 'Place warm chapati on top of omelette while still in pan.', 'Flip. Roll tightly.', 'Wrap in paper and serve.'],
    tags: ['rolex', 'chapati', 'egg-roll', 'street-food', 'ugandan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Well_prepared_rolex_red_to_eat.jpg/960px-Well_prepared_rolex_red_to_eat.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Kikomando', localName: 'Kikomando',
    description: 'Chopped chapati pieces mixed with beans sauce — the cheapest and most beloved student street food in Uganda.',
    countryId: c.UG.id, countryName: c.UG.name, region: 'Kampala / Nationwide',
    categories: ['street-food', 'lunch', 'budget-friendly'], targetAudience: ['university-students'],
    difficulty: 'easy', prepTime: 5, cookTime: 0, servings: 1,
    estimatedCost: 'UGX 1,000–2,000',
    ingredients: ['2 chapatis', 'Bean stew or sauce', 'Chilli sauce (optional)'],
    instructions: ['Cut chapati into bite-sized pieces.', 'Pour hot bean stew over chapati pieces.', 'Mix together.', 'Add chilli sauce to taste.', 'Eat straight from the plate.'],
    tags: ['kikomando', 'chapati', 'beans', 'street-food', 'ugandan', 'student'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/2_Chapati_warm_and_ready_to_be_eaten.jpg/960px-2_Chapati_warm_and_ready_to_be_eaten.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  SOUTH AFRICA 🇿🇦 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Bunny Chow', localName: 'Bunny Chow',
    description: 'Hollowed-out bread loaf filled with curry — born in Durban\'s Indian community. South Africa\'s iconic street food.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'KwaZulu-Natal / Nationwide',
    categories: ['street-food', 'lunch', 'dinner'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 4,
    estimatedCost: 'R30–60',
    ingredients: ['1 loaf white bread (unsliced)', '500 g mutton or chicken', '2 potatoes (cubed)', '1 onion', '3 tbsp curry powder', '2 tomatoes', 'Ginger', 'Garlic', 'Curry leaves', 'Oil', 'Salt'],
    instructions: ['Cook curry: fry onion, add curry powder, ginger, garlic.', 'Add meat. Brown all over.', 'Add tomatoes, potatoes, water. Simmer 30 min.', 'Cut bread loaf in half or quarter.', 'Hollow out the centres.', 'Fill with curry. Replace bread "lid".', 'Eat with your hands, tearing bread and scooping curry.'],
    tags: ['bunny-chow', 'curry', 'bread', 'street-food', 'south-african'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bunny_chow.jpg/960px-Bunny_chow.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Gatsby', localName: 'Gatsby',
    description: 'Massive sub roll stuffed with hot chips, fried polony, atchar, and masala steak — Cape Town\'s legendary sharing sandwich.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Cape Town / Western Cape',
    categories: ['street-food', 'lunch'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 15, servings: 4,
    estimatedCost: 'R40–80',
    ingredients: ['1 long bread roll (60cm+)', 'Hot chips (French fries)', 'Fried polony or Vienna sausages', 'Masala steak strips', 'Atchar (pickle)', 'Lettuce', 'Vinegar', 'Salt'],
    instructions: ['Fry chips and protein of choice.', 'Split bread roll lengthwise.', 'Layer chips, polony/steak, atchar, lettuce.', 'Sprinkle with vinegar.', 'Close and wrap in paper.', 'Cut into sharing portions. Share with mates.'],
    tags: ['gatsby', 'sandwich', 'chips', 'street-food', 'south-african', 'cape-town'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bunny_chow.jpg/960px-Bunny_chow.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Vetkoek', localName: 'Vetkoek',
    description: 'Deep-fried bread dough — crispy outside, fluffy inside. Eaten with mince, syrup, jam, or cheese. South Africa\'s doughnut.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'breakfast'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 90, cookTime: 20, servings: 8,
    estimatedCost: 'R15–30',
    ingredients: ['3 cups flour', '1 sachet yeast', '1 tbsp sugar', '1 tsp salt', 'Warm water', 'Oil for frying'],
    instructions: ['Mix flour, yeast, sugar, salt.', 'Add warm water to form soft dough.', 'Knead 5 min. Rise 1 hour.', 'Shape into balls. Deep fry until golden (3–4 min per side).', 'Drain on paper. Split open.', 'Fill with curried mince, jam, or syrup.'],
    tags: ['vetkoek', 'fried-bread', 'street-food', 'south-african'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vetkoek_with_mince-001.jpg/960px-Vetkoek_with_mince-001.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  EGYPT 🇪🇬 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Taamiya (Egyptian Falafel)', localName: 'Ta\'amiya',
    description: 'Egyptian falafel made from fava beans (not chickpeas). Crispy outside, bright green inside. Cairo\'s breakfast king.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['street-food', 'breakfast', 'vegetarian', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 15, servings: 6,
    estimatedCost: '5–15 EGP',
    ingredients: ['2 cups dried fava beans (soaked overnight)', 'Parsley', 'Dill', 'Cilantro', 'Leek', 'Garlic', 'Cumin', 'Coriander', 'Sesame seeds', 'Baking powder', 'Oil for frying'],
    instructions: ['Blend soaked fava beans with herbs, garlic, spices — do not cook first.', 'Add baking powder. Mix.', 'Shape into flat patties. Coat in sesame seeds.', 'Deep fry until deep golden and crispy (3 min).', 'Serve in baladi bread with tahini, pickles, and salad.'],
    tags: ['taamiya', 'falafel', 'fava', 'street-food', 'egyptian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Falafel_balls.jpg/960px-Falafel_balls.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Koshari', localName: 'Koshari',
    description: 'Egypt\'s national street food — rice, lentils, pasta, chickpeas topped with spicy tomato sauce and crispy fried onions. Carb overload heaven.',
    countryId: c.EG.id, countryName: c.EG.name, region: 'Nationwide',
    categories: ['street-food', 'lunch', 'vegetarian', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 30, servings: 6,
    estimatedCost: '10–25 EGP',
    ingredients: ['1 cup rice', '1 cup brown lentils', '1 cup elbow macaroni', '1 cup chickpeas (cooked)', '3 onions (sliced for frying)', 'Tomato sauce: 4 tomatoes, garlic, vinegar, chilli', 'Oil', 'Salt'],
    instructions: ['Cook rice, lentils, and pasta separately.', 'Make tomato-vinegar-chilli sauce.', 'Fry onion rings until dark and crispy.', 'Layer in bowl: rice, lentils, pasta, chickpeas.', 'Top with tomato sauce.', 'Crown with crispy fried onions.', 'Add vinegar-garlic dakkah sauce.'],
    tags: ['koshari', 'rice', 'lentils', 'pasta', 'street-food', 'egyptian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Koshary2.JPG/960px-Koshary2.JPG',
    isFeatured: true, rating: 4.8,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MOROCCO 🇲🇦 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Sfenj (Moroccan Doughnut)', localName: 'Sfenj',
    description: 'Ring-shaped fried dough — lighter and chewier than Western doughnuts. Dipped in sugar or honey with mint tea.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['street-food', 'breakfast', 'snacks', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 60, cookTime: 15, servings: 8,
    estimatedCost: '1–3 MAD each',
    ingredients: ['3 cups flour', '1 tsp yeast', '1 tsp sugar', '1/2 tsp salt', 'Warm water', 'Oil for frying', 'Sugar or honey for dusting'],
    instructions: ['Mix flour, yeast, sugar, salt. Add warm water.', 'Knead into very soft sticky dough. Rest 1 hour.', 'Oil hands. Pull off dough portions.', 'Stretch into ring shapes.', 'Fry rings in hot oil until golden (2 min per side).', 'Drain. Dust with sugar or drizzle honey.'],
    tags: ['sfenj', 'doughnut', 'street-food', 'moroccan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sfenj.jpg/960px-Sfenj.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Merguez', localName: 'Merguez',
    description: 'Spicy lamb sausage with harissa — grilled until bursting and served in a baguette. North Africa\'s sausage king.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['street-food', 'dinner', 'snacks'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 10, servings: 4,
    estimatedCost: '10–25 MAD',
    ingredients: ['500 g merguez sausages', 'Baguette', 'Harissa', 'Lettuce', 'Tomato', 'Onion'],
    instructions: ['Grill merguez over charcoal or pan-fry until cooked and slightly charred.', 'Split baguette. Add lettuce, tomato, onion.', 'Place sausages inside.', 'Drizzle with harissa sauce.', 'Serve immediately.'],
    tags: ['merguez', 'sausage', 'harissa', 'street-food', 'moroccan', 'north-african'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Merguez_2.jpg/960px-Merguez_2.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Maakouda (Potato Fritters)', localName: 'Maakouda',
    description: 'Crispy fried potato patties stuffed in bread — Morocco\'s budget-king street snack. Cheap and filling.',
    countryId: c.MA.id, countryName: c.MA.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 20, cookTime: 10, servings: 6,
    estimatedCost: '3–8 MAD',
    ingredients: ['4 potatoes (boiled, mashed)', '2 eggs', 'Parsley', 'Cumin', 'Salt', 'Pepper', 'Oil for frying'],
    instructions: ['Mash boiled potatoes. Add eggs, parsley, cumin, salt.', 'Mix well. Shape into flat patties.', 'Deep fry until golden brown each side.', 'Serve in bread with harissa and olives.'],
    tags: ['maakouda', 'potato', 'fritters', 'street-food', 'moroccan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sfenj.jpg/960px-Sfenj.jpg',
    isFeatured: false, rating: 4.4,
  },

  // ═══════════════════════════════════════════════════════════════
  //  DRC CONGO 🇨🇩 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Makala (Congolese Doughnut)', localName: 'Makala',
    description: 'Congolese fried dough — denser and more fragrant than puff puff. Sold in bags at markets across Kinshasa.',
    countryId: c.CD.id, countryName: c.CD.name, region: 'Kinshasa / Nationwide',
    categories: ['street-food', 'snacks', 'desserts', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 60, cookTime: 15, servings: 8,
    estimatedCost: '500–1,000 CDF',
    ingredients: ['3 cups flour', '1/2 cup sugar', '1 tsp yeast', '1 ripe banana (mashed)', 'Vanilla', 'Warm water', 'Oil for frying'],
    instructions: ['Mix flour, sugar, yeast, vanilla, mashed banana.', 'Add warm water to form thick batter.', 'Cover and rise 1 hour.', 'Drop spoonfuls into hot oil.', 'Fry until golden.', 'Drain and serve in paper bags.'],
    tags: ['makala', 'doughnut', 'street-food', 'congolese'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/960px-Puff-puff3.jpg',
    isFeatured: false, rating: 4.4,
  },
  {
    name: 'Brochettes (Congolese Kebab)', localName: 'Brochettes',
    description: 'Charcoal-grilled goat meat skewers — a DRC staple at bars, parties, and roadsides across Kinshasa.',
    countryId: c.CD.id, countryName: c.CD.name, region: 'Nationwide',
    categories: ['street-food', 'dinner', 'snacks'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 30, cookTime: 15, servings: 4,
    estimatedCost: '2,000–5,000 CDF',
    ingredients: ['500 g goat or beef (cubed)', 'Lemon juice', 'Garlic', 'Ginger', 'Chilli', 'Salt', 'Oil', 'Skewers'],
    instructions: ['Cube meat. Marinate in lemon, garlic, ginger, chilli, salt.', 'Thread onto skewers.', 'Grill over charcoal until cooked and charred.', 'Serve with chilli sauce and cold beer.'],
    tags: ['brochettes', 'kebab', 'goat', 'street-food', 'congolese'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  RWANDA 🇷🇼 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Brochettes (Rwandan)', localName: 'Brochettes',
    description: 'Charcoal-grilled goat meat skewers — Rwanda\'s social food, served at every bar and gathering across Kigali.',
    countryId: c.RW.id, countryName: c.RW.name, region: 'Kigali / Nationwide',
    categories: ['street-food', 'dinner'], targetAudience: ['young-professionals', 'everyone'],
    difficulty: 'easy', prepTime: 30, cookTime: 15, servings: 4,
    estimatedCost: '500–1,500 RWF',
    ingredients: ['500 g goat meat (cubed)', 'Salt', 'Pepper', 'Onion', 'Skewers'],
    instructions: ['Cube goat meat. Season with salt and pepper.', 'Thread onto wooden skewers.', 'Grill over charcoal, turning regularly.', 'Serve with fried plantain, chips, or salad.'],
    tags: ['brochettes', 'goat', 'grilled', 'street-food', 'rwandan'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MOZAMBIQUE 🇲🇿 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Piri Piri Prawns', localName: 'Camarão Piri Piri',
    description: 'Giant prawns marinated in fiery piri piri chilli sauce and grilled. Mozambique\'s most famous street food export.',
    countryId: c.MZ.id, countryName: c.MZ.name, region: 'Maputo / Coastal',
    categories: ['street-food', 'dinner'], targetAudience: ['young-professionals', 'everyone'],
    difficulty: 'easy', prepTime: 30, cookTime: 10, servings: 4,
    estimatedCost: '300–800 MZN',
    ingredients: ['1 kg large prawns (shell on)', 'Piri piri sauce: 10 bird\'s eye chillies, garlic, lemon, paprika, olive oil, vinegar', 'Lemon wedges'],
    instructions: ['Blend chillies, garlic, lemon juice, paprika, oil, vinegar into piri piri sauce.', 'Marinate prawns in sauce for 30 min.', 'Grill over very hot charcoal 3 min per side.', 'Squeeze lemon over.', 'Serve with rice or bread and cold 2M beer.'],
    tags: ['piri-piri', 'prawns', 'grilled', 'street-food', 'mozambican'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Matapa.jpg/960px-Matapa.jpg',
    isFeatured: true, rating: 4.8,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ZIMBABWE 🇿🇼 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Maputi (Popcorn)', localName: 'Maputi',
    description: 'Zimbabwe\'s street popcorn — popped in huge pots over open fire, salted, and sold in recycled plastic bags. Cheap joy.',
    countryId: c.ZW.id, countryName: c.ZW.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 5, servings: 4,
    estimatedCost: '$0.25–0.50 USD',
    ingredients: ['1 cup popcorn kernels', '3 tbsp oil', 'Salt'],
    instructions: ['Heat oil in large covered pot.', 'Add kernels. Cover. Shake occasionally.', 'Remove from heat when popping slows.', 'Salt generously.', 'Pack into bags.'],
    tags: ['maputi', 'popcorn', 'street-food', 'zimbabwean'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Sadza_and_Sausage.jpg/960px-Sadza_and_Sausage.jpg',
    isFeatured: false, rating: 4.2,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ZAMBIA 🇿🇲 — STREET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Vitumbuwa (Zambian Fritters)', localName: 'Vitumbuwa',
    description: 'Sweet banana fritters — mashed banana mixed into dough and deep-fried. Zambia\'s sweet street treat.',
    countryId: c.ZM.id, countryName: c.ZM.name, region: 'Nationwide',
    categories: ['street-food', 'snacks', 'desserts', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 10, servings: 6,
    estimatedCost: '5–15 ZMW',
    ingredients: ['2 ripe bananas (mashed)', '2 cups flour', '1/2 cup sugar', '1 tsp yeast', 'Warm water', 'Oil for frying'],
    instructions: ['Mash bananas. Mix with flour, sugar, yeast.', 'Add warm water to form thick batter.', 'Rest 30 min.', 'Fry spoonfuls in hot oil until golden.', 'Drain. Serve warm.'],
    tags: ['vitumbuwa', 'fritters', 'banana', 'street-food', 'zambian'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/960px-Puff-puff3.jpg',
    isFeatured: false, rating: 4.4,
  },
];

// ─── Seeder ────────────────────────────────────────────────────
export const seedStreetFood = async () => {
  const codes = ['NG', 'GH', 'SN', 'CI', 'CM', 'KE', 'ET', 'TZ', 'UG', 'ZA', 'EG', 'MA', 'CD', 'RW', 'MZ', 'ZW', 'ZM'];
  const c = await getCountryMap(codes);
  console.log(`  📍 Found ${Object.keys(c).length} countries`);

  const collectionRef = db.collection(COLLECTIONS.FOODS);
  const foodsData = makeStreetFoods(c);

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

const isMain = process.argv[1]?.replace(/\\/g, '/').endsWith('seedStreetFood.js');
if (isMain) {
  console.log('🍢 Seeding African Street Foods…\n');
  seedStreetFood()
    .then(foods => {
      console.log(`\n✅ Seeded ${foods.length} street foods!`);
      foods.forEach((f, i) => console.log(`  ${i + 1}. ${f.name} — ${f.countryName}`));
      process.exit(0);
    })
    .catch(err => { console.error('❌', err.message); process.exit(1); });
}
