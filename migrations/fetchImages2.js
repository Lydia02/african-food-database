/**
 * Round 2: Try alternative Wikipedia titles for missing foods.
 * Then search Wikimedia Commons for any still missing.
 */
import fs from 'fs';

const imageMap = JSON.parse(fs.readFileSync('./migrations/imageMap.json', 'utf-8'));

// Alternative Wikipedia titles for missing foods
const altTitles = {
  'Kelewele': ['Kelewele', 'Ghanaian_cuisine'],
  'Doro Wat': ['Doro_wot', 'Wat_(food)'],
  'Koshari': ['Koshary', 'Kushari'],
  'Rolex': ['Rolex_(food)', 'Chapati_egg_roll'],
  'Zanzibar Pizza': ['Zanzibar_pizza', 'Zanzibar_mix'],
  'Bitterleaf Soup': ['Bitterleaf_soup', 'Bitter_leaf'],
  'Banga Soup': ['Banga_soup', 'Palm_fruit_soup'],
  'Afang Soup': ['Afang_soup', 'Afang'],
  'Edikang Ikong': ['Edikang_ikong', 'Edikaikong_soup'],
  'Gbegiri and Ewedu': ['Gbegiri', 'Ewedu', 'Àbùlà'],
  'Pepper Soup': ['Pepper_soup', 'Nigerian_pepper_soup'],
  'Eba': ['Eba_(food)', 'Garri'],
  'Tuwo Shinkafa': ['Tuwo_shinkafa', 'Tuwo'],
  'Moi Moi': ['Moin-moin', 'Moi_moi'],
  'Puff Puff': ['Puff-puff', 'Bofrot'],
  'Chin Chin': ['Chin_chin_(food)', 'Chin_chin'],
  'Masa': ['Masa_(food)', 'Waina'],
  'Dodo (Fried Plantain)': ['Dodo_(food)', 'Fried_plantain'],
  'Boli': ['Boli_(food)', 'Roasted_plantain'],
  'Asun': ['Asun_(food)', 'Asun'],
  'Coconut Rice': ['Coconut_rice', 'Nigerian_coconut_rice'],
  'Fried Rice (Nigerian)': ['Nigerian_fried_rice', 'Fried_rice'],
  'Tuwo Masara': ['Tuwo', 'Tuwo_masara'],
  'Miyan Kuka': ['Miyan_kuka', 'Kuka_soup'],
  'Miyan Taushe': ['Miyan_taushe'],
  'Kunun Gyada': ['Kunun_gyada', 'Kunun'],
  'Zobo': ['Zobo', 'Hibiscus_tea'],
  'Kunu': ['Kunu_(drink)', 'Kununzaki'],
  'Chapman': ['Chapman_(cocktail)', 'Chapman_(drink)'],
  'Ikokore': ['Ikokore', 'Ifokore'],
  'Peppered Snail': ['Peppered_snails'],
  'Peppered Gizzard': ['Gizzard'],
  'Ikokore (Water Yam)': ['Ikokore'],
  'Ewa Agoyin': ['Ewa_Agoyin', 'Ewa_aganyin'],
  'Aganyin Stew': ['Ewa_Agoyin'],
  'Ofe Owerri': ['Ofe_owerri'],
  'Red Red': ['Red-red', 'Red_red'],
  'Banku and Tilapia': ['Banku', 'Banku_and_tilapia'],
  'Kontomire Stew': ['Kontomire', 'Palaver_sauce'],
  'Groundnut Soup': ['Groundnut_soup', 'Peanut_soup'],
  'Alloco': ['Alloco', 'Fried_plantain'],
  'Attiéké': ['Attiéké', 'Attieke'],
  'Garba': ['Garba_(food)', 'Attiéké'],
  'Maafe': ['Maafe', 'Mafé'],
  'Thiakry': ['Thiakry', 'Degue'],
  'Benachin': ['Benachin', 'Jollof_rice'],
  'Eru': ['Eru_(dish)', 'Eru_soup'],
  'Achu Soup': ['Achu_soup', 'Yellow_soup'],
  'Tô': ['Tô', 'Tô_(food)'],
  'Plasas': ['Plasas', 'Palaver_sauce'],
  'Cassava Leaf Stew': ['Saka_saka', 'Cassava_leaf'],
  'Fouti': ['Tô_(food)'],
  'Sauce Feuille': ['Sauce_feuilles'],
  'Tiga Dega Na': ['Tigadegena', 'Maafe'],
  'Koklo Meme': ['Grilled_chicken'],
  'Djenkoumé': ['Djenkoumé'],
  'Wagasi': ['Wagashi_(cheese)', 'Wara_(cheese)'],
  'Bouille': ['Bouille', 'Bouillie'],
  'Muamba de Galinha (West)': ['Muamba_de_galinha'],
  'Poulet DG': ['Poulet_DG'],
  'Tibs': ['Tibs', 'Ethiopian_cuisine'],
  'Pilau': ['Pilaf', 'Pilau_(East_Africa)'],
  'Irio': ['Irio', 'Mukimo'],
  'Katogo': ['Katogo'],
  'Binyebwa': ['Binyebwa', 'Groundnut_sauce'],
  'Canjeero': ['Canjeero', 'Lahoh'],
  'Bariis Iskukaris': ['Bariis', 'Somali_rice'],
  'Suqaar': ['Suqaar', 'Somali_cuisine'],
  'Muufo': ['Muufo', 'Somali_flatbread'],
  'Brochettes': ['Brochette'],
  'Ibihaza': ['Ibihaza'],
  'Agatogo': ['Agatogo'],
  'Tsebhi': ['Tsebhi', 'Zigni'],
  'Koshari (Egyptian)': ['Koshary', 'Kushari'],
  'Mechouia': ['Mechouia_salad', 'Mechouia'],
  'Berkoukes': ['Berkoukes'],
  'Dobara': ['Doubara', 'Biskra'],
  'Bazeen': ['Bazeen', 'Bazin_(food)'],
  'Sharba': ['Shorba', 'Shurba'],
  'Usban': ['Osban', 'Usban'],
  'Mbakbaka': ['Mbakbaka', 'Libyan_pasta'],
  'Braai': ['Braai', 'South_African_braai'],
  'Pap en Vleis': ['Pap_(food)', 'Mieliepap'],
  'Sadza': ['Sadza', 'Ugali'],
  'Muboora': ['Muboora', 'Pumpkin_leaves'],
  'Madora': ['Mopane_worm'],
  'Dovi': ['Dovi', 'Peanut_stew'],
  'Piri Piri Chicken': ['Piri_piri', 'Peri-peri_chicken'],
  'Nshima': ['Nshima', 'Nsima'],
  'Nsima (Malawian)': ['Nsima', 'Nshima'],
  'Chambo': ['Chambo', 'Oreochromis_lidole'],
  'Kondowole': ['Kondowole', 'Cassava_flour'],
  'Serobe': ['Serobe'],
  'Bogobe': ['Bogobe', 'Sorghum_porridge'],
  'Kapana': ['Kapana_(food)', 'Kapana'],
  'Oshifima': ['Oshifima'],
  'Muamba de Galinha (Angolan)': ['Muamba_de_galinha'],
  'Papa': ['Pap_(food)'],
  'Liphoofho': ['Eswatini_cuisine', 'Swaziland_cuisine'],
  'Dholl Puri': ['Dholl_puri'],
  'Rougaille': ['Rougail', 'Rougaille'],
  'Langouste à la Vanille': ['Spiny_lobster'],
  'Ladob': ['Ladob'],
  'Pondu/Saka Saka': ['Saka_saka', 'Pondu'],
  'Liboke ya Mbisi': ['Liboke', 'Liboke_ya_mbisi'],
  'Mikate': ['Mandazi', 'Mikate'],
  'Mbika': ['Egusi'],
  'Nyembwe Chicken': ['Nyembwe', 'Poulet_nyembwe'],
  'Poulet Nyembwe': ['Nyembwe'],
  'Gozo': ['Cassava_bread'],
  'Kanda': ['Kanda_(food)'],
  'Daraba': ['Daraba'],
  'Boule': ['Fufu'],
  'Mafé (Central)': ['Maafe'],
  'Pepesoup': ['Pepper_soup'],
  'Angulá': ['Angolá', 'Caterpillar_(food)'],
  'Bread and Egg (Nigerian)': ['Nigerian_cuisine'],
  'Agege Bread and Ewa Agoyin': ['Agege_bread', 'Ewa_Agoyin'],
  'Banku and Okro': ['Banku', 'Okra_soup'],
  'Injera and Doro Wat': ['Doro_wot', 'Injera'],
  'Rolex (Combo)': ['Rolex_(food)'],
  'Katogo (Combo)': ['Katogo'],
  'Koshari (Combo)': ['Koshary', 'Kushari'],
  'Alloco and Attiéké': ['Alloco', 'Attiéké'],
  'Sadza and Nyama': ['Sadza'],
  'Nshima and Kapenta': ['Nshima'],
  'Ifisashi': ['Ifisashi'],
};

