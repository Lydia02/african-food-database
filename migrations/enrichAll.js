/**
 * Bulk Enrichment Migration
 * Enriches all existing foods with nutrition data from USDA + Open Food Facts,
 * and adds Wikipedia descriptions where missing.
 *
 * Usage:
 *   node migrations/enrichAll.js                # Full enrichment
 *   node migrations/enrichAll.js --dry-run      # Preview without changes
 *   node migrations/enrichAll.js --nutrition     # Nutrition only
 *   node migrations/enrichAll.js --wikipedia     # Wikipedia only
 *   node migrations/enrichAll.js --discover      # Discover missing dishes
 */
import { bulkEnrichNutrition, bulkEnrichFromWikipedia } from '../services/enrichmentService.js';
import { discoverMissingDishes } from '../services/discoveryService.js';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const nutritionOnly = args.includes('--nutrition');
const wikiOnly = args.includes('--wikipedia');
const discoverOnly = args.includes('--discover');

const run = async () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   African Food DB — Bulk Enrichment    ║');
  console.log('╚════════════════════════════════════════╝');
  if (dryRun) console.log('⚠️  DRY RUN MODE — no changes will be made\n');

  // ── Discover missing dishes ──────────────────────────────────
  if (discoverOnly) {
    console.log('\n🌍 Discovering missing African dishes from Wikipedia...');
    const missing = await discoverMissingDishes({ depth: 2, maxResults: 200, enrich: true });
    console.log(`\n📊 Found ${missing.length} dishes NOT in our database:\n`);
    missing.slice(0, 50).forEach((d, i) => {
      console.log(`  ${i + 1}. ${d.title}${d.description ? ' — ' + d.description.slice(0, 80) + '...' : ''}`);
    });
    if (missing.length > 50) console.log(`  ... and ${missing.length - 50} more`);
    console.log('\n💡 Use POST /api/external/discover/import to add any of these.');
    process.exit(0);
  }

  // ── Nutrition enrichment ─────────────────────────────────────
  if (!wikiOnly) {
    console.log('\n🥗 PHASE 1: Nutrition Enrichment (USDA + Open Food Facts)\n');
    const nutritionResult = await bulkEnrichNutrition({ dryRun });
    console.log('\n📊 Nutrition Results:');
    console.log(`   Total foods:        ${nutritionResult.total}`);
    console.log(`   Needed enrichment:  ${nutritionResult.needsEnrichment}`);
    console.log(`   ✅ Enriched:        ${nutritionResult.enriched}`);
    console.log(`   ⏭️  Skipped:         ${nutritionResult.skipped}`);
    console.log(`   ❌ Failed:          ${nutritionResult.failed}`);
  }

  // ── Wikipedia enrichment ─────────────────────────────────────
  if (!nutritionOnly) {
    console.log('\n📖 PHASE 2: Wikipedia Description Enrichment\n');
    const wikiResult = await bulkEnrichFromWikipedia({ dryRun });
    console.log('\n📊 Wikipedia Results:');
    console.log(`   Total foods:        ${wikiResult.total}`);
    console.log(`   Needed enrichment:  ${wikiResult.needsEnrichment}`);
    console.log(`   ✅ Enriched:        ${wikiResult.enriched}`);
    console.log(`   ⏭️  Skipped:         ${wikiResult.skipped}`);
    console.log(`   ❌ Failed:          ${wikiResult.failed}`);
  }

  console.log('\n✅ Enrichment complete!');
  process.exit(0);
};

run().catch((err) => {
  console.error('💥 Enrichment failed:', err);
  process.exit(1);
});
