/**
 * foodCacheService.js
 *
 * In-memory cache for the foods collection.
 *
 * WHY: The Firestore free tier allows 50,000 reads/day. Each search request
 * previously read up to 500 documents from Firestore, exhausting the quota
 * within minutes of normal use.  Loading all foods once into memory and
 * serving every read from RAM reduces Firestore reads to ~358 per cache
 * warm-up cycle (once per 6 hours = ~1,432 reads/day total).
 *
 * Write-through: createFood / updateFood / deleteFood still write to Firestore
 * AND immediately update the in-memory cache so reads stay consistent.
 *
 * Public API:
 *   warmUp()          – Load from Firestore and populate cache (idempotent)
 *   getAll()          – Resolve to full sorted array of foods
 *   getById(id)       – Resolve to a single food or null
 *   upsert(id, data)  – Add or replace one entry in the cache (sync)
 *   remove(id)        – Remove one entry from the cache (sync)
 *   invalidate()      – Clear the cache (next getAll/getById will reload)
 *   stats()           – Return cache metadata for /api/health
 */

import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';

// ─── Config ───────────────────────────────────────────────────────────────────
const REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const PAGE_SIZE = 500;

// ─── State ────────────────────────────────────────────────────────────────────
let _map  = null;        // Map<id, food>  – O(1) id lookups
let _list = [];          // Array<food>    – sorted by name, used for list queries
let _lastLoaded = null;  // timestamp of last successful load
let _loadPromise = null; // deduplicates concurrent warm-up calls

// ─── Internal: load from Firestore ───────────────────────────────────────────
const loadFromFirestore = async () => {
  const foods = [];
  let lastDoc = null;
  const col = db.collection(COLLECTIONS.FOODS);

  while (true) {
    let query = col.orderBy('name').limit(PAGE_SIZE);
    if (lastDoc) query = query.startAfter(lastDoc);

    const snap = await query.get();
    if (snap.empty) break;

    snap.docs.forEach((doc) => foods.push({ id: doc.id, ...doc.data() }));
    lastDoc = snap.docs[snap.docs.length - 1];
    if (snap.docs.length < PAGE_SIZE) break;
  }

  return foods;
};

// ─── Internal: rebuild internal structures from an array ─────────────────────
const applyFoods = (foods) => {
  const map = new Map();
  const sorted = [...foods].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  sorted.forEach((f) => map.set(f.id, f));
  _map  = map;
  _list = sorted;
  _lastLoaded = Date.now();
};

// ─── Public: warm up cache ────────────────────────────────────────────────────
export const warmUp = () => {
  // Deduplicate: if a load is already in flight, return the same promise
  if (_loadPromise) return _loadPromise;

  _loadPromise = loadFromFirestore()
    .then((foods) => {
      applyFoods(foods);
      _loadPromise = null;
      console.log(`🗂️  Food cache ready: ${foods.length} foods loaded.`);
    })
    .catch((err) => {
      _loadPromise = null;
      console.error('❌ Food cache warm-up failed:', err.message);
      throw err;
    });

  return _loadPromise;
};

// ─── Internal: ensure cache is populated before serving a request ─────────────
const ensureCache = async () => {
  if (_map && _lastLoaded && Date.now() - _lastLoaded < REFRESH_INTERVAL_MS) return;
  await warmUp();
};

// ─── Public API ───────────────────────────────────────────────────────────────

/** Return the full sorted food array. */
export const getAll = async () => {
  await ensureCache();
  return _list;
};

/** Return a single food by Firestore document ID, or null. */
export const getById = async (id) => {
  await ensureCache();
  return _map.get(id) ?? null;
};

/**
 * Add or replace a food entry in the cache.
 * Call this after any Firestore write so reads stay consistent.
 */
export const upsert = (id, data) => {
  if (!_map) return; // cache not loaded yet — next getAll() will pick it up
  const food = { id, ...data };
  _map.set(id, food);
  // Rebuild sorted list
  _list = Array.from(_map.values()).sort((a, b) =>
    (a.name || '').localeCompare(b.name || '')
  );
};

/**
 * Remove a food entry from the cache.
 * Call this after any Firestore delete.
 */
export const remove = (id) => {
  if (!_map) return;
  _map.delete(id);
  _list = _list.filter((f) => f.id !== id);
};

/** Clear the cache entirely — next request will reload from Firestore. */
export const invalidate = () => {
  _map  = null;
  _list = [];
  _lastLoaded = null;
  console.log('🗑️  Food cache invalidated.');
};

/** Return metadata for health checks. */
export const stats = () => ({
  loaded: _map !== null,
  count: _list.length,
  lastLoaded: _lastLoaded ? new Date(_lastLoaded).toISOString() : null,
  ageMinutes: _lastLoaded ? Math.round((Date.now() - _lastLoaded) / 60_000) : null,
  refreshIntervalHours: REFRESH_INTERVAL_MS / 3_600_000,
});

// ─── Background refresh ───────────────────────────────────────────────────────
// Silently refresh the cache every REFRESH_INTERVAL_MS so data never goes stale.
setInterval(async () => {
  if (!_map) return; // don't trigger a load if the server hasn't warmed up yet
  try {
    console.log('🔄 Refreshing food cache in background…');
    const foods = await loadFromFirestore();
    applyFoods(foods);
    console.log(`✅ Food cache refreshed: ${foods.length} foods.`);
  } catch (err) {
    console.error('⚠️  Background food cache refresh failed:', err.message);
    // Keep serving the existing stale cache rather than crashing
  }
}, REFRESH_INTERVAL_MS);

export default { warmUp, getAll, getById, upsert, remove, invalidate, stats };
