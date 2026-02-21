/**
 * validateAndFixImages.js
 *
 * Scans every food document in Firestore and validates each imageUrl by
 * making a lightweight HTTP HEAD request.  Images that are missing, broken
 * (non-200 status), or point to a non-image content-type are replaced.
 *
 * Fallback chain for broken images:
 *   1. MANUAL_IMAGE_OVERRIDES  – hand-curated, guaranteed working URLs
 *   2. LOCAL_IMAGE_OVERRIDES   – validated first (many are also broken)
 *   3. Wikipedia API lookup     – searches by food name, then stripped name
 *   4. Mark unresolved          – logs it; leaves imageUrl untouched
 *
 * Usage:
 *   node migrations/validateAndFixImages.js                          # live run (fetches from Firestore)
 *   node migrations/validateAndFixImages.js --dry-run                # preview, no writes
 *   node migrations/validateAndFixImages.js --verbose                # log all URL checks
 *   node migrations/validateAndFixImages.js --save-cache             # fetch from Firestore and save local cache
 *   node migrations/validateAndFixImages.js --use-cache --dry-run    # validate using cached data (no Firestore reads)
 *   node migrations/validateAndFixImages.js --use-cache              # live run using cached data for reads
 *
 * Workflow when Firestore quota is exhausted:
 *   1. Wait until quota resets (midnight Pacific), then:
 *      npm run images:cache          # saves migrations/.foods-cache.json
 *   2. From then on use --use-cache for dry-runs:
 *      npm run images:validate:dry   # reads from local cache, zero Firestore quota
 *   3. When ready to write fixes:
 *      npm run images:validate       # still uses cache for reads, writes fixes to Firestore
 *
 * npm scripts:
 *   npm run images:cache          # fetch + save local cache
 *   npm run images:validate       # live run (uses cache if present)
 *   npm run images:validate:dry   # dry-run (uses cache if present)
 */

import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { LOCAL_IMAGE_OVERRIDES } from '../data/localReferenceOverrides.js';
import { getWikipediaFoodInfo } from '../services/externalApiService.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = join(__dirname, '.foods-cache.json');

// ─── CLI flags ──────────────────────────────────────────────────────────────
const DRY_RUN   = process.argv.includes('--dry-run');
const VERBOSE   = process.argv.includes('--verbose');
// --use-cache  : read from local .foods-cache.json instead of Firestore
// --save-cache : force-refresh the cache from Firestore and save it
const USE_CACHE  = process.argv.includes('--use-cache');
const SAVE_CACHE = process.argv.includes('--save-cache');

// ─── Tuning ─────────────────────────────────────────────────────────────────
const HEAD_TIMEOUT_MS = 8_000;
const HEAD_DELAY_MS   = 100;   // delay between HEAD checks
const WIKI_DELAY_MS   = 450;   // delay between Wikipedia API calls

const VALID_HTTP_STATUSES = new Set([200, 301, 302, 303, 307, 308]);

