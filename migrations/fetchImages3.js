/**
 * Round 3: Fill remaining 22 missing foods with appropriate fallbacks
 * and additional Commons searches.
 */
import fs from 'fs';

const imageMap = JSON.parse(fs.readFileSync('./migrations/imageMap.json', 'utf-8'));

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
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

// Better search terms for remaining 22 foods
const searchTerms = {
  'Ikokore': 'ikokore yam porridge Nigerian',
  'Ikokore (Water Yam)': 'water yam porridge Nigeria',
  'Aganyin Stew': 'ewa agoyin stew Nigerian beans',
  'Tiga Dega Na': 'tigadegena peanut sauce Mali',
  'Koklo Meme': 'grilled chicken Togo African',
  'Djenkoumé': 'corn dough Togo West African',
  'Wagasi': 'wagashi cheese Benin fried',
  'Muamba de Galinha (West)': 'muamba galinha chicken palm oil',
  'Suqaar': 'suqaar Somali sauteed meat',
  'Agatogo': 'agatogo Rwanda plantain stew',
  'Sharba': 'shorba Libyan soup',
  'Mbakbaka': 'Libyan pasta macaroni',
  'Kondowole': 'nsima cassava Malawi',
  'Muamba de Galinha (Angolan)': 'muamba chicken Angola palm',
  'Liphoofho': 'Eswatini traditional food sorghum',
  'Ladob': 'Seychelles ladob banana dessert',
  'Liboke ya Mbisi': 'fish banana leaf Congo',
  'Nyembwe Chicken': 'nyembwe chicken Gabon palm',
  'Poulet Nyembwe': 'poulet nyembwe Gabon',
  'Daraba': 'okra stew Chad African',
  'Pepesoup': 'pepper soup African spicy',
  'Nshima and Kapenta': 'nshima kapenta Zambia meal',
};

// Known fallback images from already-found foods
const fallbacks = {
  'Ikokore': imageMap['Efo Riro'],                     // Similar Nigerian stew
  'Ikokore (Water Yam)': imageMap['Efo Riro'],         // Similar Nigerian stew  
  'Aganyin Stew': imageMap['Ewa Agoyin'] || imageMap['Akara'], // Same dish family
  'Tiga Dega Na': imageMap['Maafe'],                    // Same dish (Malian peanut stew)
  'Koklo Meme': imageMap['Suya'],                       // Grilled meat
  'Djenkoumé': imageMap['Tô'],                          // Similar corn dish
  'Wagasi': imageMap['Akara'],                          // Fried food
  'Muamba de Galinha (West)': imageMap['Moambe Chicken'],  // Same dish
  'Suqaar': imageMap['Nyama Choma'],                    // Sautéed meat
  'Agatogo': imageMap['Matoke'],                        // Plantain based
  'Sharba': imageMap['Harira'],                         // Similar soup
  'Mbakbaka': imageMap['Rechta'],                       // Libyan/pasta
  'Kondowole': imageMap['Nshima'] || imageMap['Nsima (Malawian)'], // Same base
  'Muamba de Galinha (Angolan)': imageMap['Moambe Chicken'], // Same dish
  'Liphoofho': imageMap['Pap en Vleis'],                // Similar
  'Ladob': imageMap['Matoke'],                          // Banana-based
  'Liboke ya Mbisi': imageMap['Calulu'],                // Fish dish
  'Nyembwe Chicken': imageMap['Moambe Chicken'],        // Same dish family
  'Poulet Nyembwe': imageMap['Moambe Chicken'],         // Same dish family
  'Daraba': imageMap['La Soupe Kandja'],                // Okra stew
  'Pepesoup': imageMap['Pepper Soup'],                  // Same dish
  'Nshima and Kapenta': imageMap['Nshima'] || imageMap['Nsima (Malawian)'], // Same base
};

async function main() {
  let found = 0;
  
  // Try Commons search first
  for (const [food, searchTerm] of Object.entries(searchTerms)) {
    if (imageMap[food]) continue; // Already resolved
    
    const url = await searchCommons(searchTerm);
    if (url) {
      imageMap[food] = url;
      found++;
      console.log(`  ✅ Commons: ${food}`);
    } else {
      // Use fallback
      if (fallbacks[food]) {
        imageMap[food] = fallbacks[food];
        found++;
        console.log(`  🔄 Fallback: ${food}`);
      } else {
        console.log(`  ❌ No image: ${food}`);
      }
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nResolved ${found} more foods.`);

  // Final check
  const stillMissing = Object.entries(imageMap).filter(([k, v]) => !v);
  console.log(`\nFinal: ${Object.keys(imageMap).length} total, ${Object.keys(imageMap).length - stillMissing.length} with images, ${stillMissing.length} still missing`);
  
  if (stillMissing.length > 0) {
    console.log('Still missing:');
    stillMissing.forEach(([k]) => console.log(`  - ${k}`));
  }

  fs.writeFileSync('./migrations/imageMap.json', JSON.stringify(imageMap, null, 2));
  console.log('\n📁 Updated imageMap.json');
}

main().catch(console.error);
