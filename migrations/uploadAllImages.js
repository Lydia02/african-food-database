/**
 * uploadAllImages.js
 *
 * Uploads every image in migrations/images/ to Firebase Storage and updates
 * Firestore. Handles both auto-named files (<id>_<slug>.<ext>) and manually
 * named files (mapped via MANUAL_MAP below).
 *
 * Usage:
 *   node migrations/uploadAllImages.js            # upload all, skip already done
 *   node migrations/uploadAllImages.js --dry-run  # preview only
 *   node migrations/uploadAllImages.js --force    # re-upload even if already has Storage URL
 */

import fs from 'fs';
import path from 'path';
import { createReadStream } from 'fs';
import { db, bucket } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE   = process.argv.includes('--force');

const IMAGES_DIR     = 'migrations/images';
const STORAGE_FOLDER = 'foods/images';

// ---------------------------------------------------------------------------
// Manual mapping: filename (without ext) → food document ID
// For images you added manually with human-readable names
// ---------------------------------------------------------------------------
const MANUAL_MAP = {
  // Original 5
  'Achu Yellow Soup (Cameroon)':                    '6hGGLeen1EFlMTaDL93H',
  'Agege Bread and Beans (Nigeria)':                'ElUOkWxrvMz93b9ED0bX',
  'Ampesi (Boiled Plantain \u2013 Ghana)':          '7w9c4UijTbUavNz8UAoR',
  'Angu Banana (S\u00e3o Tom\u00e9)':               'tJPrgint4TtslVqh758o',
  'akara':                                          'QqS8Daa9llDgHjVgbvtY',
  // New batch
  'Achu Soup (Cameroon)':                           'fTSE3EkUru4v1ossDGLT',
  'Attieke with Fried Fish (Ivory Coast)':          'JvaoPX5yaylKNZI3auwo',
  'Babenda (Burkina Faso Greens)':                  'Vk7MV5lFibALrno8lRUb',
  'Bariis Iskukaris (Somali Spiced Rice)':          'ZqAL80w2lwJuituWdepO',
  'Bitter Leaf Soup (Nigeria)':                     'Ugm7irxuiNSajeio7YZ7',
  'Bogobe (Sorghum Porridge \u2013 Botswana)':      'ToYru7fvF2UaDfeSHhRe',
  'Brik (Tunisian Pastry with Egg)':                'EFsaSrypa2YJKZlySXr7',
  'Bsisa (Roasted Grain \u2013 Morocco)':           'xrbQ2pXtkjuXsjBxAW2J',
  'Caldo de Mancarra (Guinea-Bissau Peanut Soup)':  'mLJkVSqI6FSGVXnkKMP7',
  'Caldou (Senegalese Fish Rice)':                  'CdmXRovPoPb3aDyK1XbC',
  'Calulu (Fish Stew \u2013 S\u00e3o Tom\u00e9)':   'W4FI3VAjI5A80Hzw7Djc',
  'Calulu de Peixe (Angola Fish Stew)':             'jzxgxVeMdFgmR5kmB4Ir',
  'Cambuulo (Adzuki Beans \u2013 Somalia)':         'fUrCaO3sas6h4FGZbOaX',
  'Canjeero (Somali Pancake)':                      'nCPPLiLT05GC8GyQsyo3',
  'Cassava Leaf Stew (Sierra Leone)':               'WzUMnGZDdn8ImL9zxaVN',
  'Chakhchoukha (Algeria Bread Stew)':              'jONbiiOqOaKSaCjyiuDh',
  'Chikanda (Zambian)':                             '4emeVh0N4WczHUPuO4Rl',
  'Chinchinga (Ghanaian Kebab Skewer)':             'vWfnXOx6W74zJxpvleef',
  'Chipsi Mayai (Chips Omelette \u2013 Tanzania)':  'DZOUNYOkWykpbQuCWc9R',
  'Chipsi Mayai (Chips Omelette)':                  'gHhYouqL7YgxyG9DXiJ4',
  'Chorba Frik (Freekeh Soup \u2013 Algeria)':      'ueqz5cAgfeH0wIv18RDT',
  'Coconut Rice (Africa)':                          'zCMZGcK34FHOaYcrb1oj',
  'Couscous Algerois (Algeria)':                    'flNOxHQtPA8B9ckTmJD3',
  'Dambou (Millet Dish \u2013 Niger)':              'YLL6Sof4G7xOY3Wvjyyy',
  'Edo Black Soup':                                 '42BFmqIVc5smqVVRp7Uq',
  'Ekpang Nkukwo (Nigeria Cocoyam Dish)':           'TnGXe6yZojOQoSOB9p7O',
  'Ekuru (Steamed Beans \u2013 Nigeria)':           'uVWOD2kHku5WNVW0qp1w',
  'Eru Soup (Cameroon)':                            'uwiHl0UV2YwXydhe7ZqZ',
  'Ewedu Soup (Nigeria)':                           'AE5IGgZfxOeYZaQAh2hC',
  'Fufu Pondu (Congo Cassava Dish)':                'Ga0Yq7u8V764lVApPaNw',
  'Fufu Pondu (Congo)':                             'gQkL7qwERw5OvaxNoBO8',
  'Fura da Nono':                                   '0u8ciBprwyNMMe0R3oCX',
  'Garri with Groundnut (Nigeria)':                 'pQjzRuSIln2CDen1nfch',
  'Gizdodo (Gizzard and Plantain \u2013 Nigeria)':  'JxeEnt5kfbFVLbqjSvVc',
  'Gurasa':                                         '2v9cZJx9I6pjixOCFYqV',
  'Ikokore (Water Yam Porridge)':                   '420SnHSI2Mls4MxtnLnl',
  'Indomie Jollof Noodles (Nigeria)':               'YPZMoKBN4hqVjOiE1iyY',
  'Isi Ewu (Goat Head Soup \u2013 Nigeria)':        'Hn5OTVTlawIkngFECgHd',
  'Kat Kat (Banana Coconut \u2013 Seychelles)':     'QgzZHrO2krWUF2Fk2NOR',
  'Kikomando (Chapati and Beans \u2013 Uganda)':    'JtWpu7yN3nvR8WK64uUu',
  'Kilishi (Nigerian Beef Jerky)':                  'HJzEoVMFTnhKf95KAdHG',
  'Kilishi (Nigerian Dried Meat)':                  'FArK8jmap6pdWEWAEFlT',
  'Koklo Meme (Grilled Chicken \u2013 Togo)':       'URqrswWPLRZnkNwkgKui',
  'Koose (Bean Cake \u2013 Ghana)':                 '68KNkyMI6EEoFRYn5gQq',
  'Lahoh (Somali Pancake)':                         'QWlLdpAOKUF8bIv7ZSYB',
  'Langouste Vanilla Lobster (Comoros)':            'qGtoC0necVKZM4aphiFW',
  'Liboke Fish in Banana Leaf (Congo)':             'yVP6U7Vd38ZhC99fQY1L',
  'Libyan Soup':                                    '71Z1N1W5SeTrdShjpOrs',
  'Miyan Kuka (Baobab Soup \u2013 Nigeria)':        'Dw5Q68WYttz3B56QixeO',
  'Miyan Taushe (Pumpkin Soup \u2013 Nigeria)':     'puKlZgyaaBuj0PEb4YJS',
  'Muamba de Galinha (Angola Chicken)':             'drsfsb17zNmrK1pfDWXw',
  'Native Jollof Iwuk Edesi (Nigeria)':             'sW7Tma1Vgt63f7FZiDaf',
  'Ndizi Nyama (Plantain and Meat \u2013 Tanzania)':'PeCGnE7rLEzehucCMFol',
  'Ndole with Plantain (Cameroon)':                 'n2NYj1Kl7iXBC7oS7AGS',
  'Nkwobi (Nigerian Cow Foot)':                     'QhLBN0mqa2HOhobotOkq',
  'Nshima with Kapenta Fish (Zambia)':              'cWbvSJaqYPsxMjGmL2gj',
  'Nsima with Chambo Fish (Malawi)':                'fYt87eSZ8J1yCnECsSib',
  'Nyembwe Chicken (Gabon Palm Nut Chicken)':       'FqqDkSkbzUP5oYX8o7xk',
  'Ofada Rice Ayamase Stew':                        '3NpoiRyKZfD93DtHbCjt',
  'Ofe AkwuBanga Palm Nut Soup (Nigeria)':          'xGbDVXeO59LZOcMIA07T',
  'Ofe Nsala (White Soup \u2013 Nigeria)':          '7lAlb1AkphDpBu0Gb0VD',
  'Ofe Oha (Nigeria)':                              'aFgcXO5TYYdfmmozXUjz',
  'Ojja (Tunisian Shakshuka)':                      'r3eZTWaDTVP5uVyzCYS4',
  'Oshifima (Namibia Porridge)':                    'vIYyuYiy2S8LYvP3mFel',
  'Pap, Wors, Chakalaka (South Africa)':            'sRR9GDhVChQbKXRUAKpZ',
  'Pate Noire with Okra Sauce':                     'Q10KoZOXN43xLCxtYLut',
  'Pumpkin Leaves Stew (Africa)':                   'AyYV7AWGyTwMsIEikDC3',
  'Rechta (Algerian Pasta)':                        'BkbtBKC0ij5dx5bnjXxu',
  'Rice with Greens (Madagascar)':                  'es189eBL7HiyrtK6Hn9M',
  'Roasted Corn (Kenya)':                           'C2zz9NX3TWuDzNLPYDCO',
  'Sadza with Muriwo and Nyama (Zimbabwe)':         'hwiHpGpDoLJ8iDQ5ARRb',
  'Sadza with Nyama (Zimbabwe)':                    'tvVAFR5aQsl76BiIaG1F',
  'Sishwala (Eswatini Porridge)':                   'G2VN9HFMatpI0b20EcrQ',
  'Sisi Pelebe':                                    'wYuCSk620DrDYAxxHwCq',
  'Skoudehkaris (Djibouti Spiced Rice)':            'uotvRvjVs561CLIr8D0q',
  'Succotash Seafood (Equatorial Guinea)':          'a6kqCkBtsbre1igV3bBN',
  'Suqaar (Somali Saut\u00e9ed Meat)':              'ypIVXxXWK1V8TEdKnqkL',
  'Tajine Zitoun (Olive Chicken \u2013 Algeria)':   'fglM1eMEnzGZtBqFSBt6',
  'Tigadeguena (Mali Peanut Stew)':                 'aTcBbURUIGez7byusa1F',
  'Ugali Nyama (Kenya)':                            'NpJeOSY0heM35tc5Sg30',
  'Vetkoek with Mince (South Africa)':              'sMqU97r2Q5CXPKnZqhhu',
  'Vitumbuwa (Zambian Fritters)':                   'Mys8UO8wi0ofSxTOwYCf',
  'Wali Maharage (Rice and Beans \u2013 Tanzania)': 'OslneX8sSy30WLkMV7JL',
  // New replacements
  'Githeri':                                        'CYj6KAuqXiDoB1o52ig6',
  'Ladob (Sweet Banana)':                           '5X8j0siCATchO22jUife',
  'Moi Moi with Custard Pap (Nigeria)':             'bcJreidGkqwTNSGWkJi1',
  'Mukimo':                                         '5E4e2ryg6SfhuzwUG9Bh',
  'Nyama Choma (Roast Meat)':                       'RfDLxANZQkULHtaZq9kB',
  'Posho and Beans':                                'gIMrqWmOVdyniPNkr2qy',
  'dundun (Fried yam)':                             'ABHM6RXJ7Hf44PBx6KNR',
  'ful (eritrean fava bean)':                       '6whU6asXKKOACwP6n7Xg',
  // Generic extras (map to best matching food)
  'conconction rice':                               'eSoYfWPmtGwK3HRtbRLD',
  'derssa':                                         '0h41P6JLhSF8yLKkkrdV',
  'download':                                       null, // skip - too generic
  'fried plaintain':                                'ey7opiUiSVf1u8Ck7E2y',
  'kulikuli':                                       'vQuz9ShJOW8oEiXAQ52y',
  'rice and beans':                                 'EvVl0ZRjjZSraIhGhjYz',
  'roasted plantain and fish':                      'eQOkWb55xwulR70IXjnr',
  'white rice and stew':                            'YAemncN9Cp1P0qdo2aOK',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function extToMime(ext) {
  const map = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.jfif': 'image/jpeg',
    '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif',
  };
  return map[ext.toLowerCase()] || 'image/jpeg';
}