// ─── Manual overrides — confirmed-working URLs, used without validation ──────
// Add more here whenever you verify a working replacement manually.
const MANUAL_IMAGE_OVERRIDES = {
  // ── Misc confirmed fixes ──────────────────────────────────────────────────
  'ikokore':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Water_Yam_Porridge_03.jpg/960px-Water_Yam_Porridge_03.jpg',
  'edo black soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Efo_Riro_with_fried_mackerel_fishes_and_roasted_cowskin.jpg/960px-Efo_Riro_with_fried_mackerel_fishes_and_roasted_cowskin.jpg',
  'sodabi':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Palm_wine.jpg/960px-Palm_wine.jpg',
  'fah-fah':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Igbo_cuisine%2C_ofe_nsala.jpg/960px-Igbo_cuisine%2C_ofe_nsala.jpg',
  'taktouka':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Shakshouka.jpg/960px-Shakshouka.jpg',
  'sisi pelebe':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
  // ── Common dishes with confirmed Wikipedia image pages ────────────────────
  'jollof rice':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jollof_rice_in_a_white_bowl.jpg/960px-Jollof_rice_in_a_white_bowl.jpg',
  'injera':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Injera_sitting.jpg/960px-Injera_sitting.jpg',
  'fufu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pounded_yam.jpg/960px-Pounded_yam.jpg',
  'egusi soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Egusi_Soup2.jpg/960px-Egusi_Soup2.jpg',
  'puff puff':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/960px-Puff-puff3.jpg',
  'suya':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG',
  'akara':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Akara_snack.jpg/960px-Akara_snack.jpg',
  'amala':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amala_and_Abula.jpg/960px-Amala_and_Abula.jpg',
  'chin chin':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Chin_Chin_Snack.jpg/960px-Chin_Chin_Snack.jpg',
  // ── Fried plantain family (dodo / alloco / kelewele / makemba / bole) ─────
  'kelewele':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Kelewele_Seller_in_Takoradi.jpg/960px-Kelewele_Seller_in_Takoradi.jpg',
  'dodo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Aloko.jpg/960px-Aloko.jpg',
  'alloco':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Aloko.jpg/960px-Aloko.jpg',
  'makemba':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Aloko.jpg/960px-Aloko.jpg',
  'bole':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Aloko.jpg/960px-Aloko.jpg',
  'boli':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Aloko.jpg/960px-Aloko.jpg',
  'beans and plantain':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Aloko.jpg/960px-Aloko.jpg',
  'beans plantain':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Aloko.jpg/960px-Aloko.jpg',
  // ── Ugandan ───────────────────────────────────────────────────────────────
  'rolex':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rolex_wrap.jpg/960px-Rolex_wrap.jpg',
  // ── Nigerian / West African ───────────────────────────────────────────────
  'moi moi':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Moin_Moin.jpg/960px-Moin_Moin.jpg',
  'efo riro':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Efo_Riro_with_fried_mackerel_fishes_and_roasted_cowskin.jpg/960px-Efo_Riro_with_fried_mackerel_fishes_and_roasted_cowskin.jpg',
  'pounded yam':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Iyan_%26_Efo-Riro_%28737053836%29.jpg/960px-Iyan_%26_Efo-Riro_%28737053836%29.jpg',
  'isi ewu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Isi_ewu.jpg/960px-Isi_ewu.jpg',
  'ogbono soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ogbono_soup_with_assorted_meats.jpg/960px-Ogbono_soup_with_assorted_meats.jpg',
  'afang soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Afang_Soup.jpg/960px-Afang_Soup.jpg',
  'abacha':
    'https://upload.wikimedia.org/wikipedia/commons/9/9c/African_salad_mostly_prepared_by_the_southeastern_part_of_Nigeria_especially_in_the_eastern_part._This_meal_is_mostly_prepared_during_festive_seasons_like_new_yam_festival_or_marriage_ceremony.jpg',
  'dan wake':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Hausa_Food_Dan_wake_01.jpg/960px-Hausa_Food_Dan_wake_01.jpg',
  'koose':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Koose_1.png/960px-Koose_1.png',
  // ── Ghanaian ──────────────────────────────────────────────────────────────
  'red red':
    'https://upload.wikimedia.org/wikipedia/commons/8/8b/%22Red_Red%22_wrapped_in_Katemfe_leaves_%28Thaumatococcus_daniellii%29.jpg',
  'kenkey and fried fish':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Kenkey_and_ground_pepper_with_sardine.jpg/960px-Kenkey_and_ground_pepper_with_sardine.jpg',
  'kenkey fried fish':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Kenkey_and_ground_pepper_with_sardine.jpg/960px-Kenkey_and_ground_pepper_with_sardine.jpg',
  'banku and tilapia':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Kenkey_and_ground_pepper_with_sardine.jpg/960px-Kenkey_and_ground_pepper_with_sardine.jpg',
  'banku tilapia':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Kenkey_and_ground_pepper_with_sardine.jpg/960px-Kenkey_and_ground_pepper_with_sardine.jpg',
  // ── East African ──────────────────────────────────────────────────────────
  'nyama choma':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg/960px-Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg',
  'ugali na nyama':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Ugali_%26_Sukuma_Wiki.jpg/960px-Ugali_%26_Sukuma_Wiki.jpg',
  'ugali sukuma wiki':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Ugali_%26_Sukuma_Wiki.jpg/960px-Ugali_%26_Sukuma_Wiki.jpg',
  'ugali and sukuma wiki':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Ugali_%26_Sukuma_Wiki.jpg/960px-Ugali_%26_Sukuma_Wiki.jpg',
  'chapati and beans':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/2_Chapati_warm_and_ready_to_be_eaten.jpg/960px-2_Chapati_warm_and_ready_to_be_eaten.jpg',
  'chipsi mayai':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Chipsi_mayai_%28zee%29.jpg/960px-Chipsi_mayai_%28zee%29.jpg',
  // ── West African (Senegal / Gambia / Mali) ────────────────────────────────
  'thieboudienne':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Thieboudienne.JPG/960px-Thieboudienne.JPG',
  'yassa chicken':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Poulet_Yassa_Chicken_rice_with_onion_sauce.jpg/960px-Poulet_Yassa_Chicken_rice_with_onion_sauce.jpg',
  'fura da nono':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Fura_da_nono.jpg/960px-Fura_da_nono.jpg',
  // ── North African ─────────────────────────────────────────────────────────
  'ful medames':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ful_medames_%28arabic_meal%29.jpg/960px-Ful_medames_%28arabic_meal%29.jpg',
  'brik a l oeuf':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Brikdish.jpg/960px-Brikdish.jpg',
  'chorba frik':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Chorba_frik_algerienne.jpg/960px-Chorba_frik_algerienne.jpg',
  // ── Southern African ──────────────────────────────────────────────────────
  'bunny chow':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Quarter_Mutton_Bunny_Chow.jpg/960px-Quarter_Mutton_Bunny_Chow.jpg',
  'malva pudding':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Malva_Pudding.jpg/960px-Malva_Pudding.jpg',
  'vetkoek and mince':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vetkoek_with_mince-001.jpg/960px-Vetkoek_with_mince-001.jpg',
  // ── Ethiopian / Eritrean ──────────────────────────────────────────────────
  'shiro wot':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Taita_and_shiro.jpg/960px-Taita_and_shiro.jpg',
  // ── Somali / Djiboutian ───────────────────────────────────────────────────
  'bariis iskukaris':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg/960px-Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg',
  // ── Central / Equatorial African ─────────────────────────────────────────
  'kedjenou chicken':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Kedjenou_-_01.jpg/960px-Kedjenou_-_01.jpg',
};

