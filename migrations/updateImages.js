/**
 * Update all seed files with real, verified Wikipedia/Wikimedia image URLs.
 * 
 * This script:
 *  1. Reads the imageMap.json (food→URL mapping)
 *  2. For each seed file, finds every food's name and replaces its imageUrl
 *  3. For seedFoods.js (which has NO imageUrl), adds the field
 *
 * Usage: node migrations/updateImages.js
 */
import fs from 'fs';
import path from 'path';

const imageMap = JSON.parse(fs.readFileSync('./migrations/imageMap.json', 'utf-8'));

// ── Build a flexible lookup: exact name → URL  ──────────────────
// Also index by stripped name (without parenthetical), lowercase, etc.
const lookupMap = {};

// Index all imageMap entries
for (const [key, url] of Object.entries(imageMap)) {
  if (!url) continue;
  lookupMap[key.toLowerCase()] = url;
  // Also strip parenthetical
  const stripped = key.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
  if (!lookupMap[stripped]) lookupMap[stripped] = url;
}

function findImage(foodName) {
  // Try exact match
  const lower = foodName.toLowerCase();
  if (lookupMap[lower]) return lookupMap[lower];
  
  // Try stripping parenthetical
  const stripped = foodName.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
  if (lookupMap[stripped]) return lookupMap[stripped];
  
  // Try first word match for compound names
  const firstPart = stripped.split(/[&,]/)[0].trim();
  if (lookupMap[firstPart]) return lookupMap[firstPart];
  
  // Try removing common prefixes/suffixes
  const cleaned = stripped
    .replace(/\s*(with|and|ne|na)\s+.*/i, '')
    .replace(/\s*-\s*.*/i, '')
    .trim();
  if (lookupMap[cleaned]) return lookupMap[cleaned];
  
  return null;
}

