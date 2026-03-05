/**
 * uploadAndUpdateImages.js
 *
 * Reads migrations/downloads.csv (produced by download_food_images.py),
 * uploads each downloaded image file to Firebase Storage under foods/images/,
 * then updates the matching Firestore food document with the new public URL.
 *
 * Usage:
 *   node migrations/uploadAndUpdateImages.js             # live run
 *   node migrations/uploadAndUpdateImages.js --dry-run   # preview only, no writes
 *
 * npm script:
 *   npm run images:upload
 */

import fs from 'fs';
import path from 'path';
import { createReadStream } from 'fs';
import { db, bucket } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';

const DRY_RUN   = process.argv.includes('--dry-run');
const CSV_PATH  = 'migrations/downloads.csv';
const STORAGE_FOLDER = 'foods/images';

// ---------------------------------------------------------------------------
// Minimal CSV parser (no deps beyond Node built-ins)
// ---------------------------------------------------------------------------
function parseCSV(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = splitCSVLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h.trim()] = (vals[i] || '').trim(); });
    return row;
  });
}

function splitCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

// ---------------------------------------------------------------------------
// Upload one file to Firebase Storage, return public URL
// ---------------------------------------------------------------------------
async function uploadToStorage(localPath, foodId) {
  const ext        = path.extname(localPath);
  const remotePath = `${STORAGE_FOLDER}/${foodId}${ext}`;
  const file       = bucket.file(remotePath);

  await new Promise((resolve, reject) => {
    const stream = file.createWriteStream({
      metadata: {
        contentType: extToMime(ext),
        metadata: { uploadedAt: new Date().toISOString(), source: 'openverse' },
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

function extToMime(ext) {
  const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };
  return map[ext.toLowerCase()] || 'image/jpeg';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ ${CSV_PATH} not found. Run the Python download script first.`);
    process.exit(1);
  }

  const rows = parseCSV(CSV_PATH);
  const toUpload = rows.filter(r => r.status === 'downloaded' && r.image_file && r.id);

  console.log(`📋 Found ${rows.length} rows in CSV`);
  console.log(`📦 ${toUpload.length} successfully downloaded images to upload`);
  console.log(`⏭️  ${rows.filter(r => r.status === 'no_match').length} had no image match`);
  if (DRY_RUN) console.log('🔍 DRY RUN — no writes will happen\n');

  let uploaded = 0, updated = 0, skipped = 0, errors = 0;

  for (let i = 0; i < toUpload.length; i++) {
    const row = toUpload[i];
    const { id, name, image_file } = row;
    const prefix = `[${i + 1}/${toUpload.length}]`;

    if (!fs.existsSync(image_file)) {
      console.log(`${prefix} ⏭  File not found (skip): ${image_file}`);
      skipped++;
      continue;
    }

    try {
      if (DRY_RUN) {
        console.log(`${prefix} 🔍 Would upload: ${name}`);
        console.log(`       file: ${image_file}`);
        continue;
      }

      // 1. Upload to Firebase Storage
      const publicUrl = await uploadToStorage(image_file, id);
      uploaded++;

      // 2. Update Firestore
      await db.collection(COLLECTIONS.FOODS).doc(id).update({
        imageUrl:  publicUrl,
        updatedAt: new Date().toISOString(),
      });
      updated++;

      console.log(`${prefix} ✅ ${name}`);
      console.log(`       → ${publicUrl}`);

    } catch (err) {
      errors++;
      console.error(`${prefix} ❌ ${name}: ${err.message}`);
    }
  }

  console.log('\n=== UPLOAD COMPLETE ===');
  console.log(`✅ Uploaded:  ${uploaded}`);
  console.log(`📝 Updated:   ${updated}`);
  console.log(`⏭  Skipped:   ${skipped}`);
  console.log(`❌ Errors:    ${errors}`);
  console.log(`⚠️  No match:  ${rows.filter(r => r.status === 'no_match').length}`);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  });
