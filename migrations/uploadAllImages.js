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
  'Achu Yellow Soup (Cameroon)':        '6hGGLeen1EFlMTaDL93H',
  'Agege Bread and Beans (Nigeria)':    'ElUOkWxrvMz93b9ED0bX',
  'Ampesi (Boiled Plantain \u2013 Ghana)': '7w9c4UijTbUavNz8UAoR',
  'Angu Banana (S\u00e3o Tom\u00e9)':   'tJPrgint4TtslVqh758o',
  'akara':                              'QqS8Daa9llDgHjVgbvtY',
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
