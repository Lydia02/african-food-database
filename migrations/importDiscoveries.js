#!/usr/bin/env node
/**
 * Bulk Import Discovered Dishes
 * Crawls Wikipedia African cuisine categories, scores each article for
 * food-relevance, and imports high-confidence dishes into Firestore.
 *
 * Usage:
 *   node migrations/importDiscoveries.js                    # Dry run (default)
 *   node migrations/importDiscoveries.js --import           # Actually import
 *   node migrations/importDiscoveries.js --import --limit=30
 *   node migrations/importDiscoveries.js --min-confidence=70
 *   node migrations/importDiscoveries.js --depth=1          # Shallower crawl
 */
import 'dotenv/config';
import '../config/firebase.js';
import { bulkImportDiscoveries } from '../services/discoveryService.js';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const param = (name, fallback) => {
  const f = args.find((a) => a.startsWith(`--${name}=`));
  return f ? f.split('=')[1] : fallback;
};

const doImport = flag('import');
const limit = parseInt(param('limit', '50'));
const minConfidence = parseInt(param('min-confidence', '60'));
const depth = parseInt(param('depth', '2'));

console.log('╔════════════════════════════════════════════╗');
console.log('║   Wikipedia Discovery → Firestore Import   ║');
console.log('╚════════════════════════════════════════════╝');
console.log();
console.log(`  Mode:            ${doImport ? '🚀 IMPORT' : '📋 DRY RUN (add --import to save)'}`);
console.log(`  Min confidence:  ${minConfidence}`);
console.log(`  Max to import:   ${limit}`);
console.log(`  Crawl depth:     ${depth}`);
console.log();

try {
  const result = await bulkImportDiscoveries({
    minConfidence,
    limit,
    depth,
    dryRun: !doImport,
  });

  console.log('\n📊 Results:');
  console.log(`   Candidates found:   ${result.total}`);
  console.log(`   ${doImport ? 'Imported' : 'Would import'}:  ${result.imported}`);
  console.log(`   Failed:             ${result.failed}`);

  if (!doImport && result.imported > 0) {
    console.log('\n💡 Run with --import to actually save these to Firestore.');
  }

  console.log('\n✅ Done!');
} catch (err) {
  console.error('❌ Import failed:', err.message);
  process.exit(1);
}