// ─── Foods where Wikipedia returns a WRONG image (different topic) ────────────
// These keys are skipped in the Wikipedia lookup to avoid saving incorrect images.
const BLOCKED_WIKI_KEYS = new Set([
  'gozo',  // Wikipedia finds Gozo island (Malta), not cassava bread
  'masa',  // Wikipedia finds Mexican masa dough, not Hausa masa/waina
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const normalizeFoodKey = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Strip parenthetical qualifiers and country/style suffixes for broader search. */
const getSearchFallbackName = (name = '') =>
  name
    .replace(/\(.*?\)/g, '')
    .replace(/\s+(nigerian|ghanaian|kenyan|ethiopian|egyptian|moroccan|south african|congolese|senegalese|zambian|liberian|ugandan|somali|tunisian|algerian|west african|east african|north african|libyan|sudanese|eritrean|angolan|mozambican|cameroonian|ivorian|chadian|malian|burkinabe|beninese|togolese|guinean)$/i, '')
    .trim();

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) return false;
  try {
    const p = new URL(url.trim());
    return p.protocol === 'http:' || p.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * HEAD-check a URL. Returns { ok, status, reason }.
 * Skips the content-type check for Wikipedia thumb URLs since they
 * sometimes omit it on HEAD requests.
 */
const checkImageUrl = async (url) => {
  if (!isValidUrl(url)) {
    return { ok: false, status: null, reason: 'invalid URL format' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEAD_TIMEOUT_MS);

  try {
    const res = await fetch(url.trim(), {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'PantryPal-AfricanFoodDB/1.0 (contact@pantrypal.dev)' },
      redirect: 'follow',
    });
    clearTimeout(timer);

    if (!VALID_HTTP_STATUSES.has(res.status)) {
      return { ok: false, status: res.status, reason: `HTTP ${res.status}` };
    }

    const ct = (res.headers.get('content-type') || '').toLowerCase();
    // Only reject if a content-type is actually present AND it's not an image.
    // Missing content-type on HEAD is acceptable for Wikipedia CDN.
    if (ct && !ct.startsWith('image/')) {
      return { ok: false, status: res.status, reason: `non-image content-type: ${ct.split(';')[0]}` };
    }

    return { ok: true, status: res.status, reason: 'ok' };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, status: null, reason: err.name === 'AbortError' ? 'timeout' : err.message };
  }
};

/**
 * Try the LOCAL_IMAGE_OVERRIDES entry for this food and validate it.
 * Returns the URL if it passes, or null if it's also broken.
 */
const tryLocalOverride = async (name) => {
  const key = normalizeFoodKey(name);
  const url = LOCAL_IMAGE_OVERRIDES[key];
  if (!url) return null;

  const { ok } = await checkImageUrl(url);
  await sleep(HEAD_DELAY_MS);
  return ok ? url : null;
};

/**
 * Returns true if the Wikipedia image URL looks like a non-food result
 * (logos, brand marks, maps, satellite imagery, etc.).
 */
const isLikelyNonFoodImage = (url = '') => {
  const lower = url.toLowerCase();
  const suspectTerms = [
    'logo', 'from_space', 'satellite', 'flag_of', 'coat_of_arms',
    'map_of', 'location_map', 'signature', 'commons-logo',
  ];
  return suspectTerms.some((t) => lower.includes(t));
};

/**
 * Query Wikipedia by name. Tries the full name first, then a simplified name.
 * Returns a verified image URL or null.
 */
const tryWikipedia = async (foodName) => {
  // First attempt: exact name
  try {
    const wiki = await getWikipediaFoodInfo(foodName);
    if (wiki?.imageUrl && !isLikelyNonFoodImage(wiki.imageUrl)) {
      const { ok } = await checkImageUrl(wiki.imageUrl);
      await sleep(HEAD_DELAY_MS);
      if (ok) return wiki.imageUrl;
    }
  } catch { /* ignore */ }

  await sleep(WIKI_DELAY_MS);

  // Second attempt: simplified name (strip qualifiers)
  const simplified = getSearchFallbackName(foodName);
  if (simplified && simplified.toLowerCase() !== foodName.toLowerCase()) {
    try {
      const wiki2 = await getWikipediaFoodInfo(simplified);
      if (wiki2?.imageUrl && !isLikelyNonFoodImage(wiki2.imageUrl)) {
        const { ok } = await checkImageUrl(wiki2.imageUrl);
        await sleep(HEAD_DELAY_MS);
        if (ok) return wiki2.imageUrl;
      }
    } catch { /* ignore */ }
    await sleep(WIKI_DELAY_MS);
  }

  return null;
};

// ─── Firestore helpers ────────────────────────────────────────────────────────

/**
 * Retry a Firestore operation with exponential backoff.
 * Retries on RESOURCE_EXHAUSTED (quota) and UNAVAILABLE errors.
 */
const withRetry = async (fn, { maxAttempts = 5, baseDelayMs = 2_000 } = {}) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable = err.code === 8 /* RESOURCE_EXHAUSTED */ || err.code === 14 /* UNAVAILABLE */;
      if (!isRetryable || attempt === maxAttempts) throw err;
      const delay = baseDelayMs * 2 ** (attempt - 1) + Math.random() * 500;
      console.warn(`   ⚠️  Firestore quota hit (attempt ${attempt}/${maxAttempts}), retrying in ${Math.round(delay / 1000)}s…`);
      await sleep(delay);
    }
  }
};

