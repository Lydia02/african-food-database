/**
 * Fetch real Wikipedia image URLs for ALL foods in the database.
 * Uses the Wikipedia pageimages API to get actual, verified image URLs.
 *
 * Usage: node migrations/fetchImages.js
 */

// All food names mapped to their likely Wikipedia article titles
const foodWikiMap = {
  // ── seedFoods.js (14) ──
  'Jollof Rice': 'Jollof_rice',
  'Suya': 'Suya',
  'Egusi Soup': 'Egusi',
  'Waakye': 'Waakye',
  'Kelewele': 'Kelewele',
  'Doro Wat': 'Doro_wat',
  'Bobotie': 'Bobotie',
  'Nyama Choma': 'Nyama_choma',
  'Chicken Tagine': 'Tagine',
  'Thiéboudienne': 'Thieboudienne',
  'Ndolé': 'Ndolé',
  'Koshari': 'Koshari',
  'Rolex': 'Rolex_(food)',
  'Zanzibar Pizza': 'Zanzibar_mix',

  // ── seedNigerianFoods.js (58) ──
  'Egusi Soup (Nigerian)': 'Egusi',
  'Efo Riro': 'Efo_riro',
  'Ogbono Soup': 'Ogbono_soup',
  'Ofe Nsala': 'Nsala_soup',
  'Bitterleaf Soup': 'Bitterleaf_soup',
  'Oha Soup': 'Oha_soup',
  'Banga Soup': 'Banga_soup',
  'Afang Soup': 'Afang_soup',
  'Edikang Ikong': 'Edikang_ikong_soup',
  'Gbegiri and Ewedu': 'Gbegiri',
  'Pepper Soup': 'Pepper_soup',
  'Pounded Yam': 'Pounded_yam',
  'Amala': 'Amala_(food)',
  'Eba': 'Eba_(food)',
  'Tuwo Shinkafa': 'Tuwo_shinkafa',
  'Fufu (Nigerian)': 'Fufu',
  'Moi Moi': 'Moin-moin',
  'Akara': 'Akara',
  'Puff Puff': 'Puff-puff_(food)',
  'Chin Chin': 'Chin_chin_(snack)',
  'Kilishi': 'Kilishi',
  'Masa': 'Masa_(food)',
  'Kuli Kuli': 'Kuli-kuli',
  'Dodo (Fried Plantain)': 'Dodo_(food)',
  'Ojojo': 'Ojojo',
  'Boli': 'Boli_(food)',
  'Abacha': 'Abacha_(food)',
  'Nkwobi': 'Nkwobi',
  'Isi Ewu': 'Isi_ewu',
  'Suya (Nigerian)': 'Suya',
  'Asun': 'Asun_(food)',
  'Ofada Rice': 'Ofada_rice',
  'Coconut Rice': 'Nigerian_coconut_rice',
  'Jollof Rice (Nigerian)': 'Jollof_rice',
  'Fried Rice (Nigerian)': 'Nigerian_fried_rice',
  'Tuwo Masara': 'Tuwo',
  'Dan Wake': 'Dan_wake',
  'Miyan Kuka': 'Miyan_kuka',
  'Miyan Taushe': 'Miyan_taushe',
  'Kunun Gyada': 'Kunun_gyada',
  'Zobo': 'Zobo_drink',
  'Kunu': 'Kunu_(drink)',
  'Chapman': 'Chapman_(cocktail)',
  'Palm Wine': 'Palm_wine',
  'Ogi/Akamu': 'Ogi_(food)',
  'Ekuru': 'Ekuru',
  'Ikokore': 'Ikokore',
  'Ewedu Soup': 'Ewedu_soup',
  'Ayamase': 'Ayamase',
  'Gizdodo': 'Gizdodo',
  'Peppered Snail': 'Peppered_snail',
  'Peppered Gizzard': 'Peppered_gizzard',
  'Asaro': 'Asaro_(food)',
  'Ikokore (Water Yam)': 'Ikokore',
  'Ewa Agoyin': 'Ewa_Agoyin',
  'Okpa': 'Okpa',
  'Aganyin Stew': 'Ewa_Agoyin',
  'Ofe Owerri': 'Ofe_owerri',

  // ── seedWestAfricanFoods.js (45) ──
  'Ghanaian Jollof': 'Jollof_rice',
  'Red Red': 'Red-red',
  'Banku and Tilapia': 'Banku',
  'Fufu and Light Soup': 'Fufu',
  'Kenkey': 'Kenkey',
  'Kontomire Stew': 'Kontomire_stew',
  'Groundnut Soup': 'Groundnut_soup',
  'Alloco': 'Alloco',
  'Attiéké': 'Attiéké',
  'Garba': 'Garba_(food)',
  'Maafe': 'Maafe',
  'Yassa Chicken': 'Yassa_(food)',
  'Domoda': 'Domoda',
  'Thiakry': 'Thiakry',
  'Jolof Rice (Gambian)': 'Jollof_rice',
  'Benachin': 'Benachin',
  'Cachupa': 'Cachupa',
  'Eru': 'Eru_(food)',
  'Ndolé (Cameroon)': 'Ndolé',
  'Koki Beans': 'Koki_(food)',
  'Achu Soup': 'Achu_soup',
  'Tô': 'Tô_(food)',
  'Riz Gras': 'Riz_gras',
  'Ragout d\'Igname': 'Yam_(vegetable)',
  'Plasas': 'Plasas',
  'Cassava Leaf Stew': 'Cassava-leaf_stew',
  'Jollof Rice (Liberian)': 'Jollof_rice',
  'Fouti': 'Fouti',
  'Poulet Yassa': 'Yassa_(food)',
  'Sauce Feuille': 'Sauce_feuille',
  'Tiga Dega Na': 'Tigadegena',
  'Ablo': 'Ablo',
  'Koklo Meme': 'Grilled_chicken',
  'Djenkoumé': 'Djenkoumé',
  'Pâté': 'Pâté',
  'Wagasi': 'Wagashi_(cheese)',
  'Riz au Gras': 'Riz_gras',
  'Bouille': 'Bouille',
  'Sauce Arachide': 'Peanut_sauce',
  'Caldeirada': 'Caldeirada',
  'Funge': 'Funge',
  'Muamba de Galinha (West)': 'Muamba_de_galinha',
  'Poulet DG': 'Poulet_DG',
  'Soya (Cameroon)': 'Suya',
  'Beignets (Cameroon)': 'Beignet',

  // ── seedEastAfricanFoods.js (35) ──
  'Injera': 'Injera',
  'Kitfo': 'Kitfo',
  'Shiro Wat': 'Shiro_(food)',
  'Tibs': 'Tibs',
  'Genfo': 'Genfo',
  'Ugali': 'Ugali',
  'Pilau': 'Pilau',
  'Sukuma Wiki': 'Sukuma_wiki',
  'Githeri': 'Githeri',
  'Irio': 'Irio',
  'Chapati (East African)': 'Chapati',
  'Ndizi Nyama': 'Matoke',
  'Matoke': 'Matoke',
  'Luwombo': 'Luwombo',
  'Posho': 'Ugali',
  'Katogo': 'Katogo',
  'Binyebwa': 'Binyebwa',
  'Sambusa': 'Samosa',
  'Canjeero': 'Canjeero',
  'Bariis Iskukaris': 'Bariis_(food)',
  'Suqaar': 'Suqaar',
  'Muufo': 'Muufo',
  'Brochettes': 'Brochette',
  'Isombe': 'Isombe',
  'Ibihaza': 'Ibihaza',
  'Agatogo': 'Agatogo',
  'Zigni': 'Zigni',
  'Tsebhi': 'Tsebhi',
  'Kitcha Fit-Fit': 'Fit-fit',
  'Foul Medames': 'Ful_medames',
  'Kissra': 'Kisra',
  'Asida': 'Asida',
  'Ful (Sudanese)': 'Ful_medames',
  'Mukhbaza': 'Lahoh',
  'Sabaaayad': 'Sabaayad',

  // ── seedNorthAfricanFoods.js (25) ──
  'Koshari (Egyptian)': 'Koshari',
  'Ful Medames': 'Ful_medames',
  'Molokhia': 'Mulukhiyah',
  'Hawawshi': 'Hawawshi',
  'Feteer Meshaltet': 'Feteer_meshaltet',
  'Couscous': 'Couscous',
  'Tagine (Moroccan)': 'Tagine',
  'Pastilla': 'Pastilla',
  'Harira': 'Harira',
  'Rfissa': 'Rfissa',
  'Chakchouka': 'Shakshouka',
  'Couscous Royale': 'Couscous',
  'Mechouia': 'Mechouia',
  'Lablabi': 'Lablabi',
  'Brik': 'Brik',
  'Rechta': 'Rechta',
  'Chakhchoukha': 'Chakhchoukha',
  'Berkoukes': 'Berkoukes',
  'Dobara': 'Doubara',
  'Garantita': 'Karantika',
  'Bazeen': 'Bazeen',
  'Asida (Libyan)': 'Asida',
  'Sharba': 'Shorba',
  'Usban': 'Osban',
  'Mbakbaka': 'Mbakbaka',

  // ── seedSouthernAfricanFoods.js (37) ──
  'Bobotie (South African)': 'Bobotie',
  'Bunny Chow': 'Bunny_chow',
  'Braai': 'Braai',
  'Biltong': 'Biltong',
  'Pap en Vleis': 'Pap_(food)',
  'Chakalaka': 'Chakalaka',
  'Vetkoek': 'Vetkoek',
  'Malva Pudding': 'Malva_pudding',
  'Koeksister': 'Koeksister',
  'Gatsby': 'Gatsby_(sandwich)',
  'Sadza': 'Sadza',
  'Muboora': 'Muboora',
  'Madora': 'Mopane_worm',
  'Dovi': 'Dovi',
  'Piri Piri Chicken': 'Piri_piri_chicken',
  'Matapa': 'Matapa',
  'Nshima': 'Nshima',
  'Ifisashi': 'Ifisashi',
  'Chikanda': 'Chikanda',
  'Kapenta': 'Kapenta',
  'Nsima (Malawian)': 'Nsima',
  'Chambo': 'Chambo_(fish)',
  'Kondowole': 'Kondowole',
  'Seswaa': 'Seswaa',
  'Serobe': 'Serobe',
  'Bogobe': 'Bogobe',
  'Kapana': 'Kapana_(food)',
  'Oshifima': 'Oshifima',
  'Muamba de Galinha (Angolan)': 'Muamba_de_galinha',
  'Calulu': 'Calulu',
  'Funge (Angolan)': 'Funge',
  'Papa': 'Pap_(food)',
  'Liphoofho': 'Sesotho_cuisine',
  'Romazava': 'Romazava',
  'Ravitoto': 'Ravitoto',
  'Dholl Puri': 'Dholl_puri',
  'Rougaille': 'Rougaille',
  'Langouste à la Vanille': 'Langouste',
  'Ladob': 'Ladob',

  // ── seedCentralAfricanFoods.js (19) ──
  'Moambe Chicken': 'Moambe_chicken',
  'Fufu (Congolese)': 'Fufu',
  'Pondu/Saka Saka': 'Saka_saka',
  'Liboke ya Mbisi': 'Liboke',
  'Mikate': 'Mikate',
  'Chikwanga': 'Chikwangue',
  'Mbika': 'Mbika',
  'Nyembwe Chicken': 'Nyembwe',
  'Poulet Nyembwe': 'Nyembwe',
  'Gozo': 'Gozo_(food)',
  'Kanda': 'Kanda_(food)',
  'Daraba': 'Daraba',
  'Boule': 'Boule_(food)',
  'Kissar': 'Kisra',
  'La Soupe Kandja': 'Okra_soup',
  'Mafé (Central)': 'Maafe',
  'Pepesoup': 'Pepper_soup',
  'Calulu de Peixe': 'Calulu',
  'Angulá': 'Angulá',

  // ── seedFoodCombos.js (35) ──
  'Rice and Beans (Nigerian)': 'Rice_and_beans',
  'Bread and Egg (Nigerian)': 'Bread_and_butter',
  'Ekuru and Stew': 'Ekuru',
  'Pap and Akara': 'Akara',
  'Yam and Egg Sauce': 'Yam_(vegetable)',
  'Beans and Plantain': 'Cooking_banana',
  'Indomie and Egg': 'Indomie',
  'Garri and Groundnut': 'Garri',
  'Agege Bread and Ewa Agoyin': 'Ewa_Agoyin',
  'Waakye (Combo)': 'Waakye',
  'Kenkey and Fish': 'Kenkey',
  'Banku and Okro': 'Banku',
  'Ugali and Sukuma': 'Ugali',
  'Chapati and Beans': 'Chapati',
  'Nyama Choma and Ugali': 'Nyama_choma',
  'Injera and Doro Wat': 'Doro_wat',
  'Kitfo and Injera': 'Kitfo',
  'Firfir': 'Fit-fit',
  'Rolex (Combo)': 'Rolex_(food)',
  'Katogo (Combo)': 'Katogo',
  'Ful and Bread': 'Ful_medames',
  'Koshari (Combo)': 'Koshari',
  'Couscous and Tagine': 'Couscous',
  'Harira and Dates': 'Harira',
  'Pap Wors Chakalaka': 'Boerewors',
  'Bunny Chow (Combo)': 'Bunny_chow',
  'Thiéboudienne (Combo)': 'Thieboudienne',
  'Yassa and Rice': 'Yassa_(food)',
  'Fufu and Egusi': 'Fufu',
  'Ndolé and Plantain': 'Ndolé',
  'Alloco and Attiéké': 'Alloco',
  'Fufu and Pondu': 'Fufu',
  'Sadza and Nyama': 'Sadza',
  'Nshima and Kapenta': 'Nshima',
  'Romazava and Rice': 'Romazava',
};

