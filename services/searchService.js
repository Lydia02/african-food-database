import * as cache from './foodCacheService.js';


/**
 * Levenshtein distance between two strings (edit distance)
 */
const levenshtein = (a, b) => {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
};

/**
 * Calculate similarity score between two strings (0–1, higher is better)
 */
const similarity = (a, b) => {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
};

/**
 * Check if query is a substring of target or vice versa
 */
const substringMatch = (query, target) => {
  return target.includes(query) || query.includes(target);
};

/**
 * Score a food document against a search query
 * Returns a score 0–100 (higher = more relevant)
 */
const scoreFoodMatch = (food, query) => {
  const q = query.toLowerCase().trim();
  let bestScore = 0;

  // Exact name match → 100
  const name = (food.name || '').toLowerCase();
  if (name === q) return 100;

  // Name starts with query → 90
  if (name.startsWith(q)) bestScore = Math.max(bestScore, 90);

  // Name contains query → 80
  if (name.includes(q)) bestScore = Math.max(bestScore, 80);

  // localName exact / contains
  const localName = (food.localName || '').toLowerCase();
  if (localName === q) return 95;
  if (localName.includes(q)) bestScore = Math.max(bestScore, 78);

  // Alias exact match → 92, alias contains → 75
  const aliases = (food.aliases || []).map((a) => a.toLowerCase());
  for (const alias of aliases) {
    if (alias === q) return 92;
    if (alias.includes(q) || q.includes(alias)) {
      bestScore = Math.max(bestScore, 75);
    }
  }

  // searchTerms match
  const terms = food.searchTerms || [];
  for (const term of terms) {
    if (term === q) { bestScore = Math.max(bestScore, 85); break; }
    if (substringMatch(q, term)) { bestScore = Math.max(bestScore, 70); }
  }

  // Tags match
  const tags = (food.tags || []).map((t) => t.toLowerCase());
  for (const tag of tags) {
    if (tag === q) { bestScore = Math.max(bestScore, 72); break; }
    if (tag.includes(q)) { bestScore = Math.max(bestScore, 60); }
  }

  // Category match
  const categories = food.categories || [];
  for (const cat of categories) {
    if (cat.toLowerCase().includes(q)) { bestScore = Math.max(bestScore, 55); break; }
  }

  // Country / region match
  if ((food.countryName || '').toLowerCase().includes(q)) bestScore = Math.max(bestScore, 50);
  if ((food.region || '').toLowerCase().includes(q)) bestScore = Math.max(bestScore, 48);

  // Description contains query
  if ((food.description || '').toLowerCase().includes(q)) bestScore = Math.max(bestScore, 40);

  // Fuzzy name match via Levenshtein
  const nameSim = similarity(q, name);
  if (nameSim >= 0.7) bestScore = Math.max(bestScore, Math.round(nameSim * 70));

  // Fuzzy alias match
  for (const alias of aliases) {
    const aliaSim = similarity(q, alias);
    if (aliaSim >= 0.7) {
      bestScore = Math.max(bestScore, Math.round(aliaSim * 65));
    }
  }

  // Fuzzy per-word match (e.g. "jollof" matches "jollof rice")
  const nameWords = name.split(/[\s\-&,]+/);
  for (const word of nameWords) {
    if (word.length < 2) continue;
    const wordSim = similarity(q, word);
    if (wordSim >= 0.75) bestScore = Math.max(bestScore, Math.round(wordSim * 68));
  }

  return bestScore;
};

/**
 * Smart Search — fuzzy matching across name, localName, aliases, tags, searchTerms
 *
 * Strategy: pull candidate docs from Firestore (limited set), then rank in-memory.
 * For small-medium collections this works well. For very large collections,
 * consider Algolia or Typesense.
 *
 * @param {string} query - user's search text
 * @param {object} options - { page, limit, category, region, countryId, minScore }
 * @returns {{ results, totalMatches, query, page, limit }}
 */
export const smartSearch = async (query, {
  page = 1,
  limit = 20,
  category = '',
  region = '',
  countryId = '',
  minScore = 30,
} = {}) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return { results: [], totalMatches: 0, query: '', page, limit };
  }

  const q = query.trim().toLowerCase();

  // Step 1: Load all candidates from in-memory cache (zero Firestore reads)
  let candidates = await cache.getAll();

  // Apply optional filters in memory
  if (countryId)  candidates = candidates.filter((f) => f.countryId === countryId);
  else if (region) candidates = candidates.filter((f) => f.region === region);
  else if (category) candidates = candidates.filter((f) => (f.categories || []).includes(category));

  // Step 2: Score every candidate
  const scored = candidates
    .map((food) => ({
      ...food,
      _score: scoreFoodMatch(food, q),
    }))
    .filter((f) => f._score >= minScore)
    .sort((a, b) => b._score - a._score || a.name.localeCompare(b.name));

  // Step 3: Paginate
  const totalMatches = scored.length;
  const start = (page - 1) * limit;
  const results = scored.slice(start, start + limit).map(({ _score, ...food }) => ({
    ...food,
    relevance: _score,
  }));

  return { results, totalMatches, query: q, page, limit };
};

/**
 * Autocomplete — lightweight prefix search on name + aliases
 * Returns up to `limit` suggestions quickly.
 */
export const autocomplete = async (query, { limit = 10 } = {}) => {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim().toLowerCase();
  const all = await cache.getAll();

  const suggestions = [];
  const seen = new Set();

  for (const food of all) {
    if (suggestions.length >= limit) break;

    const name    = (food.name || '').toLowerCase();
    const local   = (food.localName || '').toLowerCase();
    const aliases = (food.aliases || []).map((a) => a.toLowerCase());
    const terms   = food.searchTerms || [];

    const matches =
      name.startsWith(q) ||
      name.includes(q) ||
      local.startsWith(q) ||
      aliases.some((a) => a.startsWith(q) || a.includes(q)) ||
      terms.some((t) => t.startsWith(q));

    if (matches && !seen.has(food.id)) {
      seen.add(food.id);
      suggestions.push({
        id: food.id,
        name: food.name,
        localName: food.localName || '',
        countryName: food.countryName || '',
        imageUrl: food.imageUrl || '',
      });
    }
  }

  return suggestions;
};

/**
 * Search by ingredient — find foods that use a specific ingredient
 */
export const searchByIngredient = async (ingredient, { page = 1, limit = 20 } = {}) => {
  if (!ingredient) return { results: [], totalMatches: 0 };

  const q = ingredient.trim().toLowerCase();
  const all = await cache.getAll();

  const matches = all.filter((food) =>
    (food.ingredients || []).some((ing) =>
      (ing.name || '').toLowerCase().includes(q)
    )
  );

  const totalMatches = matches.length;
  const start = (page - 1) * limit;
  const results = matches.slice(start, start + limit);

  return { results, totalMatches, page, limit };
};

export default { smartSearch, autocomplete, searchByIngredient };