/**
 * Fetch all foods from Firestore in pages to avoid quota spikes.
 * Saves result to CACHE_FILE so subsequent runs can use --use-cache.
 */
const fetchAllFoodsFromFirestore = async (pageSize = 100) => {
  const foods = [];
  let lastDoc = null;

  while (true) {
    let query = db.collection(COLLECTIONS.FOODS).orderBy('__name__').limit(pageSize);
    if (lastDoc) query = query.startAfter(lastDoc);

    const snapshot = await withRetry(() => query.get());
    if (snapshot.empty) break;

    snapshot.docs.forEach((doc) => foods.push({ id: doc.id, ...doc.data() }));
    lastDoc = snapshot.docs[snapshot.docs.length - 1];

    if (snapshot.docs.length < pageSize) break;
    await sleep(300); // brief pause between pages
  }

  return foods;
};

/**
 * Load foods: from local cache file if --use-cache, otherwise Firestore.
 * Always writes to cache when fetching from Firestore.
 */
const fetchAllFoods = async () => {
  if (USE_CACHE && !SAVE_CACHE) {
    if (existsSync(CACHE_FILE)) {
      const foods = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
      console.log(`📂 Loaded ${foods.length} foods from local cache (${CACHE_FILE}).`);
      console.log('   (Pass --save-cache to force a fresh Firestore fetch.)\n');
      return foods;
    }
    console.warn('   ⚠️  --use-cache specified but no cache file found. Fetching from Firestore…\n');
  }

  const foods = await fetchAllFoodsFromFirestore();

  // Always save cache after a successful Firestore fetch
  try {
    writeFileSync(CACHE_FILE, JSON.stringify(foods, null, 2), 'utf8');
    console.log(`💾 Saved ${foods.length} foods to local cache (${CACHE_FILE}).\n`);
  } catch (e) {
    console.warn('   ⚠️  Could not write cache file:', e.message);
  }

  return foods;
};

