/**
 * Seed Southern African foods.
 * Countries: South Africa, Zimbabwe, Mozambique, Zambia, Malawi, Botswana,
 *            Namibia, Angola, Lesotho, Eswatini, Madagascar, Mauritius,
 *            Comoros, Seychelles, São Tomé & Príncipe
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
  //  SOUTH AFRICA 🇿🇦
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Bobotie', localName: 'Bobotie',
    description: 'South Africa\'s national dish — spiced curried mince baked with an egg custard topping. Cape Malay heritage at its finest.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Western Cape / Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 45, servings: 6,
    estimatedCost: 'R80–120',
    ingredients: ['1 kg beef mince', '2 onions (chopped)', '2 slices white bread (soaked in milk)', '2 tbsp curry powder', '1 tbsp turmeric', '2 tbsp apricot jam', '2 tbsp vinegar', '1/4 cup raisins', '1/4 cup almonds', '3 eggs', '1 cup milk', 'Bay leaves', 'Salt and pepper'],
    instructions: ['Fry onions until soft. Add mince, cook through.', 'Add curry, turmeric, jam, vinegar, raisins, and almonds.', 'Squeeze milk from bread slices, add bread to meat. Mix well.', 'Transfer to baking dish. Press flat.', 'Beat eggs with milk, pour over meat as custard layer.', 'Top with bay leaves.', 'Bake at 180°C for 30 min until golden and set.', 'Serve with yellow rice, chutney, and sambals.'],
    tags: ['bobotie', 'cape-malay', 'curry', 'south-africa'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Bobotie%2C_South_African_dish.jpg/960px-Bobotie%2C_South_African_dish.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Bunny Chow', localName: 'Bunny',
    description: 'Durban\'s iconic street food — a hollowed-out bread loaf filled with fiery curry. Indian South African soul food.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'KwaZulu-Natal (Durban)',
    categories: ['lunch', 'dinner', 'street-food'], targetAudience: ['young-professionals', 'everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 50, servings: 4,
    estimatedCost: 'R50–90',
    ingredients: ['1 loaf white bread (unsliced)', '500 g chicken or mutton', '2 potatoes (cubed)', '2 onions', '3 tbsp curry powder', '1 tsp turmeric', '2 tomatoes', '1 tin chickpeas', '4 curry leaves', 'Green chillies', 'Oil', 'Salt'],
    instructions: ['Cook onions in oil. Add curry powder, turmeric, curry leaves.', 'Add meat, brown all sides. Add tomatoes.', 'Add potatoes, chickpeas, and water to cover.', 'Simmer 40 min until meat is tender and gravy thick.', 'Cut bread loaf into quarters. Hollow out each quarter.', 'Fill with curry. Top with scooped bread as a lid.', 'Eat with your hands, tearing bread and scooping curry.'],
    tags: ['bunny-chow', 'durban', 'curry', 'street-food', 'south-africa'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Quarter_Mutton_Bunny_Chow.jpg',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Braai (South African BBQ)', localName: 'Braai',
    description: 'More than a barbecue — it\'s a way of life. Boerewors, sosaties, lamb chops, and mealies over wood fire.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 20, cookTime: 30, servings: 8,
    estimatedCost: 'R150–300',
    ingredients: ['1 kg boerewors sausage', '8 lamb loin chops', '4 sosaties (marinated kebabs)', '6 mealies (corn cobs)', 'Braai salt', 'Wood or charcoal', 'Chakalaka (side)', 'Pap (side)'],
    instructions: ['Build a wood or charcoal fire. Let coals go white.', 'Season lamb chops with braai salt. Grill 4 min each side.', 'Coil boerewors on grid, grill 15 min, turning once.', 'Grill sosaties and mealies alongside.', 'Serve with pap, chakalaka, and braai broodjies (toasted sandwiches).'],
    tags: ['braai', 'bbq', 'boerewors', 'south-africa'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Pavement_braai_2.jpg/960px-Pavement_braai_2.jpg',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Biltong', localName: 'Biltong',
    description: 'Air-dried cured meat — South Africa\'s beloved snack, miles ahead of jerky. Beef, kudu, or ostrich.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Nationwide',
    categories: ['snacks', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 4320, servings: 10,
    estimatedCost: 'R100–200',
    ingredients: ['2 kg beef silverside', '1/2 cup coarse salt', '2 tbsp coriander seeds (toasted, crushed)', '1 tsp black pepper', '1/4 cup brown vinegar', '1 tbsp brown sugar', '1 tsp bicarbonate of soda'],
    instructions: ['Cut meat into long strips (2 cm thick) along the grain.', 'Mix salt, coriander, pepper, sugar, bicarb.', 'Dip strips in vinegar, then coat in spice mix.', 'Layer in a container, refrigerate 12–24 hours.', 'Pat dry, hang in a biltong box or dryer.', 'Dry for 3–5 days depending on thickness.', 'Slice thin for dry or thick for wet biltong.'],
    tags: ['biltong', 'dried-meat', 'snack', 'south-africa'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Sliced_Biltong.jpg/960px-Sliced_Biltong.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Pap en Vleis', localName: 'Pap en Vleis',
    description: 'Maize porridge with meat and tomato gravy — the everyday comfort food of South Africa.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 30, servings: 4,
    estimatedCost: 'R40–70',
    ingredients: ['2 cups maize meal (mielie meal)', '4 cups water', 'Salt', '500 g stewing beef', '2 onions', '3 tomatoes', '1 tbsp tomato paste', '2 tbsp oil', 'Seasoning'],
    instructions: ['Boil water with salt. Gradually add maize meal, stirring.', 'Cook on low heat 20 min, stirring, until stiff.', 'Fry onions in oil. Add meat, brown.', 'Add tomatoes, paste, seasoning, splash of water.', 'Simmer 25 min until meat tender and gravy thick.', 'Serve pap with meat and gravy.'],
    tags: ['pap', 'vleis', 'maize', 'south-africa'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Victoria_Daily_Times_%281900-04-28%29_%28IA_victoriadailytimes19000428%29.pdf/page1-960px-Victoria_Daily_Times_%281900-04-28%29_%28IA_victoriadailytimes19000428%29.pdf.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Chakalaka', localName: 'Chakalaka',
    description: 'Spicy vegetable relish — tomatoes, peppers, carrots, and beans. The essential braai and pap companion.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Gauteng / Nationwide',
    categories: ['snacks', 'vegetarian', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 20, servings: 6,
    estimatedCost: 'R25–40',
    ingredients: ['1 tin baked beans', '2 carrots (grated)', '2 peppers (diced)', '2 onions', '3 tomatoes', '2 green chillies', '1 tbsp curry powder', '2 tbsp oil', 'Salt'],
    instructions: ['Fry onions in oil until soft.', 'Add curry powder, chillies. Cook 2 min.', 'Add carrots, peppers. Cook 5 min.', 'Add tomatoes, cook down.', 'Add baked beans and salt. Simmer 10 min.', 'Serve warm or cold alongside braai and pap.'],
    tags: ['chakalaka', 'relish', 'vegetable', 'braai', 'south-africa'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Chakalaka.jpg/960px-Chakalaka.jpg',
    isFeatured: false, rating: 4.5,
  },
  {
    name: 'Vetkoek', localName: 'Vetkoek',
    description: 'Deep-fried bread dough — crispy outside, fluffy inside. Filled with mince or jam. Afrikaans comfort food.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Nationwide',
    categories: ['breakfast', 'street-food', 'snacks'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'easy', prepTime: 90, cookTime: 15, servings: 8,
    estimatedCost: 'R20–40',
    ingredients: ['3 cups flour', '1 sachet yeast', '1 tbsp sugar', '1 tsp salt', 'Warm water', 'Oil for frying', 'Mince or jam for filling'],
    instructions: ['Mix flour, yeast, sugar, salt. Add warm water, knead.', 'Cover, let rise 1 hour until doubled.', 'Punch down, form into balls.', 'Deep fry in hot oil until golden (5 min each side).', 'Drain on paper towel.', 'Cut open, fill with curried mince or butter and jam.'],
    tags: ['vetkoek', 'fried-bread', 'afrikaans', 'south-africa'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vetkoek_with_mince-001.jpg/960px-Vetkoek_with_mince-001.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Malva Pudding', localName: 'Malva Pudding',
    description: 'Sweet, sticky sponge pudding drenched in hot cream sauce — South Africa\'s most iconic dessert.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Nationwide',
    categories: ['desserts', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 45, servings: 8,
    estimatedCost: 'R30–50',
    ingredients: ['1 cup sugar', '2 eggs', '1 tbsp apricot jam', '1 cup flour', '1 tsp bicarb', '1 cup milk', '1 tbsp vinegar', '1 tbsp butter', 'Sauce: 1 cup cream, 1/2 cup butter, 1/2 cup sugar, 1/2 cup hot water'],
    instructions: ['Beat sugar and eggs. Add jam.', 'Sift flour and bicarb. Add alternately with milk.', 'Add vinegar and melted butter.', 'Pour into greased dish. Bake 180°C for 45 min.', 'Make sauce: heat cream, butter, sugar, water until dissolved.', 'Pour hot sauce over hot pudding immediately.', 'Serve warm with custard or ice cream.'],
    tags: ['malva', 'pudding', 'dessert', 'south-africa'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Malva_Pudding.jpg/960px-Malva_Pudding.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Koeksister', localName: 'Koeksister',
    description: 'Braided dough deep-fried and dunked in cold syrup — crunchy, dripping sweet, and addictive.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Nationwide',
    categories: ['desserts', 'snacks', 'breakfast'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 15, servings: 12,
    estimatedCost: 'R25–40',
    ingredients: ['3 cups flour', '3 tsp baking powder', '1/4 tsp salt', '1 tbsp butter', '1 egg', '3/4 cup milk', 'Syrup: 3 cups sugar, 1.5 cups water, 1 tsp cream of tartar, 1 stick cinnamon, 1 tsp ginger'],
    instructions: ['Make syrup: boil sugar, water, cream of tartar, spices. Chill overnight.', 'Mix flour, baking powder, salt. Rub in butter.', 'Add egg and milk. Knead lightly.', 'Roll out, cut strips, braid into twists.', 'Deep fry until golden (2 min each side).', 'Drop hot koeksisters straight into ice-cold syrup.', 'Remove, drain. Serve immediately for max crunch.'],
    tags: ['koeksister', 'fried', 'syrup', 'dessert', 'south-africa'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Koeksisters.jpg',
    isFeatured: false, rating: 4.6,
  },
  {
    name: 'Gatsby Sandwich', localName: 'Gatsby',
    description: 'Cape Town\'s monster sandwich — a long roll stuffed with chips, steak, masala sauce, and salad. One feeds four.',
    countryId: c.ZA.id, countryName: c.ZA.name, region: 'Western Cape',
    categories: ['street-food', 'lunch'], targetAudience: ['university-students', 'young-professionals'],
    difficulty: 'easy', prepTime: 15, cookTime: 15, servings: 4,
    estimatedCost: 'R40–70',
    ingredients: ['1 long Portuguese roll', 'Hot chips (french fries)', '300 g steak or polony', 'Atchar (mango pickle)', 'Lettuce', 'Tomato', 'Masala spice', 'Oil for frying'],
    instructions: ['Cook chips until golden and crispy.', 'Slice and fry steak strips with masala.', 'Cut roll lengthwise, leaving one side attached.', 'Layer chips, steak, atchar, lettuce, tomato.', 'Wrap in paper, cut into portions to share.'],
    tags: ['gatsby', 'sandwich', 'cape-town', 'chips', 'south-africa'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Root44_3_cropped.jpg/960px-Root44_3_cropped.jpg',
    isFeatured: false, rating: 4.7,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ZIMBABWE 🇿🇼
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Sadza ne Nyama', localName: 'Sadza ne Nyama',
    description: 'Zimbabwe\'s staple — thick maize porridge (sadza) with beef stew. Every Zimbabwean\'s daily comfort.',
    countryId: c.ZW.id, countryName: c.ZW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 30, servings: 4,
    estimatedCost: '$3–5 USD',
    ingredients: ['2 cups white maize meal', '4 cups water', 'Salt', '500 g beef stew meat', '2 tomatoes', '1 onion', '2 tbsp oil', 'Seasoning'],
    instructions: ['Boil water, add salt. Gradually stir in maize meal.', 'Stir vigorously to avoid lumps. Cook 20 min on low heat until stiff.', 'Fry onion in oil. Add meat, brown.', 'Add tomatoes and seasoning. Simmer 30 min until tender.', 'Serve sadza with meat stew and muriwo (greens).'],
    tags: ['sadza', 'maize', 'beef', 'zimbabwe'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Ugali_%26_Sukuma_Wiki.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Muboora (Pumpkin Leaves)', localName: 'Muboora',
    description: 'Shona-style pumpkin leaves cooked with peanut butter — creamy, nutritious, and deeply traditional.',
    countryId: c.ZW.id, countryName: c.ZW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'vegetarian', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '$1–2 USD',
    ingredients: ['1 large bunch pumpkin leaves', '3 tbsp peanut butter', '1 tomato', '1 onion', 'Salt', 'Water'],
    instructions: ['Wash and shred pumpkin leaves.', 'Boil in water 10 min until tender.', 'Add peanut butter, stir to dissolve.', 'Add diced tomato and onion. Season.', 'Simmer 10 min until creamy.', 'Serve with sadza.'],
    tags: ['muboora', 'pumpkin-leaves', 'peanut', 'shona', 'zimbabwe'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Tilapia_bream%2C_beans%2C_muboora_and_rice_with_peanut_butter.jpg/960px-Tilapia_bream%2C_beans%2C_muboora_and_rice_with_peanut_butter.jpg',
    isFeatured: false, rating: 4.4,
  },
  {
    name: 'Madora (Mopane Worms)', localName: 'Madora / Amacimbi',
    description: 'Sun-dried mopane worms — a protein-rich delicacy of Southern Africa. Fried crispy or simmered in tomato sauce.',
    countryId: c.ZW.id, countryName: c.ZW.name, region: 'Matabeleland / Nationwide',
    categories: ['snacks', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 15, servings: 4,
    estimatedCost: '$2–4 USD',
    ingredients: ['2 cups dried mopane worms', '2 tomatoes', '1 onion', '1 green pepper', '2 tbsp oil', 'Seasoning', 'Salt'],
    instructions: ['Soak dried worms in warm water 30 min. Drain.', 'Fry onion in oil. Add tomatoes and pepper.', 'Add worms. Season.', 'Fry until crispy or add water for saucy version.', 'Serve with sadza or as a snack.'],
    tags: ['madora', 'mopane', 'worms', 'protein', 'zimbabwe'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/One-to-one_correspondence_without_language.pdf/page1-960px-One-to-one_correspondence_without_language.pdf.jpg',
    isFeatured: false, rating: 4.2,
  },
  {
    name: 'Dovi (Peanut Butter Stew)', localName: 'Dovi',
    description: 'Zimbabwe\'s peanut butter chicken stew — creamy, rich, and served over sadza. A national favourite.',
    countryId: c.ZW.id, countryName: c.ZW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 40, servings: 6,
    estimatedCost: '$4–6 USD',
    ingredients: ['1 kg chicken pieces', '4 tbsp peanut butter', '3 tomatoes', '2 onions', 'Garlic', '2 tbsp oil', 'Salt', 'Water'],
    instructions: ['Brown chicken in oil. Remove.', 'Fry onions and garlic. Add chopped tomatoes.', 'Dissolve peanut butter in warm water. Add to pot.', 'Return chicken. Simmer 30 min until cooked through.', 'Sauce should be thick and creamy.', 'Serve over sadza with greens.'],
    tags: ['dovi', 'peanut-butter', 'chicken', 'zimbabwe'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Mafe.malien.jpg/960px-Mafe.malien.jpg',
    isFeatured: true, rating: 4.6,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MOZAMBIQUE 🇲🇿
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Piri Piri Chicken', localName: 'Galinha à Zambeziana',
    description: 'Fiery grilled chicken basted in piri piri chilli sauce with coconut and lime — Mozambique\'s gift to the world.',
    countryId: c.MZ.id, countryName: c.MZ.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'street-food'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 60, cookTime: 30, servings: 4,
    estimatedCost: '300–600 MZN',
    ingredients: ['1 whole chicken (butterflied)', '10 piri piri chillies', '4 cloves garlic', '1/2 cup coconut cream', 'Juice of 3 limes', '2 tbsp oil', '1 tbsp paprika', 'Salt'],
    instructions: ['Blend chillies, garlic, lime juice, oil, paprika, and salt.', 'Marinate chicken in half the sauce for 1–4 hours.', 'Add coconut cream to remaining sauce for basting.', 'Grill chicken over charcoal, basting frequently.', 'Cook 15 min each side until charred and juicy.', 'Serve with matapa and rice.'],
    tags: ['piri-piri', 'chicken', 'chilli', 'grilled', 'mozambique'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/African_red_devil_peppers.jpg/960px-African_red_devil_peppers.jpg',
    isFeatured: true, rating: 4.9,
  },
  {
    name: 'Matapa', localName: 'Matapa',
    description: 'Cassava leaf stew cooked in coconut milk with ground peanuts and prawns — Mozambique\'s signature dish.',
    countryId: c.MZ.id, countryName: c.MZ.name, region: 'Southern Mozambique',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 40, servings: 4,
    estimatedCost: '200–400 MZN',
    ingredients: ['500 g cassava leaves (pounded)', '1 cup coconut milk', '1/2 cup ground peanuts', '200 g prawns', '2 cloves garlic', '1 onion', 'Salt'],
    instructions: ['Pound cassava leaves until smooth (or use frozen).', 'Boil leaves in water 20 min.', 'Add coconut milk and ground peanuts. Stir.', 'Add garlic and onion. Simmer 15 min.', 'Add prawns last 5 min.', 'Serve with white rice.'],
    tags: ['matapa', 'cassava-leaf', 'coconut', 'prawns', 'mozambique'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Matapa.jpg/960px-Matapa.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Caril de Camarão', localName: 'Caril de Camarão',
    description: 'Mozambican prawn curry in coconut milk — coastal Portuguese-African fusion at its best.',
    countryId: c.MZ.id, countryName: c.MZ.name, region: 'Maputo / Coastal',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 25, servings: 4,
    estimatedCost: '400–800 MZN',
    ingredients: ['500 g large prawns', '1 can coconut milk', '2 tomatoes', '1 onion', '2 cloves garlic', '1 tbsp curry powder', '1 green chilli', 'Lime juice', 'Salt', 'Oil'],
    instructions: ['Fry onion and garlic in oil.', 'Add curry powder, cook 1 min.', 'Add tomatoes and chilli, cook 5 min.', 'Pour in coconut milk. Simmer 10 min.', 'Add prawns. Cook 5 min until pink.', 'Finish with lime juice. Serve over rice.'],
    tags: ['caril', 'prawn', 'curry', 'coconut', 'mozambique'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Matapa.jpg/960px-Matapa.jpg',
    isFeatured: false, rating: 4.7,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ZAMBIA 🇿🇲
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Nshima with Ifisashi', localName: 'Nshima ne Ifisashi',
    description: 'Zambia\'s daily staple — thick maize porridge (nshima) with peanut-sauced greens (ifisashi).',
    countryId: c.ZM.id, countryName: c.ZM.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly', 'vegetarian'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 25, servings: 4,
    estimatedCost: '30–60 ZMW',
    ingredients: ['2 cups mealie meal', 'Water', '1 bunch rape or pumpkin leaves', '3 tbsp peanut powder', '1 tomato', '1 onion', 'Salt'],
    instructions: ['Boil water, gradually add mealie meal stirring constantly.', 'Cook 15 min until very thick and pulls from sides.', 'For ifisashi: boil greens until tender.', 'Add peanut powder, tomato, onion. Stir.', 'Simmer 10 min until creamy.', 'Shape nshima into balls. Serve with ifisashi.'],
    tags: ['nshima', 'ifisashi', 'peanut', 'maize', 'zambia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Nshima_and_mice.JPG/960px-Nshima_and_mice.JPG',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Chikanda (African Polony)', localName: 'Chikanda',
    description: 'Zambian meatless "polony" made from wild orchid tubers and peanuts — a unique vegetarian delicacy.',
    countryId: c.ZM.id, countryName: c.ZM.name, region: 'Northern Zambia / Nationwide',
    categories: ['snacks', 'vegetarian', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 60, servings: 8,
    estimatedCost: '40–80 ZMW',
    ingredients: ['2 cups chikanda tuber powder (orchid)', '1 cup peanut powder', '1 tsp chilli powder', '1 tsp bicarbonate of soda', 'Water', 'Salt'],
    instructions: ['Mix chikanda powder with water to a paste.', 'Dissolve peanut powder in water separately.', 'Combine both, add chilli, bicarb, and salt.', 'Pour into a greased tin.', 'Steam or bake at 180°C for 1 hour.', 'Cool, slice like polony. Serve cold or warm.'],
    tags: ['chikanda', 'orchid', 'vegetarian', 'zambia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Chikanda2.jpg/960px-Chikanda2.jpg',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MALAWI 🇲🇼
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Nsima with Chambo', localName: 'Nsima ndi Chambo',
    description: 'Malawi\'s pride — nsima (maize porridge) with grilled chambo fish from Lake Malawi. Nation\'s favourite meal.',
    countryId: c.MW.id, countryName: c.MW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 30, servings: 4,
    estimatedCost: '3,000–6,000 MWK',
    ingredients: ['2 cups maize flour', 'Water', '2 whole chambo fish (tilapia)', 'Salt', 'Lemon', '2 tomatoes', '1 onion', 'Oil'],
    instructions: ['Make nsima: boil water, add maize flour, stir 20 min.', 'Season fish with salt and lemon. Score the sides.', 'Grill over charcoal until cooked through.', 'Make relish: fry onion, add tomatoes. Season.', 'Serve nsima with grilled chambo and tomato relish.'],
    tags: ['nsima', 'chambo', 'fish', 'lake-malawi', 'malawi'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Nshima_and_mice.JPG/960px-Nshima_and_mice.JPG',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Kondowole (Cassava Nsima)', localName: 'Kondowole',
    description: 'Cassava-based nsima unique to Northern Malawi — stretchy, slightly tangy, and paired with fish.',
    countryId: c.MW.id, countryName: c.MW.name, region: 'Northern Region',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: '1,000–2,000 MWK',
    ingredients: ['2 cups cassava flour', 'Water', 'Salt'],
    instructions: ['Boil water. Gradually add cassava flour.', 'Stir vigorously to avoid lumps.', 'Cook on low heat 15 min until elastic and pulls from pot.', 'Shape with wet hands into balls.', 'Serve with ndiwo (relish), fish, or beans.'],
    tags: ['kondowole', 'cassava', 'nsima', 'malawi'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Nshima_and_mice.JPG/960px-Nshima_and_mice.JPG',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  BOTSWANA 🇧🇼
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Seswaa', localName: 'Seswaa',
    description: 'Botswana\'s national dish — slow-boiled beef pounded until shredded. Incredibly tender and served with bogobe (porridge).',
    countryId: c.BW.id, countryName: c.BW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 180, servings: 8,
    estimatedCost: '50–100 BWP',
    ingredients: ['2 kg beef (with bones)', 'Water', 'Salt'],
    instructions: ['Place beef in a large pot. Cover with water.', 'Boil on medium heat for 3+ hours until falling apart.', 'Remove bones. Use forks or wooden spoons to pound/shred.', 'Add salt and some reserved broth.', 'Serve with bogobe (sorghum porridge) or pap.'],
    tags: ['seswaa', 'shredded-beef', 'botswana'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Seswaa.jpg/960px-Seswaa.jpg',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Bogobe (Sorghum Porridge)', localName: 'Bogobe jwa Lerotse',
    description: 'Traditional Tswana sorghum porridge cooked with melon — a staple accompaniment to seswaa.',
    countryId: c.BW.id, countryName: c.BW.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 30, servings: 4,
    estimatedCost: '15–30 BWP',
    ingredients: ['2 cups sorghum meal', '1 lerotse melon (or butternut)', '4 cups water', 'Salt', 'Sour milk (optional)'],
    instructions: ['Peel and dice melon. Boil until soft.', 'Mash the melon in the pot.', 'Gradually add sorghum meal, stirring constantly.', 'Cook 20 min on low heat until thick.', 'Serve with sour milk or alongside seswaa.'],
    tags: ['bogobe', 'sorghum', 'porridge', 'botswana'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Porridge.jpg/960px-Porridge.jpg',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  NAMIBIA 🇳🇦
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Kapana (Street Meat)', localName: 'Kapana',
    description: 'Namibian street BBQ — freshly cut beef grilled on open drums and served with chilli salt and salsa.',
    countryId: c.NA.id, countryName: c.NA.name, region: 'Windhoek / Nationwide',
    categories: ['street-food', 'snacks', 'dinner'], targetAudience: ['university-students', 'young-professionals', 'everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 10, servings: 2,
    estimatedCost: 'N$20–50',
    ingredients: ['500 g beef (fresh cut)', 'Chilli salt', 'Tomato and onion salsa', 'Braai spice'],
    instructions: ['Cut beef into thin strips.', 'Season with braai spice.', 'Grill on high heat on drum braai until charred edges.', 'Chop into bite-size pieces on cutting board.', 'Serve on paper with chilli salt and fresh salsa.'],
    tags: ['kapana', 'street-meat', 'bbq', 'namibia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Kapana_Namibia.JPG/960px-Kapana_Namibia.JPG',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Oshifima with Omagungu', localName: 'Oshifima',
    description: 'Namibian pearl millet porridge — the staple of the Owambo people, served with stews or dried spinach.',
    countryId: c.NA.id, countryName: c.NA.name, region: 'Northern Namibia (Owambo)',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 20, servings: 4,
    estimatedCost: 'N$10–25',
    ingredients: ['2 cups pearl millet flour (mahangu)', 'Water', 'Salt'],
    instructions: ['Boil water, add salt.', 'Gradually add millet flour stirring continuously.', 'Cook 15 min on low, stirring until very stiff.', 'Shape into a mound with wet wooden spoon.', 'Serve with omagungu (dried spinach) or meat stew.'],
    tags: ['oshifima', 'millet', 'owambo', 'namibia'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Pap_and_spinach.jpg/960px-Pap_and_spinach.jpg',
    isFeatured: false, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  ANGOLA 🇦🇴
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Muamba de Galinha', localName: 'Muamba de Galinha',
    description: 'Angola\'s national dish — chicken stew in palm oil with okra, squash, and garlic. Rich and hearty.',
    countryId: c.AO.id, countryName: c.AO.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 50, servings: 6,
    estimatedCost: '3,000–6,000 AOA',
    ingredients: ['1 whole chicken (pieces)', '1/2 cup palm oil', '6 okra', '1 butternut squash (cubed)', '4 cloves garlic', '2 onions', '3 tomatoes', 'Chilli', 'Salt', 'Lemon juice'],
    instructions: ['Season chicken with garlic, lemon, salt. Marinate 30 min.', 'Fry chicken in palm oil until browned.', 'Add onions and tomatoes. Cook 10 min.', 'Add squash and water. Simmer 25 min.', 'Add okra last 10 min.', 'Serve with funge (cassava porridge) or rice.'],
    tags: ['muamba', 'chicken', 'palm-oil', 'angola'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Poulet_%C3%A0_la_moambe.JPG/960px-Poulet_%C3%A0_la_moambe.JPG',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Funge', localName: 'Funge / Funje',
    description: 'Angolan cassava flour porridge — smooth, stretchy, and essential alongside any stew.',
    countryId: c.AO.id, countryName: c.AO.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 15, servings: 4,
    estimatedCost: '500–1,000 AOA',
    ingredients: ['2 cups cassava flour', 'Water', 'Salt'],
    instructions: ['Boil water with salt.', 'Slowly add cassava flour stirring vigorously.', 'Keep stirring 10 min on low heat until thick and smooth.', 'Shape with wet spoon.', 'Serve alongside muamba, calulu, or any stew.'],
    tags: ['funge', 'cassava', 'porridge', 'angola'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Moamba_traditional_dish_in_Luanda.JPG/960px-Moamba_traditional_dish_in_Luanda.JPG',
    isFeatured: false, rating: 4.3,
  },
  {
    name: 'Calulu de Peixe', localName: 'Calulu',
    description: 'Angolan dried fish and vegetable stew with okra, tomatoes, and palm oil — coastal comfort food.',
    countryId: c.AO.id, countryName: c.AO.name, region: 'Luanda / Coastal',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 20, cookTime: 40, servings: 6,
    estimatedCost: '2,000–4,000 AOA',
    ingredients: ['500 g dried fish', '200 g fresh fish', '6 okra', '3 tomatoes', '2 onions', '1/2 cup palm oil', 'Sweet potato leaves', 'Garlic', 'Chilli', 'Salt'],
    instructions: ['Soak dried fish 2 hours, shred.', 'Fry onions and garlic in palm oil.', 'Add tomatoes and chilli. Cook 10 min.', 'Add dried fish, fresh fish, and okra.', 'Add sweet potato leaves and water.', 'Simmer 30 min. Serve with funge or rice.'],
    tags: ['calulu', 'fish', 'dried-fish', 'okra', 'angola'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Calulu.jpg/960px-Calulu.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  LESOTHO 🇱🇸 & ESWATINI 🇸🇿
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Papa (Lesotho Porridge)', localName: 'Papa le Moroho',
    description: 'Lesotho\'s staple — stiff maize porridge served with wild spinach (moroho). Simple, filling, and nutritious.',
    countryId: c.LS.id, countryName: c.LS.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'budget-friendly', 'vegetarian'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 20, servings: 4,
    estimatedCost: 'M10–20',
    ingredients: ['2 cups maize meal', 'Water', 'Wild spinach (moroho)', 'Oil', 'Onion', 'Tomato', 'Salt'],
    instructions: ['Boil water, add maize meal gradually stirring.', 'Cook 20 min until stiff.', 'Separately, fry onion, add tomato and spinach.', 'Cook greens until wilted. Season.', 'Serve papa with moroho on the side.'],
    tags: ['papa', 'moroho', 'maize', 'lesotho'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/960px-Patates.jpg',
    isFeatured: true, rating: 4.4,
  },
  {
    name: 'Sishwala', localName: 'Sishwala',
    description: 'Eswatini thick sour porridge made from fermented mealie meal — tangy and traditionally served with stew.',
    countryId: c.SZ.id, countryName: c.SZ.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 5, cookTime: 20, servings: 4,
    estimatedCost: 'E10–20',
    ingredients: ['2 cups fermented mealie meal', 'Water', 'Salt'],
    instructions: ['Ferment mealie meal with water for 1–2 days.', 'Cook fermented mixture stirring constantly.', 'Add more meal to thicken if needed.', 'Cook until stiff and slightly sour.', 'Serve with meat stew or vegetables.'],
    tags: ['sishwala', 'porridge', 'fermented', 'eswatini'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Porridge.jpg/960px-Porridge.jpg',
    isFeatured: true, rating: 4.3,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MADAGASCAR 🇲🇬
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Romazava', localName: 'Romazava',
    description: 'Madagascar\'s national dish — beef and leafy green stew with garlic, ginger, and tomatoes. Served with rice, always.',
    countryId: c.MG.id, countryName: c.MG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 15, cookTime: 40, servings: 4,
    estimatedCost: '10,000–20,000 MGA',
    ingredients: ['500 g beef (cubed)', '2 bunches brèdes (leafy greens)', '3 tomatoes', '1 onion', '3 cloves garlic', 'Ginger', 'Salt', 'Oil'],
    instructions: ['Brown beef in oil. Add onion, garlic, ginger.', 'Add tomatoes. Cook 5 min.', 'Add water. Simmer 30 min until beef tender.', 'Add mixed greens last 5 min.', 'Serve over white rice (vary amin\'anana).'],
    tags: ['romazava', 'beef', 'greens', 'madagascar'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Madagaskar_stew_2019-10-01.jpg/960px-Madagaskar_stew_2019-10-01.jpg',
    isFeatured: true, rating: 4.6,
  },
  {
    name: 'Ravitoto', localName: 'Ravitoto sy Henakisoa',
    description: 'Pounded cassava leaves with pork — Madagascar\'s other great dish. Tender greens and rich pork fat.',
    countryId: c.MG.id, countryName: c.MG.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 30, cookTime: 60, servings: 6,
    estimatedCost: '15,000–25,000 MGA',
    ingredients: ['500 g cassava leaves (pounded)', '500 g pork (with fat)', '2 tomatoes', '1 onion', 'Garlic', 'Ginger', 'Salt', 'Oil'],
    instructions: ['Pound cassava leaves until very fine (or use frozen).', 'Boil leaves 30 min to remove bitterness.', 'Fry pork pieces until golden.', 'Add onion, garlic, ginger, tomatoes.', 'Add the cassava leaves. Simmer 30 min.', 'Serve with rice and rougail (tomato chutney).'],
    tags: ['ravitoto', 'cassava-leaves', 'pork', 'madagascar'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Ravitoto.jpg/960px-Ravitoto.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  MAURITIUS 🇲🇺
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Dholl Puri', localName: 'Dholl Puri',
    description: 'Mauritian street food legend — thin flatbread stuffed with ground yellow split peas, served with curry and rougaille.',
    countryId: c.MU.id, countryName: c.MU.name, region: 'Nationwide',
    categories: ['breakfast', 'lunch', 'street-food', 'budget-friendly'], targetAudience: ['university-students', 'everyone'],
    difficulty: 'medium', prepTime: 40, cookTime: 20, servings: 8,
    estimatedCost: 'Rs 20–40',
    ingredients: ['2 cups flour', '1 cup yellow split peas (cooked and ground)', '1 tsp turmeric', 'Oil', 'Salt', 'Water', 'Bean curry and rougaille for serving'],
    instructions: ['Cook split peas until soft. Drain and grind.', 'Make dough with flour, turmeric, oil, salt, water.', 'Rest 30 min. Divide into balls.', 'Flatten each ball, place ground peas inside, fold and re-roll thin.', 'Cook on flat griddle (tawa) with oil until spotty brown.', 'Fill with bean curry, rougaille, and chutney. Fold.'],
    tags: ['dholl-puri', 'flatbread', 'split-peas', 'mauritius'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Puri_%285580433295%29.jpg/960px-Puri_%285580433295%29.jpg',
    isFeatured: true, rating: 4.8,
  },
  {
    name: 'Rougaille (Tomato Creole)', localName: 'Rougaille',
    description: 'Mauritian tomato-based Creole sauce — the backbone of Mauritian cuisine, served with rice and everything else.',
    countryId: c.MU.id, countryName: c.MU.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: 'Rs 50–100',
    ingredients: ['4 tomatoes', '1 onion', '3 cloves garlic', 'Thyme', '2 green chillies', 'Ginger', 'Salt', 'Oil', '500 g fish or sausage'],
    instructions: ['Fry onion, garlic, ginger in oil.', 'Add diced tomatoes and thyme. Cook 10 min.', 'Add chillies and protein of choice.', 'Simmer until sauce is thick and flavourful.', 'Serve over rice with lentil dal and pickles.'],
    tags: ['rougaille', 'tomato', 'creole', 'mauritius'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Mauritius_food_in_november_2023.jpg/960px-Mauritius_food_in_november_2023.jpg',
    isFeatured: false, rating: 4.5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  COMOROS 🇰🇲 & SEYCHELLES 🇸🇨
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Langouste à la Vanille', localName: 'Langouste Vanille',
    description: 'Comorian lobster in vanilla sauce — an island delicacy combining Indian Ocean seafood with local vanilla.',
    countryId: c.KM.id, countryName: c.KM.name, region: 'Grande Comore',
    categories: ['dinner', 'traditional', 'festive'], targetAudience: ['everyone'],
    difficulty: 'medium', prepTime: 15, cookTime: 20, servings: 2,
    estimatedCost: '10,000–20,000 KMF',
    ingredients: ['2 lobster tails', '1 vanilla pod', '1/2 cup coconut cream', '1 shallot', '2 tbsp butter', 'Lime juice', 'Salt and pepper'],
    instructions: ['Split lobster tails. Season with lime, salt, pepper.', 'Grill lobster 5 min each side.', 'Melt butter. Sauté shallot. Scrape vanilla seeds into pan.', 'Add coconut cream. Simmer 5 min.', 'Pour vanilla coconut sauce over lobster.', 'Serve with rice and green salad.'],
    tags: ['langouste', 'vanilla', 'lobster', 'comoros'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/California_spiny_lobster.JPG/960px-California_spiny_lobster.JPG',
    isFeatured: true, rating: 4.7,
  },
  {
    name: 'Kat Kat Banane', localName: 'Kat Kat',
    description: 'Seychellois green banana curry in coconut milk — Creole comfort food from the Indian Ocean.',
    countryId: c.SC.id, countryName: c.SC.name, region: 'Nationwide',
    categories: ['lunch', 'dinner', 'traditional', 'vegetarian'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 25, servings: 4,
    estimatedCost: 'Sr 50–100',
    ingredients: ['6 green bananas (plantain-like)', '1 can coconut milk', '1 onion', '2 cloves garlic', 'Ginger', '1 tsp turmeric', 'Cinnamon stick', 'Salt'],
    instructions: ['Peel and slice bananas.', 'Fry onion, garlic, ginger.', 'Add turmeric and cinnamon.', 'Add coconut milk and bananas.', 'Simmer 20 min until bananas are tender.', 'Serve with rice or grilled fish.'],
    tags: ['kat-kat', 'banana', 'coconut', 'seychelles'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Matooke_to_the_market.jpg/960px-Matooke_to_the_market.jpg',
    isFeatured: true, rating: 4.5,
  },
  {
    name: 'Ladob (Sweet Banana)', localName: 'Ladob',
    description: 'Seychellois banana and sweet potato dessert cooked in coconut milk with nutmeg and vanilla.',
    countryId: c.SC.id, countryName: c.SC.name, region: 'Nationwide',
    categories: ['desserts', 'traditional'], targetAudience: ['everyone'],
    difficulty: 'easy', prepTime: 10, cookTime: 20, servings: 4,
    estimatedCost: 'Sr 30–60',
    ingredients: ['4 ripe bananas', '2 sweet potatoes (cubed)', '1 can coconut milk', '1/2 cup sugar', '1 tsp nutmeg', '1 vanilla pod', 'Pinch of salt'],
    instructions: ['Peel and halve bananas. Peel and cube sweet potatoes.', 'Bring coconut milk to simmer with sugar and vanilla.', 'Add sweet potatoes first, cook 10 min.', 'Add bananas, cook 5 more min.', 'Sprinkle nutmeg. Serve warm or cold.'],
    tags: ['ladob', 'banana', 'coconut', 'dessert', 'seychelles'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Matooke_to_the_market.jpg/960px-Matooke_to_the_market.jpg',
    isFeatured: false, rating: 4.4,
  },
];

// ─── Seeder ────────────────────────────────────────────────────
export const seedSouthernAfricanFoods = async () => {
  const codes = ['ZA', 'ZW', 'MZ', 'ZM', 'MW', 'BW', 'NA', 'AO', 'LS', 'SZ', 'MG', 'MU', 'KM', 'SC'];
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

  // Update food counts
  const counts = {};
  results.forEach(f => { counts[f.countryId] = (counts[f.countryId] || 0) + 1; });
  for (const [countryId, count] of Object.entries(counts)) {
    await db.collection(COLLECTIONS.COUNTRIES).doc(countryId).update({ foodCount: count });
  }

  return results;
};

const isMain = process.argv[1]?.replace(/\\/g, '/').endsWith('seedSouthernAfricanFoods.js');
if (isMain) {
  console.log('🌍 Seeding Southern African foods…\n');
  seedSouthernAfricanFoods()
    .then(foods => {
      console.log(`\n✅ Seeded ${foods.length} Southern African foods!`);
      foods.forEach((f, i) => console.log(`  ${i + 1}. ${f.name} — ${f.countryName}`));
      process.exit(0);
    })
    .catch(err => { console.error('❌', err.message); process.exit(1); });
}