function resolveId(filename) {
  const nameNoExt = path.basename(filename, path.extname(filename));

  // Manual map check (exact match)
  if (MANUAL_MAP[nameNoExt] !== undefined) {
    return MANUAL_MAP[nameNoExt];
  }

  // Auto-named: first segment before first underscore is the Firestore ID
  // IDs are 20 chars of [a-zA-Z0-9]
  const match = nameNoExt.match(/^([a-zA-Z0-9]{20})_/);
  if (match) return match[1];

  return null;
}

async function uploadToStorage(localPath, foodId) {
  const ext        = path.extname(localPath).toLowerCase();
  // Always store as .jpg in Storage (jfif is jpeg)
  const storeExt   = ext === '.jfif' ? '.jpg' : ext;
  const remotePath = `${STORAGE_FOLDER}/${foodId}${storeExt}`;
  const file       = bucket.file(remotePath);

  await new Promise((resolve, reject) => {
    const stream = file.createWriteStream({
      metadata: {
        contentType: extToMime(ext),
        metadata: { uploadedAt: new Date().toISOString(), source: 'manual' },
      },
      resumable: false,
    });
    stream.on('error', reject);
    stream.on('finish', resolve);
    createReadStream(localPath).pipe(stream);
  });

  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${remotePath}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => /\.(jpg|jpeg|jfif|png|webp|gif)$/i.test(f));

  console.log(`📁 Found ${files.length} image files in ${IMAGES_DIR}`);
  if (DRY_RUN) console.log('🔍 DRY RUN — no writes will happen\n');
  if (FORCE)   console.log('⚡ FORCE mode — will re-upload even existing Storage URLs\n');

  // Load foods cache to get current imageUrl values
  const cache = JSON.parse(fs.readFileSync('migrations/.foods-cache.json', 'utf8'));
  const foodMap = {};
  for (const f of cache) foodMap[f.id] = f;

  let uploaded = 0, updated = 0, skipped = 0, noId = 0, errors = 0;

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const localPath = path.join(IMAGES_DIR, filename);
    const prefix = `[${i + 1}/${files.length}]`;

    const foodId = resolveId(filename);
    if (!foodId) {
      console.log(`${prefix} ⚠️  Cannot resolve ID for: ${filename}`);
      noId++;
      continue;
    }

    const food = foodMap[foodId];
    const foodName = food?.name || foodId;

    // Skip if already has a Firebase Storage URL and not forced
    if (!FORCE && food?.imageUrl?.includes('storage.googleapis.com')) {
      console.log(`${prefix} ⏭  Already on Storage (skip): ${foodName}`);
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`${prefix} 🔍 Would upload: ${foodName}`);
      console.log(`       file: ${localPath}`);
      continue;
    }

    try {
      const publicUrl = await uploadToStorage(localPath, foodId);
      uploaded++;

      await db.collection(COLLECTIONS.FOODS).doc(foodId).update({
        imageUrl:  publicUrl,
        updatedAt: new Date().toISOString(),
      });
      updated++;

      console.log(`${prefix} ✅ ${foodName}`);
      console.log(`       → ${publicUrl}`);
    } catch (err) {
      errors++;
      console.error(`${prefix} ❌ ${foodName}: ${err.message}`);
    }
  }

  console.log('\n=== UPLOAD COMPLETE ===');
  console.log(`✅ Uploaded & updated: ${uploaded}`);
  console.log(`⏭  Skipped (already done): ${skipped}`);
  console.log(`⚠️  No ID resolved: ${noId}`);
  console.log(`❌ Errors: ${errors}`);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  });
