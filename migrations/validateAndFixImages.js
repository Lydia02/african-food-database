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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'dodo fried plantain':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'alloco':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'alloco fried plantain':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'makemba':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'makemba fried plantain':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'bole':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'bole roasted plantain':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'boli':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'boli roasted plantain':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'beans and plantain':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg',
  'beans plantain':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg',
  'beans plantain ewa dodo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg',
  'beans plantain burundi style':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Beans_plantain.jpg/800px-Beans_plantain.jpg',
  'plantain porridge':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  // ── Ugandan ───────────────────────────────────────────────────────────────
  'rolex':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rolex_Uganda.jpg/800px-Rolex_Uganda.jpg',
  'rolex rolled eggs':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rolex_Uganda.jpg/800px-Rolex_Uganda.jpg',
  'rolex chapati egg roll':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rolex_Uganda.jpg/800px-Rolex_Uganda.jpg',
  // ── Nigerian / West African ───────────────────────────────────────────────
  'moi moi':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Moin_Moin.jpg/800px-Moin_Moin.jpg',
  'moi moi bean pudding':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Moin_Moin.jpg/800px-Moin_Moin.jpg',
  'moi moi and custard pap':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Moin_Moin.jpg/800px-Moin_Moin.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg/800px-Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg',
  'ugali na nyama':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'ugali sukuma wiki':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'ugali and sukuma wiki':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'ugali sukuma wiki':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'chapati and beans':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Chapati_beans.jpg/800px-Chapati_beans.jpg',
  'chipsi mayai':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Chipsi_mayai_%28zee%29.jpg/800px-Chipsi_mayai_%28zee%29.jpg',
  'chipsi mayai chips omelette':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Chipsi_mayai_%28zee%29.jpg/800px-Chipsi_mayai_%28zee%29.jpg',
  'pilau':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pilau_kenya.jpg/800px-Pilau_kenya.jpg',
  'pilau kenyan spiced rice':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pilau_kenya.jpg/800px-Pilau_kenya.jpg',
  'ndizi nyama':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'ndizi nyama plantain meat':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'wali na maharage':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg',
  'zanzibar pilau':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pilau_kenya.jpg/800px-Pilau_kenya.jpg',
  'zanzibar pizza':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/ZanzibarPizza.jpg/800px-ZanzibarPizza.jpg',
  'mahindi choma':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Roasted_corn_Kenya.jpg/800px-Roasted_corn_Kenya.jpg',
  'mahindi choma roasted corn':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Roasted_corn_Kenya.jpg/800px-Roasted_corn_Kenya.jpg',
  // ── West African (Senegal / Gambia / Mali) ────────────────────────────────
  'thieboudienne':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Thieboudienne.JPG/960px-Thieboudienne.JPG',
  'yassa chicken':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Poulet_Yassa_Chicken_rice_with_onion_sauce.jpg/960px-Poulet_Yassa_Chicken_rice_with_onion_sauce.jpg',
  'fura da nono':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Fura_da_nono.jpg/800px-Fura_da_nono.jpg',
  // ── North African ─────────────────────────────────────────────────────────
  'ful medames':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ful_medames_%28arabic_meal%29.jpg/800px-Ful_medames_%28arabic_meal%29.jpg',
  'ful medames and bread':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ful_medames_%28arabic_meal%29.jpg/800px-Ful_medames_%28arabic_meal%29.jpg',
  'ful medames sudan':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ful_medames_%28arabic_meal%29.jpg/800px-Ful_medames_%28arabic_meal%29.jpg',
  'ful eritrean fava beans':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ful_medames_%28arabic_meal%29.jpg/800px-Ful_medames_%28arabic_meal%29.jpg',
  'brik a l oeuf':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Brikdish.jpg/960px-Brikdish.jpg',
  'chorba frik':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Chorba_frik_algerienne.jpg/960px-Chorba_frik_algerienne.jpg',
  // ── Southern African ──────────────────────────────────────────────────────
  'bunny chow':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Quarter_Mutton_Bunny_Chow.jpg/800px-Quarter_Mutton_Bunny_Chow.jpg',
  'malva pudding':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Malva_Pudding.jpg/960px-Malva_Pudding.jpg',
  'vetkoek and mince':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vetkoek_mince.jpg/800px-Vetkoek_mince.jpg',
  // ── Ethiopian / Eritrean ──────────────────────────────────────────────────
  'shiro wot':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Taita_and_shiro.jpg/800px-Taita_and_shiro.jpg',
  'shiro wat':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Taita_and_shiro.jpg/800px-Taita_and_shiro.jpg',
  'misir wot':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Misir_wot.jpg/800px-Misir_wot.jpg',
  'misir wot red lentil stew':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Misir_wot.jpg/800px-Misir_wot.jpg',
  'tibs':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tibs_ethiopian.jpg/800px-Tibs_ethiopian.jpg',
  'tibs sauteed meat':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tibs_ethiopian.jpg/800px-Tibs_ethiopian.jpg',
  'injera with doro wat':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Injera_sitting.jpg/800px-Injera_sitting.jpg',
  'injera and firfir':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Firfir_ethiopian.jpg/800px-Firfir_ethiopian.jpg',
  'ethiopian coffee ceremony':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Ethiopian_coffee_ceremony.jpg/800px-Ethiopian_coffee_ceremony.jpg',
  'kitfo ethiopian steak tartare':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Kitfo.jpg/800px-Kitfo.jpg',
  'kitfo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Kitfo.jpg/800px-Kitfo.jpg',
  // ── Somali / Djiboutian ───────────────────────────────────────────────────
  'bariis iskukaris':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg/800px-Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg',
  'bariis iskukaris somali spiced rice':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg/800px-Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg',
  'canjeero':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Canjeero_Somali.jpg/800px-Canjeero_Somali.jpg',
  'canjeero somali pancake':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Canjeero_Somali.jpg/800px-Canjeero_Somali.jpg',
  'skoudehkaris':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg/800px-Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg',
  'skoudehkaris djibouti spiced rice':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg/800px-Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg',
  'suqaar':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tibs_ethiopian.jpg/800px-Tibs_ethiopian.jpg',
  'suqaar somali sauteed meat':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tibs_ethiopian.jpg/800px-Tibs_ethiopian.jpg',
  'cambuulo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg/800px-Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg',
  'cambuulo adzuki bean dessert':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg/800px-Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg',
  'walwal':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tibs_ethiopian.jpg/800px-Tibs_ethiopian.jpg',
  'walwal south sudan stew':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tibs_ethiopian.jpg/800px-Tibs_ethiopian.jpg',
  // ── Central / Equatorial African ─────────────────────────────────────────
  'kedjenou chicken':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Kedjenou_-_01.jpg/800px-Kedjenou_-_01.jpg',
  'pondu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'pondu saka saka':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'muamba de galinha':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Poulet_moambe.jpg/800px-Poulet_moambe.jpg',
  'moambe chicken':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Poulet_moambe.jpg/800px-Poulet_moambe.jpg',
  'moambe chicken poulet moambe':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Poulet_moambe.jpg/800px-Poulet_moambe.jpg',
  'poulet moambe':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Poulet_moambe.jpg/800px-Poulet_moambe.jpg',
  'ndole and plantain':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Ndole_plantain.jpg/800px-Ndole_plantain.jpg',
  'poulet dg':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Poulet_DG.jpg/800px-Poulet_DG.jpg',
  'poulet dg director general chicken':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Poulet_DG.jpg/800px-Poulet_DG.jpg',
  'eru soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Eru_soup.jpg/800px-Eru_soup.jpg',
  'koki beans':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Eru_soup.jpg/800px-Eru_soup.jpg',
  'liboke ya mbisi':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'calulu de peixe':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'calulu sao-tomense':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'mwambe':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Poulet_moambe.jpg/800px-Poulet_moambe.jpg',
  'mwambe palm butter sauce':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Poulet_moambe.jpg/800px-Poulet_moambe.jpg',
  'fufu and pondu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'fufu pondu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'fufu light soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pounded_yam.jpg/800px-Pounded_yam.jpg',
  'fufu and light soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pounded_yam.jpg/800px-Pounded_yam.jpg',
  'fufu peanut soup togo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pounded_yam.jpg/800px-Pounded_yam.jpg',
  'mikate':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/800px-Puff-puff3.jpg',
  'mikate congolese doughnuts':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/800px-Puff-puff3.jpg',
  'makala':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/800px-Puff-puff3.jpg',
  'makala congolese doughnut':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/800px-Puff-puff3.jpg',
  'kanda':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'kanda meatballs in sauce':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'baton de manioc':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Baton_de_manioc.jpg/800px-Baton_de_manioc.jpg',
  'pate noire sauce gombo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'pepesoup equatoguinean':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Pepper_soup.jpg/800px-Pepper_soup.jpg',
  'babenda':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  // ── Ghanaian ──────────────────────────────────────────────────────────────
  'ghanaian fried rice':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Nigerian_fried_rice.jpg/800px-Nigerian_fried_rice.jpg',
  'fried rice':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Nigerian_fried_rice.jpg/800px-Nigerian_fried_rice.jpg',
  'attieke':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Attieke_fish.jpg/800px-Attieke_fish.jpg',
  'attieke cassava couscous':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Attieke_fish.jpg/800px-Attieke_fish.jpg',
  'attieke and fried fish':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Attieke_fish.jpg/800px-Attieke_fish.jpg',
  'garba':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Attieke_fish.jpg/800px-Attieke_fish.jpg',
  'garba attieke with tuna':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Attieke_fish.jpg/800px-Attieke_fish.jpg',
  'ampesi':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'ampesi boiled yam plantain with kontomire':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'bofrot':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/800px-Puff-puff3.jpg',
  'bofrot ghanaian doughnut':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/800px-Puff-puff3.jpg',
  'klui-klui':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Koose_1.png/800px-Koose_1.png',
  'klui klui peanut sticks':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Koose_1.png/800px-Koose_1.png',
  'koose bean cake and koko':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Koose_1.png/800px-Koose_1.png',
  'roasted corn':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Roasted_corn_Kenya.jpg/800px-Roasted_corn_Kenya.jpg',
  // ── Nigerian ──────────────────────────────────────────────────────────────
  'eba':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eba_and_soup.jpg/800px-Eba_and_soup.jpg',
  'eba garri':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eba_and_soup.jpg/800px-Eba_and_soup.jpg',
  'eba and egusi soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eba_and_soup.jpg/800px-Eba_and_soup.jpg',
  'garri and groundnut':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Garri_groundnut.jpg/800px-Garri_groundnut.jpg',
  'ofe nsala':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Igbo_cuisine%2C_ofe_nsala.jpg/800px-Igbo_cuisine%2C_ofe_nsala.jpg',
  'ofe nsala white soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Igbo_cuisine%2C_ofe_nsala.jpg/800px-Igbo_cuisine%2C_ofe_nsala.jpg',
  'ofe onugbu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Igbo_cuisine%2C_ofe_nsala.jpg/800px-Igbo_cuisine%2C_ofe_nsala.jpg',
  'ofe onugbu bitter leaf soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Igbo_cuisine%2C_ofe_nsala.jpg/800px-Igbo_cuisine%2C_ofe_nsala.jpg',
  'ofe oha':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Igbo_cuisine%2C_ofe_nsala.jpg/800px-Igbo_cuisine%2C_ofe_nsala.jpg',
  'ofe akwu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ogbono_soup_with_assorted_meats.jpg/800px-Ogbono_soup_with_assorted_meats.jpg',
  'ofe akwu banga soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ogbono_soup_with_assorted_meats.jpg/800px-Ogbono_soup_with_assorted_meats.jpg',
  'ogbono soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Ogbono_soup.jpg/800px-Ogbono_soup.jpg',
  'ewedu soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Ewedu_soup.jpg/800px-Ewedu_soup.jpg',
  'gbegiri soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amala_and_Abula.jpg/800px-Amala_and_Abula.jpg',
  'tuwo shinkafa':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Iyan_%26_Efo-Riro_%28737053836%29.jpg/800px-Iyan_%26_Efo-Riro_%28737053836%29.jpg',
  'tuwo shinkafa':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Iyan_%26_Efo-Riro_%28737053836%29.jpg/800px-Iyan_%26_Efo-Riro_%28737053836%29.jpg',
  'miyan kuka':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amala_and_Abula.jpg/800px-Amala_and_Abula.jpg',
  'miyan kuka baobab soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amala_and_Abula.jpg/800px-Amala_and_Abula.jpg',
  'miyan taushe':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Miyan_taushe.jpg/800px-Miyan_taushe.jpg',
  'miyan taushe pumpkin soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Miyan_taushe.jpg/800px-Miyan_taushe.jpg',
  'nigerian chicken stew':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Efo_Riro_with_fried_mackerel_fishes_and_roasted_cowskin.jpg/800px-Efo_Riro_with_fried_mackerel_fishes_and_roasted_cowskin.jpg',
  'pepper soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Pepper_soup.jpg/800px-Pepper_soup.jpg',
  'edikang ikong':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Edikang_ikong.jpg/800px-Edikang_ikong.jpg',
  'ekpang nkukwo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Edikang_ikong.jpg/800px-Edikang_ikong.jpg',
  'afang soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Afang_Soup.jpg/800px-Afang_Soup.jpg',
  'ogi pap and akara':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Akara_and_pap.jpg/800px-Akara_and_pap.jpg',
  'ogi and akara':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Akara_and_pap.jpg/800px-Akara_and_pap.jpg',
  'pap':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Akara_and_pap.jpg/800px-Akara_and_pap.jpg',
  'pap ogi akamu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Akara_and_pap.jpg/800px-Akara_and_pap.jpg',
  'pap en vleis':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Akara_and_pap.jpg/800px-Akara_and_pap.jpg',
  'pap wors and chakalaka':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Pap_wors_chakalaka.jpg/800px-Pap_wors_chakalaka.jpg',
  'dundun':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amala_and_Abula.jpg/800px-Amala_and_Abula.jpg',
  'dundun fried yam':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amala_and_Abula.jpg/800px-Amala_and_Abula.jpg',
  'ewa agoyin':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg',
  'ewa agoyin mashed beans':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg',
  'agege bread and ewa agoyin':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg',
  'rice and beans':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg',
  'rice and beans nigerian':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg',
  'coconut rice':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Nigerian_fried_rice.jpg/800px-Nigerian_fried_rice.jpg',
  'indomie jollof':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jollof_rice_in_a_white_bowl.jpg/800px-Jollof_rice_in_a_white_bowl.jpg',
  'indomie and egg':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jollof_rice_in_a_white_bowl.jpg/800px-Jollof_rice_in_a_white_bowl.jpg',
  'native jollof':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jollof_rice_in_a_white_bowl.jpg/800px-Jollof_rice_in_a_white_bowl.jpg',
  'native jollof iwuk edesi':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jollof_rice_in_a_white_bowl.jpg/800px-Jollof_rice_in_a_white_bowl.jpg',
  'bread and egg':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Akara_snack.jpg/800px-Akara_snack.jpg',
  'bread and egg nigerian':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Akara_snack.jpg/800px-Akara_snack.jpg',
  'bread egg':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Akara_snack.jpg/800px-Akara_snack.jpg',
  'cereal and milk':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Akara_snack.jpg/800px-Akara_snack.jpg',
  'cereal and milk nigerian style':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Akara_snack.jpg/800px-Akara_snack.jpg',
  'yam and egg sauce':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amala_and_Abula.jpg/800px-Amala_and_Abula.jpg',
  'peppered gizzard':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/800px-SuyavarietiesTX.JPG',
  'peppered snail':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/800px-SuyavarietiesTX.JPG',
  'fisherman soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Pepper_soup.jpg/800px-Pepper_soup.jpg',
  'ekuru with stew':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Moin_Moin.jpg/800px-Moin_Moin.jpg',
  'chapman':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Chapman_drink_Nigeria.jpg/800px-Chapman_drink_Nigeria.jpg',
  'zobo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Zobo_drink.jpg/800px-Zobo_drink.jpg',
  'zobo hibiscus drink':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Zobo_drink.jpg/800px-Zobo_drink.jpg',
  'yam porridge':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Asaro_yam_porridge.jpg/800px-Asaro_yam_porridge.jpg',
  'yam porridge asaro':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Asaro_yam_porridge.jpg/800px-Asaro_yam_porridge.jpg',
  'okro soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ogbono_soup_with_assorted_meats.jpg/800px-Ogbono_soup_with_assorted_meats.jpg',
  'okro soup ila asepo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ogbono_soup_with_assorted_meats.jpg/800px-Ogbono_soup_with_assorted_meats.jpg',
  'groundnut soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Groundnut_soup_ghana.jpg/800px-Groundnut_soup_ghana.jpg',
  'groundnut soup sierra leone':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Groundnut_soup_ghana.jpg/800px-Groundnut_soup_ghana.jpg',
  'groundnut sauce uganda':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Groundnut_soup_ghana.jpg/800px-Groundnut_soup_ghana.jpg',
  'dambu nama':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/800px-SuyavarietiesTX.JPG',
  'dambu nama shredded meat':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/800px-SuyavarietiesTX.JPG',
  'cassava leaf stew':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  // ── North African ─────────────────────────────────────────────────────────
  'koshari':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Koshary.jpg/800px-Koshary.jpg',
  'kushari':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Koshary.jpg/800px-Koshary.jpg',
  'taameya':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Taameya_Egyptian_falafel.jpg/800px-Taameya_Egyptian_falafel.jpg',
  'taameya egyptian falafel':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Taameya_Egyptian_falafel.jpg/800px-Taameya_Egyptian_falafel.jpg',
  'taamiya egyptian falafel':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Taameya_Egyptian_falafel.jpg/800px-Taameya_Egyptian_falafel.jpg',
  'asida libyan':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Asida.jpg/800px-Asida.jpg',
  'asida':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Asida.jpg/800px-Asida.jpg',
  'bazin':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bazeen.jpg/800px-Bazeen.jpg',
  'sharba libiya':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Chorba_frik_algerienne.jpg/800px-Chorba_frik_algerienne.jpg',
  'sharba libiya libyan soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Chorba_frik_algerienne.jpg/800px-Chorba_frik_algerienne.jpg',
  'mahshi':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Mahshi_egypt.jpg/800px-Mahshi_egypt.jpg',
  'mahshi stuffed vegetables':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Mahshi_egypt.jpg/800px-Mahshi_egypt.jpg',
  'umm ali':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Konafa.jpg/800px-Konafa.jpg',
  'umm ali egyptian bread pudding':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Konafa.jpg/800px-Konafa.jpg',
  'molokhia':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Molokhia-9.jpg/800px-Molokhia-9.jpg',
  'moroccan mint tea':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Moroccan_Mint_Tea.jpg/800px-Moroccan_Mint_Tea.jpg',
  'msemen and mint tea':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Moroccan_Mint_Tea.jpg/800px-Moroccan_Mint_Tea.jpg',
  'mechoui':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Mechoui.jpg/800px-Mechoui.jpg',
  'mechoui roast lamb':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Mechoui.jpg/800px-Mechoui.jpg',
  'chicken tagine with preserved lemons olives':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Chicken_tagine.jpg/800px-Chicken_tagine.jpg',
  'couscous and lamb tagine':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Couscous-1.jpg/800px-Couscous-1.jpg',
  'couscous royale':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Couscous-1.jpg/800px-Couscous-1.jpg',
  'couscous tunisien':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Couscous-1.jpg/800px-Couscous-1.jpg',
  'couscous algerois':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Couscous-1.jpg/800px-Couscous-1.jpg',
  'makroud':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Makroud.jpg/800px-Makroud.jpg',
  'makroud semolina date cookies':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Makroud.jpg/800px-Makroud.jpg',
  'maakouda':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Maakouda.jpg/800px-Maakouda.jpg',
  'maakouda potato fritters':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Maakouda.jpg/800px-Maakouda.jpg',
  'daraba':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ogbono_soup_with_assorted_meats.jpg/800px-Ogbono_soup_with_assorted_meats.jpg',
  'daraba okra stew':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ogbono_soup_with_assorted_meats.jpg/800px-Ogbono_soup_with_assorted_meats.jpg',
  // ── Southern African ──────────────────────────────────────────────────────
  'sadza ne nyama':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Sadza_ne_nyama.jpg/800px-Sadza_ne_nyama.jpg',
  'sadza and muriwo ne nyama':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Sadza_ne_nyama.jpg/800px-Sadza_ne_nyama.jpg',
  'braai':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Braai.jpg/800px-Braai.jpg',
  'braai south african bbq':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Braai.jpg/800px-Braai.jpg',
  'gatsby sandwich':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Gatsby_sandwich.jpg/800px-Gatsby_sandwich.jpg',
  'gatsby':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Gatsby_sandwich.jpg/800px-Gatsby_sandwich.jpg',
  'papa':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Papa_moroho.jpg/800px-Papa_moroho.jpg',
  'papa lesotho porridge':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Papa_moroho.jpg/800px-Papa_moroho.jpg',
  'kapana':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg/800px-Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg',
  'kapana street meat':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg/800px-Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg',
  'madora':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Mopane_worms.jpg/800px-Mopane_worms.jpg',
  'madora mopane worms':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Mopane_worms.jpg/800px-Mopane_worms.jpg',
  'bogobe':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Bogobe_sorghum.jpg/800px-Bogobe_sorghum.jpg',
  'bogobe sorghum porridge':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Bogobe_sorghum.jpg/800px-Bogobe_sorghum.jpg',
  'sishwala':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Bogobe_sorghum.jpg/800px-Bogobe_sorghum.jpg',
  'muboora':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'muboora pumpkin leaves':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'oshifima with omagungu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'dovi':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Maf%C3%A9.jpg/800px-Maf%C3%A9.jpg',
  'dovi peanut butter stew':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Maf%C3%A9.jpg/800px-Maf%C3%A9.jpg',
  'nshima with ifisashi':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'nshima kapenta and chibwabwa':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'nsima with chambo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'kondowole':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'kondowole cassava nsima':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'vitumbuwa':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/800px-Puff-puff3.jpg',
  'vitumbuwa zambian fritters':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/800px-Puff-puff3.jpg',
  'dumboy':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pounded_yam.jpg/800px-Pounded_yam.jpg',
  'dumboy liberian fufu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pounded_yam.jpg/800px-Pounded_yam.jpg',
  'angu de banana':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'xima and caril de amendoim':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  // ── Madagascar / Indian Ocean ─────────────────────────────────────────────
  'vary amin anana':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'ladob':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'ladob sweet banana':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'kat kat banane':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg',
  'rougaille':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Shakshouka.jpg/800px-Shakshouka.jpg',
  'rougaille tomato creole':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Shakshouka.jpg/800px-Shakshouka.jpg',
  'dholl puri':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/2_Chapati_warm_and_ready_to_be_eaten.jpg/800px-2_Chapati_warm_and_ready_to_be_eaten.jpg',
  'langouste a la vanille':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  // ── Cameroon / Central ────────────────────────────────────────────────────
  'koklo meme':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg/800px-Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg',
  'koklo meme grilled chicken':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg/800px-Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg',
  'nyembwe chicken':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Poulet_moambe.jpg/800px-Poulet_moambe.jpg',
  // ── Cross-regional / misc ─────────────────────────────────────────────────
  'ofada rice ayamase stew':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jollof_rice_in_a_white_bowl.jpg/800px-Jollof_rice_in_a_white_bowl.jpg',
  'sambusa':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Samosa-and-Chatni.jpg/800px-Samosa-and-Chatni.jpg',
  'sambusa ethiopian':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Samosa-and-Chatni.jpg/800px-Samosa-and-Chatni.jpg',
  'piri piri chicken':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Peri_peri_chicken.jpg/800px-Peri_peri_chicken.jpg',
  'benachin':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Benachin.jpg/800px-Benachin.jpg',
  'benachin one-pot rice':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Benachin.jpg/800px-Benachin.jpg',
  'achu soup and fufu yellow soup':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pounded_yam.jpg/800px-Pounded_yam.jpg',
  'achu soup fufu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pounded_yam.jpg/800px-Pounded_yam.jpg',
  'mukimo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'matoke and groundnut sauce':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Matooke_to_the_market.jpg/800px-Matooke_to_the_market.jpg',
  'fouti':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/To_burkina.jpg/800px-To_burkina.jpg',
  'fouti fonio porridge':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/To_burkina.jpg/800px-To_burkina.jpg',
  'succotash de mariscos':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg',
  'caldo de mancarra':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Maf%C3%A9.jpg/800px-Maf%C3%A9.jpg',
  'caril de camarao':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'mbika':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
  'mbika pumpkin seed stew':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg',
};

// ─── Foods where Wikipedia returns a WRONG image (different topic) ────────────
// These keys are skipped in the Wikipedia lookup to avoid saving incorrect images.
const BLOCKED_WIKI_KEYS = new Set([
  'gozo',         // Wikipedia finds Gozo island (Malta), not cassava bread
  'masa',         // Wikipedia finds Mexican masa dough, not Hausa masa/waina
  'rolex',        // Wikipedia finds Rolex watch logo, not Ugandan chapati roll
  'dodo',         // Wikipedia finds Oxford Dodo (extinct bird), not fried plantain
  'gatsby',       // Wikipedia finds the novel/film, not the SA sandwich
  'chapman',      // Wikipedia finds unrelated people, not Nigerian cocktail
  'boule',        // Wikipedia finds French pétanque ball, not millet ball
  'to',           // Too short — Wikipedia finds unrelated pages
  'pap',          // Wikipedia finds smear test, not maize porridge
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