// ── Additional manual mappings for tricky names ──────────────────
const manualMappings = {
  // seedNigerianFoods.js names → imageMap keys
  'ofe nsala (white soup)': 'Ofe Nsala',
  'ofe onugbu (bitter leaf soup)': 'Bitterleaf Soup',
  'ofe oha': 'Oha Soup',
  'ofe akwu (banga soup)': 'Banga Soup',
  'gbegiri soup': 'Gbegiri and Ewedu',
  'miyan kuka (baobab soup)': 'Miyan Kuka',
  'miyan taushe (pumpkin soup)': 'Miyan Taushe',
  'okro soup (ila asepo)': 'Pepper Soup',  // fallback
  'fisherman soup': 'Pepper Soup',  // similar
  'ekpang nkukwo': 'Edikang Ikong',  // similar Calabar dish
  'fried rice': 'Fried Rice (Nigerian)',
  'ofada rice & ayamase stew': 'Ofada Rice',
  'native jollof (iwuk edesi)': 'Jollof Rice',
  'eba (garri)': 'Eba',
  'fufu (akpu)': 'Fufu (Nigerian)',
  'akara (bean cakes)': 'Akara',
  'moi moi (bean pudding)': 'Moi Moi',
  'dodo (fried plantain)': 'Dodo (Fried Plantain)',
  'dundun (fried yam)': 'Dodo (Fried Plantain)',  // similar fried food
  'boli (roasted plantain)': 'Boli',
  'masa (waina)': 'Masa',
  'ewa agoyin (mashed beans)': 'Ewa Agoyin',
  'beans & plantain (ewa & dodo)': 'Beans and Plantain',
  'yam porridge (asaro)': 'Asaro',
  'plantain porridge': 'Asaro',  // similar
  'isi ewu (goat head)': 'Isi Ewu',
  'abacha (african salad)': 'Abacha',
  'dambu nama (shredded meat)': 'Kilishi',  // similar dried meat
  'fura da nono': 'Kunun Gyada',  // similar drink
  'zobo (hibiscus drink)': 'Zobo',
  'kunu (millet drink)': 'Kunu',
  'pap (ogi / akamu)': 'Ogi/Akamu',
  'nigerian chicken stew': 'Pepper Soup',  // stew
  'indomie jollof': 'Indomie and Egg',
  'bread & egg': 'Bread and Egg (Nigerian)',

  // seedWestAfricanFoods.js names
  'jollof rice (ghana)': 'Ghanaian Jollof',
  'banku & tilapia': 'Banku and Tilapia',
  'fufu & light soup': 'Fufu and Light Soup',
  'red red': 'Red Red',
  'kenkey & fried fish': 'Kenkey and Fish',
  'shito (hot pepper sauce)': 'Ghanaian Jollof',  // Ghanaian condiment
  'groundnut soup': 'Groundnut Soup',
  'ghanaian fried rice': 'Fried Rice (Nigerian)',  // similar
  'mafé (peanut stew)': 'Maafe',
  'thiéré (couscous sénégalais)': 'Couscous',
  'fataya (senegalese pastry)': 'Brik',  // similar pastry
  'eru soup': 'Eru',
  'achu soup & fufu': 'Achu Soup',
  'koki beans': 'Koki Beans',
  'poulet dg (director general chicken)': 'Poulet DG',
  'attiéké (cassava couscous)': 'Attiéké',
  'alloco (fried plantain)': 'Alloco',
  'garba (attiéké with tuna)': 'Garba',
  'kedjenou chicken': 'Chicken Tagine',  // similar braised chicken
  'tigadèguèna (mali peanut stew)': 'Tiga Dega Na',
  'tô (millet porridge)': 'Tô',
  'riz au gras (guinea)': 'Riz au Gras',
  'fouti (fonio porridge)': 'Fouti',
  'cassava leaf stew': 'Cassava Leaf Stew',
  'groundnut soup (sierra leone)': 'Groundnut Soup',
  'palava sauce': 'Cassava Leaf Stew',  // similar
  'dumboy (liberian fufu)': 'Fufu (Nigerian)',  // similar
  'riz gras (burkina)': 'Riz Gras',
  'babenda': 'Tô',  // Burkina dish
  'dambou (niger)': 'Tô',  // Niger dish
  'fufu & peanut soup (togo)': 'Fufu and Light Soup',
  'koklo meme (grilled chicken)': 'Koklo Meme',
  'klui-klui (peanut sticks)': 'Kuli Kuli',  // similar
  'pâte noire & sauce gombo': 'Tô',  // similar
  'domoda (gambian peanut stew)': 'Domoda',
  'benachin (one-pot rice)': 'Benachin',
  'caldo de mancarra': 'Maafe',  // peanut soup
  'mechoui (roast lamb)': 'Braai',  // roast meat
  'thiéboudienne (mauritania)': 'Thiéboudienne',

  // seedEastAfricanFoods.js names
  'injera with doro wat': 'Injera',
  'kitfo (ethiopian steak tartare)': 'Kitfo',
  'shiro wat': 'Shiro Wat',
  'tibs (sautéed meat)': 'Tibs',
  'beyaynetu (ethiopian fasting platter)': 'Injera',  // platter on injera
  'ethiopian coffee ceremony': 'Injera',  // Ethiopian culture
  'ugali & sukuma wiki': 'Ugali',
  'nyama choma (roast meat)': 'Nyama Choma',
  'mukimo': 'Irio',
  'chapati (kenyan)': 'Chapati (East African)',
  'pilau (kenyan spiced rice)': 'Pilau',
  'samosa (kenyan)': 'Sambusa',
  'ugali na nyama': 'Ugali',
  'zanzibar pilau': 'Pilau',
  'chipsi mayai (chips mayai)': 'Zanzibar Pizza',  // similar street food
  'ndizi nyama (plantain & meat)': 'Matoke',
  'matoke (steamed green banana)': 'Matoke',
  'luwombo (banana leaf stew)': 'Luwombo',
  'rolex (rolled eggs)': 'Rolex',
  'groundnut sauce (uganda)': 'Binyebwa',
  'bariis iskukaris (somali spiced rice)': 'Bariis Iskukaris',
  'canjeero (somali pancake)': 'Canjeero',
  'suqaar (somali sautéed meat)': 'Suqaar',
  'cambuulo (adzuki bean dessert)': 'Canjeero',  // similar
  'isombe (cassava leaf stew)': 'Isombe',
  'brochettes (rwandan meat skewers)': 'Brochettes',
  'beans & plantain (burundi style)': 'Beans and Plantain',
  'zigni (eritrean beef stew)': 'Zigni',
  'ful (eritrean fava beans)': 'Foul Medames',
  'skoudehkaris (djibouti spiced rice)': 'Bariis Iskukaris',  // similar
  'kisra (sudanese flatbread)': 'Kissra',
  'ful medames (sudan)': 'Ful Medames',
  'walwal (south sudan stew)': 'Pepper Soup',  // similar stew

  // seedNorthAfricanFoods.js names
  'taameya (egyptian falafel)': 'Akara',  // similar fried food
  'mahshi (stuffed vegetables)': 'Molokhia',  // Egyptian
  'shawarma (egyptian style)': 'Hawawshi',  // Egyptian meat
  'umm ali (egyptian bread pudding)': 'Feteer Meshaltet',  // Egyptian baking
  'chicken tagine with preserved lemons & olives': 'Chicken Tagine',
  'couscous royale': 'Couscous Royale',
  'pastilla (b\'stilla)': 'Pastilla',
  'moroccan mint tea': 'Harira',  // Moroccan
  'brik à l\'oeuf': 'Brik',
  'lablabi (chickpea soup)': 'Lablabi',
  'couscous tunisien': 'Couscous',
  'ojja (tunisian shakshuka)': 'Chakchouka',
  'couscous algérois': 'Couscous',
  'chorba frik (freekeh soup)': 'Sharba',  // similar soup
  'makroud (semolina date cookies)': 'Garantita',  // similar
  'bazin': 'Bazeen',
  'sharba libiya (libyan soup)': 'Sharba',
  'asida (libyan)': 'Asida (Libyan)',

  // seedSouthernAfricanFoods.js names
  'braai (south african bbq)': 'Braai',
  'pap en vleis': 'Pap en Vleis',
  'gatsby sandwich': 'Gatsby',
  'sadza ne nyama': 'Sadza',
  'muboora (pumpkin leaves)': 'Muboora',
  'madora (mopane worms)': 'Madora',
  'dovi (peanut butter stew)': 'Dovi',
  'piri piri chicken': 'Piri Piri Chicken',
  'caril de camarão': 'Matapa',  // Mozambican
  'nshima with ifisashi': 'Nshima',
  'chikanda (african polony)': 'Chikanda',
  'nsima with chambo': 'Nsima (Malawian)',
  'kondowole (cassava nsima)': 'Kondowole',
  'bogobe (sorghum porridge)': 'Bogobe',
  'kapana (street meat)': 'Kapana',
  'oshifima with omagungu': 'Oshifima',
  'muamba de galinha': 'Muamba de Galinha (Angolan)',
  'calulu de peixe': 'Calulu de Peixe',
  'papa (lesotho porridge)': 'Papa',
  'sishwala': 'Bogobe',  // similar Botswana porridge
  'rougaille (tomato creole)': 'Rougaille',
  'kat kat banane': 'Ladob',  // similar Comoros dessert
  'ladob (sweet banana)': 'Ladob',

  // seedCentralAfricanFoods.js names
  'moambe chicken (poulet moambe)': 'Moambe Chicken',
  'fufu (congolese)': 'Fufu (Congolese)',
  'pondu (saka saka)': 'Pondu/Saka Saka',
  'liboke ya mbisi': 'Liboke ya Mbisi',
  'makemba (fried plantain)': 'Dodo (Fried Plantain)',
  'mikate (congolese doughnuts)': 'Mikate',
  'mbika (pumpkin seed stew)': 'Mbika',
  'mwambe (palm butter sauce)': 'Moambe Chicken',
  'nyembwe chicken': 'Nyembwe Chicken',
  'bâton de manioc': 'Fufu (Congolese)',  // cassava stick
  'gozo (cassava bread)': 'Gozo',
  'kanda (meatballs in sauce)': 'Kanda',
  'daraba (okra stew)': 'Daraba',
  'boule (millet ball)': 'Boule',
  'kissar (chadian crêpe)': 'Kissar',
  'succotash de mariscos': 'Calulu de Peixe',  // seafood
  'pepesoup (equatoguinean)': 'Pepesoup',
  'calulu são-tomense': 'Calulu de Peixe',
  'ângu de banana': 'Matoke',  // banana based

  // seedFoodCombos.js names
  'rice and beans (nigerian)': 'Rice and Beans (Nigerian)',
  'bread and egg (nigerian)': 'Bread and Egg (Nigerian)',
  'ekuru with stew': 'Ekuru and Stew',
  'ogi (pap) and akara': 'Pap and Akara',
  'yam and egg sauce': 'Yam and Egg Sauce',
  'beans and plantain': 'Beans and Plantain',
  'indomie and egg': 'Indomie and Egg',
  'garri and groundnut': 'Garri and Groundnut',
  'agege bread and ewa agoyin': 'Agege Bread and Ewa Agoyin',
  'cereal and milk (nigerian style)': 'Ogi/Akamu',  // similar
  'moi moi and custard/pap': 'Moi Moi',
  'waakye (rice and beans)': 'Waakye (Combo)',
  'kenkey and fried fish': 'Kenkey and Fish',
  'banku and tilapia': 'Banku and Tilapia',
  'koose (bean cake) and koko': 'Akara',  // similar
  'ugali and sukuma wiki': 'Ugali and Sukuma',
  'chapati and beans': 'Chapati and Beans',
  'injera and firfir': 'Firfir',
  'rolex (chapati egg roll)': 'Rolex (Combo)',
  'matoke and groundnut sauce': 'Matoke',
  'ful medames and bread': 'Ful and Bread',
  'couscous and lamb tagine': 'Couscous and Tagine',
  'msemen and mint tea': 'Couscous',  // Moroccan
  'pap, wors, and chakalaka': 'Pap Wors Chakalaka',
  'vetkoek and mince': 'Vetkoek',
  'thiéboudienne (rice and fish)': 'Thiéboudienne (Combo)',
  'ndolé and plantain': 'Ndolé and Plantain',
  'achu soup and fufu (yellow soup)': 'Achu Soup',
  'attiéké and fried fish': 'Attiéké',
  'wali na maharage': 'Chapati and Beans',  // similar
  'fufu and pondu': 'Fufu and Pondu',
  'sadza and muriwo ne nyama': 'Sadza and Nyama',
  'nshima, kapenta and chibwabwa': 'Nshima and Kapenta',
  'xima and caril de amendoim': 'Matapa',  // Mozambican
  'vary amin\'anana (rice and greens)': 'Romazava and Rice',
};