async function fetchBatch(titles) {
  const encoded = titles.map(t => encodeURIComponent(t)).join('|');
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&format=json&pithumbsize=800`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AfricanFoodDB/1.0', 'Accept': 'application/json' }
  });
  const data = await res.json();
  const results = {};
  if (data.query?.pages) {
    for (const page of Object.values(data.query.pages)) {
      if (page.thumbnail) {
        results[page.title.replace(/ /g, '_')] = page.thumbnail.source;
      }
    }
  }
  // Also store redirected titles
  if (data.query?.normalized) {
    for (const n of data.query.normalized) {
      const normTitle = n.to.replace(/ /g, '_');
      if (results[normTitle]) {
        results[n.from] = results[normTitle];
      }
    }
  }
  return results;
}

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query + ' food')}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AfricanFoodDB/1.0', 'Accept': 'application/json' }
  });
  const data = await res.json();
  if (data.query?.pages) {
    for (const page of Object.values(data.query.pages)) {
      if (page.imageinfo?.[0]?.thumburl) {
        return page.imageinfo[0].thumburl;
      }
    }
  }
  return null;
}

async function main() {
  // Collect all alternative titles to try
  const allAltTitles = new Set();
  for (const titles of Object.values(altTitles)) {
    titles.forEach(t => allAltTitles.add(t));
  }
  const titleList = [...allAltTitles];
  console.log(`Trying ${titleList.length} alternative Wikipedia titles...`);

  const titleToUrl = {};
  const BATCH = 50;
  for (let i = 0; i < titleList.length; i += BATCH) {
    const batch = titleList.slice(i, i + BATCH);
    const results = await fetchBatch(batch);
    Object.assign(titleToUrl, results);
    console.log(`  Batch ${Math.floor(i/BATCH)+1}: got ${Object.keys(results).length} images`);
    await new Promise(r => setTimeout(r, 200));
  }

  // Apply alternative matches to imageMap
  let fixed = 0;
  for (const [food, alts] of Object.entries(altTitles)) {
    if (imageMap[food]) continue; // Already has an image
    for (const alt of alts) {
      if (titleToUrl[alt]) {
        imageMap[food] = titleToUrl[alt];
        fixed++;
        break;
      }
    }
  }
  console.log(`\nFixed ${fixed} foods with alternative titles.`);

  // Find still-missing foods
  const stillMissing = Object.entries(imageMap).filter(([k, v]) => !v).map(([k]) => k);
  console.log(`Still missing: ${stillMissing.length}`);

  // Try Wikimedia Commons search for remaining
  let commonsFixed = 0;
  for (const food of stillMissing) {
    // Clean name for search
    const searchName = food.replace(/\(.*?\)/g, '').replace(/[\/]/g, ' ').trim();
    const url = await searchCommons(searchName);
    if (url) {
      imageMap[food] = url;
      commonsFixed++;
      console.log(`  ✅ Commons: ${food}`);
    } else {
      console.log(`  ❌ Still missing: ${food}`);
    }
    await new Promise(r => setTimeout(r, 300)); // rate limit Commons
  }
  console.log(`\nFixed ${commonsFixed} more from Commons search.`);

  // Final count
  const finalMissing = Object.entries(imageMap).filter(([k, v]) => !v).map(([k]) => k);
  console.log(`\nFinal stats: ${Object.keys(imageMap).length} total, ${Object.keys(imageMap).length - finalMissing.length} with images, ${finalMissing.length} still missing`);
  
  if (finalMissing.length > 0) {
    console.log('\nStill missing:');
    finalMissing.forEach(f => console.log(`  - ${f}`));
  }

  fs.writeFileSync('./migrations/imageMap.json', JSON.stringify(imageMap, null, 2));
  console.log('\n📁 Updated migrations/imageMap.json');
}

main().catch(console.error);