// ─── Main ────────────────────────────────────────────────────────────────────
const validateAndFixImages = async () => {
  console.log('🔍 Validating image URLs in the foods collection…');
  if (DRY_RUN) console.log('   ℹ️  DRY-RUN mode — no Firestore writes will be made.\n');

  const foods = await fetchAllFoods();
  console.log(`📦 Total foods fetched: ${foods.length}\n`);

  let alreadyValid   = 0;
  let skippedEmpty   = 0;
  let totalInvalid   = 0;
  let fixedManual    = 0;
  let fixedLocal     = 0;
  let fixedWiki      = 0;
  let unresolved     = 0;

  const unresolvedFoods = [];

  for (let i = 0; i < foods.length; i++) {
    const food = foods[i];
    const progress = `[${i + 1}/${foods.length}]`;

    // ── No imageUrl at all ──────────────────────────────────────────────────
    if (!food.imageUrl || !String(food.imageUrl).trim()) {
      if (VERBOSE) console.log(`${progress} ⬜ "${food.name}" — no imageUrl (run images:fix first)`);
      skippedEmpty++;
      continue;
    }

    // ── Validate existing URL ───────────────────────────────────────────────
    const { ok, reason } = await checkImageUrl(food.imageUrl);
    await sleep(HEAD_DELAY_MS);

    if (ok) {
      if (VERBOSE) console.log(`${progress} ✅ "${food.name}"`);
      alreadyValid++;
      continue;
    }

    // ── Broken — attempt fix ────────────────────────────────────────────────
    totalInvalid++;
    console.log(`${progress} ❌ "${food.name}" — ${reason}`);

    const key = normalizeFoodKey(food.name || '');
    let newUrl = null;
    let source = null;

    // 1. Manual overrides (no validation needed — confirmed working)
    if (MANUAL_IMAGE_OVERRIDES[key]) {
      newUrl = MANUAL_IMAGE_OVERRIDES[key];
      source = 'manual';
    }

    // 2. Local overrides — validate before using
    if (!newUrl) {
      const localUrl = await tryLocalOverride(food.name);
      if (localUrl) {
        newUrl = localUrl;
        source = 'local';
      }
    }

    // 3. Wikipedia live lookup (verifies the returned URL too)
    if (!newUrl && !BLOCKED_WIKI_KEYS.has(key)) {
      await sleep(WIKI_DELAY_MS);
      const wikiUrl = await tryWikipedia(food.name);
      if (wikiUrl) {
        newUrl = wikiUrl;
        source = 'wikipedia';
      }
    }

    // ── Apply fix or mark unresolved ────────────────────────────────────────
    if (newUrl) {
      console.log(`       🔄 Fixed (${source}): ${newUrl}`);
      if (!DRY_RUN) {
        await withRetry(() =>
          db.collection(COLLECTIONS.FOODS).doc(food.id).update({
            imageUrl: newUrl,
            updatedAt: new Date().toISOString(),
          })
        );
      }
      if (source === 'manual') fixedManual++;
      else if (source === 'local') fixedLocal++;
      else fixedWiki++;
    } else {
      console.log(`       🚫 No valid replacement found.`);
      unresolved++;
      unresolvedFoods.push({ id: food.id, name: food.name, brokenUrl: food.imageUrl });
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════');
  console.log('📊 IMAGE VALIDATION SUMMARY');
  console.log('══════════════════════════════════════════════');
  console.log(`  Total foods checked   : ${foods.length}`);
  console.log(`  ✅ Already valid       : ${alreadyValid}`);
  console.log(`  ⬜ Skipped (no URL)    : ${skippedEmpty}`);
  console.log(`  ❌ Invalid / broken    : ${totalInvalid}`);
  console.log(`     └─ Fixed (manual)  : ${fixedManual}`);
  console.log(`     └─ Fixed (local)   : ${fixedLocal}`);
  console.log(`     └─ Fixed (wiki)    : ${fixedWiki}`);
  console.log(`     └─ Still broken    : ${unresolved}`);
  if (DRY_RUN) console.log('\n  ℹ️  DRY-RUN — no changes written to Firestore.');

  if (unresolvedFoods.length > 0) {
    console.log('\n🔴 STILL UNRESOLVED — manual attention needed:');
    unresolvedFoods.forEach((f) => console.log(`  • [${f.id}] ${f.name}`));
  }

  if (totalInvalid === 0) {
    console.log('\n🎉 All image URLs are valid!');
  }
  console.log('══════════════════════════════════════════════\n');
};

validateAndFixImages()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Script failed:', err);
    process.exit(1);
  });