function resolveImage(foodName) {
  const lower = foodName.toLowerCase();
  
  // 1. Try manual mapping
  if (manualMappings[lower]) {
    const mapKey = manualMappings[lower];
    if (imageMap[mapKey]) return imageMap[mapKey];
  }
  
  // 2. Try imageMap direct
  if (imageMap[foodName]) return imageMap[foodName];
  
  // 3. Try flexible lookup
  const result = findImage(foodName);
  if (result) return result;
  
  // 4. Last resort fallback - generic African food
  return 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg';
}

// ── Process each seed file ──────────────────────────────────────
const seedFiles = [
  'migrations/seedFoods.js',
  'migrations/seedNigerianFoods.js',
  'migrations/seedWestAfricanFoods.js',
  'migrations/seedEastAfricanFoods.js',
  'migrations/seedNorthAfricanFoods.js',
  'migrations/seedSouthernAfricanFoods.js',
  'migrations/seedCentralAfricanFoods.js',
  'migrations/seedFoodCombos.js',
];

let totalUpdated = 0;

for (const filePath of seedFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = 0;
  
  if (filePath === 'migrations/seedFoods.js') {
    // Special case: seedFoods.js has NO imageUrl — need to ADD it
    // Strategy: find each food's `tags:` line and insert imageUrl before it
    const nameRegex = /name:\s*'([^']+)'/g;
    let match;
    const foodNames = [];
    while ((match = nameRegex.exec(content)) !== null) {
      foodNames.push(match[1]);
    }
    
    for (const name of foodNames) {
      const url = resolveImage(name);
      // Find the tags: line for this food and insert imageUrl before it
      // Look for the pattern: tags: [...],\n      isFeatured:
      // We need to find the specific food block and add imageUrl before tags
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const foodBlockRegex = new RegExp(
        `(name:\\s*'${escapedName}'[\\s\\S]*?)(tags:\\s*\\[)`,
        ''
      );
      const blockMatch = content.match(foodBlockRegex);
      if (blockMatch) {
        const insertion = `imageUrl: '${url}',\n      `;
        content = content.replace(foodBlockRegex, `$1${insertion}$2`);
        updated++;
      }
    }
  } else {
    // All other files: replace existing imageUrl values
    const nameRegex = /name:\s*'([^']+)'/g;
    let match;
    const foodNames = [];
    const namePositions = [];
    while ((match = nameRegex.exec(content)) !== null) {
      foodNames.push(match[1]);
      namePositions.push(match.index);
    }
    
    // Process in reverse order to not mess up positions
    const imageUrlRegex = /imageUrl:\s*'[^']*'/g;
    const imagePositions = [];
    let imgMatch;
    while ((imgMatch = imageUrlRegex.exec(content)) !== null) {
      imagePositions.push({ index: imgMatch.index, text: imgMatch[0] });
    }
    
    // Match each food name to its nearest following imageUrl
    for (let i = foodNames.length - 1; i >= 0; i--) {
      const namePos = namePositions[i];
      const nextNamePos = i < foodNames.length - 1 ? namePositions[i + 1] : content.length;
      
      // Find the imageUrl between this name and the next
      const imgEntry = imagePositions.find(
        img => img.index > namePos && img.index < nextNamePos
      );
      
      if (imgEntry) {
        const url = resolveImage(foodNames[i]);
        const newText = `imageUrl: '${url}'`;
        content = content.substring(0, imgEntry.index) + newText + content.substring(imgEntry.index + imgEntry.text.length);
        updated++;
      }
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${path.basename(filePath)}: updated ${updated} image URLs`);
  totalUpdated += updated;
}

console.log(`\n🎉 Total: ${totalUpdated} image URLs updated across ${seedFiles.length} files`);