// Deduplicate Wikipedia titles
const allTitles = [...new Set(Object.values(foodWikiMap))];

async function fetchBatch(titles) {
  const encoded = titles.map(t => encodeURIComponent(t)).join('|');
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&format=json&pithumbsize=800`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'AfricanFoodDB/1.0 (pantrypal; contact@example.com)',
      'Accept': 'application/json',
    }
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error('  Failed to parse response, status:', res.status);
    console.error('  First 200 chars:', text.substring(0, 200));
    return {};
  }
  const results = {};
  if (data.query && data.query.pages) {
    for (const page of Object.values(data.query.pages)) {
      if (page.thumbnail) {
        // Store by both original title and normalized title
        const key = page.title.replace(/ /g, '_');
        results[key] = page.thumbnail.source;
      }
    }
  }
  return results;
}

async function main() {
  console.log(`Fetching images for ${allTitles.length} unique Wikipedia titles...`);
  
  const titleToUrl = {};
  const BATCH = 50;
  
  for (let i = 0; i < allTitles.length; i += BATCH) {
    const batch = allTitles.slice(i, i + BATCH);
    const results = await fetchBatch(batch);
    Object.assign(titleToUrl, results);
    console.log(`  Batch ${Math.floor(i/BATCH)+1}: got ${Object.keys(results).length} images`);
    await new Promise(r => setTimeout(r, 200)); // rate limit
  }

  // Build final food→URL map
  const foodToUrl = {};
  let found = 0, missing = 0;

  for (const [food, wikiTitle] of Object.entries(foodWikiMap)) {
    // Try exact match, then normalized
    const normalized = wikiTitle.replace(/_/g, ' ').replace(/ /g, '_');
    const url = titleToUrl[wikiTitle] || titleToUrl[normalized];
    if (url) {
      foodToUrl[food] = url;
      found++;
    } else {
      foodToUrl[food] = null;
      missing++;
    }
  }

  console.log(`\n✅ Found: ${found}, ❌ Missing: ${missing}`);
  console.log('\n// ── MISSING FOODS (no Wikipedia image) ──');
  for (const [food, url] of Object.entries(foodToUrl)) {
    if (!url) console.log(`  "${food}"`);
  }
  
  console.log('\n// ── FOOD → URL MAP ──');
  console.log('const IMAGE_MAP = {');
  for (const [food, url] of Object.entries(foodToUrl)) {
    if (url) {
      console.log(`  '${food.replace(/'/g, "\\'")}': '${url}',`);
    }
  }
  console.log('};');

  // Also output as JSON for easy import
  const fs = await import('fs');
  fs.writeFileSync('migrations/imageMap.json', JSON.stringify(foodToUrl, null, 2));
  console.log('\n📁 Saved to migrations/imageMap.json');
}

main().catch(console.error);
