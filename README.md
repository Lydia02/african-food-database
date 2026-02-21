# African Food Database API

A comprehensive REST API for African cuisine — covering foods, recipes, nutrition, countries, regions, and ethnic groups across all 54 African nations. Built with **Node.js / Express** and **Firebase Firestore**.

> **Live Base URL**: `https://african-food-database-production.up.railway.app`
>
> Try it: `GET https://african-food-database-production.up.railway.app/api/foods?limit=5`

---

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Response Format](#response-format)
- [Foods](#foods)
- [Search](#search)
- [Countries](#countries)
- [Regions](#regions)
- [Tribes / Ethnic Groups](#tribes--ethnic-groups)
- [Food Requests](#food-requests)
- [External Data & Enrichment](#external-data--enrichment)
- [Data Models](#data-models)
- [Error Codes](#error-codes)
- [Running Locally](#running-locally)
- [Quick Start Examples](#quick-start-examples)

---

## Base URL

```
https://african-food-database-production.up.railway.app/api
```

Local development:

```
http://localhost:3000/api
```

Confirm the API is live:

```
GET https://african-food-database-production.up.railway.app/
```

```json
{
  "success": true,
  "message": "African Food Database API 🍲",
  "version": "1.0.0",
  "endpoints": {
    "countries": "/api/countries",
    "regions": "/api/regions",
    "tribes": "/api/tribes",
    "foods": "/api/foods",
    "search": "/api/search",
    "foodRequests": "/api/food-requests",
    "external": "/api/external"
  }
}
```

Health check:

```
GET /api/health
```

---

## Authentication

The API is currently **open** — no API key is required.

---

## Rate Limiting

| Window | Max Requests |
|--------|-------------|
| 15 minutes | 100 requests per IP |

When exceeded:

```json
{
  "success": false,
  "error": "Too many requests, please try again later."
}
```

---

## Response Format

All endpoints return a consistent JSON envelope:

```json
{
  "success": true,
  "data": { }
}
```

Errors:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

Paginated list responses include:

```json
{
  "success": true,
  "data": {
    "items": [ ],
    "page": 1,
    "limit": 20,
    "total": 358
  }
}
```

---

## Foods

### List all foods

```
GET /api/foods
```

**Query parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Results per page (max 100) |
| `countryId` | string | — | Filter by country ID |
| `tribeId` | string | — | Filter by tribe / ethnic group ID |
| `category` | string | — | Filter by category e.g. `lunch`, `street food`, `traditional` |
| `targetAudience` | string | — | `university-students` or `young-professionals` |
| `difficulty` | string | — | `easy`, `medium`, or `hard` |
| `search` | string | — | Keyword filter on food name |

**Example**

```
GET /api/foods?category=street+food&countryId=NG001&limit=10
```

---

### Get a single food

```
GET /api/foods/:id
```

Returns the full record including ingredients, step-by-step instructions, and nutrition info.

**Example**

```
GET /api/foods/jollof_rice_NG001
```

---

### Featured foods

```
GET /api/foods/featured
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | `10` | Number of results |

---

### Foods for university students

```
GET /api/foods/students
```

Budget-friendly, easy-to-cook dishes tagged `university-students`.

| Parameter | Type | Default |
|-----------|------|---------|
| `page` | integer | `1` |
| `limit` | integer | `20` |

---

### Foods for young professionals

```
GET /api/foods/professionals
```

Quick, high-quality meals tagged `young-professionals`.

| Parameter | Type | Default |
|-----------|------|---------|
| `page` | integer | `1` |
| `limit` | integer | `20` |

---

### Foods by country

```
GET /api/foods/country/:countryId
```

**Example**

```
GET /api/foods/country/NG001?limit=30
```

---

### Foods by tribe

```
GET /api/foods/tribe/:tribeId
```

**Example**

```
GET /api/foods/tribe/yoruba_001
```

---

### Create a food

```
POST /api/foods
Content-Type: application/json
```

**Required fields**

```json
{
  "name": "Jollof Rice",
  "countryId": "NG001",
  "description": "A classic West African one-pot rice dish cooked in a rich tomato sauce."
}
```

See the [Food model](#food) for all available fields.

---

### Update a food

```
PUT /api/foods/:id
Content-Type: application/json
```

Send only the fields you want to change. All other fields are preserved.

---

### Delete a food

```
DELETE /api/foods/:id
```

---

## Search

### Smart fuzzy search

```
GET /api/search?q=jollof
```

Handles typos, partial names, and alternate spellings. If a query returns zero matches it is automatically logged in the food requests queue.

**Query parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | **required** | Search query (min 2 characters) |
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Results per page |
| `category` | string | — | Narrow to a category |
| `region` | string | — | Narrow to a region e.g. `West Africa` |
| `countryId` | string | — | Narrow to a country |
| `minScore` | integer | `30` | Minimum fuzzy match score (0–100) |

**Example**

```
GET /api/search?q=egusi&region=West+Africa&limit=5
```

**Response**

```json
{
  "success": true,
  "data": {
    "items": [ ],
    "totalMatches": 3,
    "page": 1,
    "limit": 5,
    "requestLogged": false
  }
}
```

> `requestLogged: true` means the query had zero results and was saved for the team to review.

---

### Autocomplete

```
GET /api/search/autocomplete?q=eg
```

Lightweight name suggestions for search inputs.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | **required** | Partial query (min 2 characters) |
| `limit` | integer | `10` | Max suggestions |

**Example response**

```json
{
  "success": true,
  "data": ["Egusi Soup", "Egunsi", "Egusi and Fufu"]
}
```

---

### Search by ingredient

```
GET /api/search/ingredient?q=tomato
```

Returns every food that contains the specified ingredient.

| Parameter | Type | Default |
|-----------|------|---------|
| `q` | string | **required** (min 2 chars) |
| `page` | integer | `1` |
| `limit` | integer | `20` |

---

## Countries

### List all countries

```
GET /api/countries
```

Returns all 54 African countries in the database.

---

### Get country by ID

```
GET /api/countries/:id
```

---

### Get country by ISO code

```
GET /api/countries/code/:code
```

**Example**

```
GET /api/countries/code/NG   → Nigeria
GET /api/countries/code/GH   → Ghana
GET /api/countries/code/ET   → Ethiopia
```

---

### Create / Update / Delete

```
POST   /api/countries
PUT    /api/countries/:id
DELETE /api/countries/:id
```

---

## Regions

African regions: West Africa, East Africa, North Africa, Central Africa, Southern Africa.

### List all regions

```
GET /api/regions
```

---

### Regions by country

```
GET /api/regions/country/:countryId
```

---

### Get region by ID

```
GET /api/regions/:id
```

---

### Create / Update / Delete

```
POST   /api/regions
PUT    /api/regions/:id
DELETE /api/regions/:id
```

---

## Tribes / Ethnic Groups

### List all tribes

```
GET /api/tribes
```

---

### Tribes by country

```
GET /api/tribes/country/:countryId
```

**Example**

```
GET /api/tribes/country/NG001
```

---

### Get tribe by ID

```
GET /api/tribes/:id
```

---

### Create / Update / Delete

```
POST   /api/tribes
PUT    /api/tribes/:id
DELETE /api/tribes/:id
```

---

## Food Requests

Community-driven queue. When a user searches for a dish that does not exist, the query is auto-logged here for the team to review and add.

### List all requests

```
GET /api/food-requests
```

---

### Most requested foods

```
GET /api/food-requests/top
```

Foods most frequently searched but not yet in the database — useful for prioritising what to add next.

---

### Request analytics

```
GET /api/food-requests/stats
```

---

### Submit a food request manually

```
POST /api/food-requests
Content-Type: application/json
```

```json
{
  "query": "Suya spice blend",
  "region": "West Africa",
  "countryHint": "NG"
}
```

---

### Update request status *(admin)*

```
PATCH /api/food-requests/:id/status
Content-Type: application/json
```

```json
{ "status": "fulfilled" }
```

---

### Delete a request

```
DELETE /api/food-requests/:id
```

---

## External Data & Enrichment

Admin-facing utilities for pulling data from third-party sources (OpenFoodFacts, USDA, Spoonacular, Wikipedia) and enriching existing records.

### Unified external search

```
GET /api/external/search?q=jollof+rice
```

Queries all connected external APIs in a single call.

---

### Search individual sources

```
GET /api/external/search/openfoodfacts?q=egusi&page=1&pageSize=10
GET /api/external/search/usda?q=fufu&pageSize=5
GET /api/external/search/spoonacular?q=tagine&number=5
```

---

### Product lookup by barcode

```
GET /api/external/product/:barcode
```

Looks up a packaged product by EAN/UPC barcode via OpenFoodFacts.

---

### Get nutrition details for an existing food

```
GET /api/external/nutrition/:foodId
```

---

### Discover missing foods from Wikipedia

```
GET /api/external/discover?depth=2&maxResults=100
```

Scans Wikipedia African-food categories for dishes not yet in the database.

---

### Discover by Wikipedia category

```
GET /api/external/discover/wikipedia/:category?depth=1&maxResults=50
```

---

### Import a single discovered dish

```
POST /api/external/discover/import
Content-Type: application/json
```

```json
{
  "title": "Ndole",
  "countryId": "CM001"
}
```

---

### Bulk import discovered dishes

```
POST /api/external/discover/import/bulk
```

| Query param | Type | Default | Description |
|-------------|------|---------|-------------|
| `minConfidence` | integer | `60` | Minimum confidence score (0–100) |
| `limit` | integer | `50` | Max items to import |
| `dryRun` | boolean | `false` | Preview without saving |

---

### Enrich one food's nutrition

```
POST /api/external/enrich/:foodId/nutrition
```

Fetches and saves nutrition data from USDA / Spoonacular for a single food.

---

### Enrich one food from Wikipedia

```
POST /api/external/enrich/:foodId/wikipedia
```

---

### Bulk enrich nutrition

```
POST /api/external/enrich/bulk/nutrition?dryRun=false
```

---

### Bulk enrich from Wikipedia

```
POST /api/external/enrich/bulk/wikipedia?dryRun=false
```

---

## Data Models

### Food

```json
{
  "id": "jollof_rice_NG001",
  "name": "Jollof Rice",
  "localName": "Jollof",
  "aliases": ["Jolof", "Benachin", "Ceebu Jen"],
  "description": "A classic West African one-pot rice dish cooked in a rich tomato sauce.",
  "countryId": "NG001",
  "countryName": "Nigeria",
  "tribeId": "yoruba_001",
  "tribeName": "Yoruba",
  "region": "West Africa",
  "categories": ["traditional", "lunch", "dinner"],
  "targetAudience": ["university-students", "young-professionals"],
  "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/...",
  "images": [],
  "tags": ["rice", "tomato", "party food", "one-pot"],
  "difficulty": "medium",
  "prepTime": 20,
  "cookTime": 45,
  "totalTime": 65,
  "servings": 4,
  "estimatedCost": "$5-10",
  "ingredients": [
    { "name": "Long grain parboiled rice", "quantity": "2", "unit": "cups", "notes": "washed" },
    { "name": "Tomatoes", "quantity": "4", "unit": "medium", "notes": "blended with peppers" },
    { "name": "Tomato paste", "quantity": "2", "unit": "tbsp" },
    { "name": "Chicken stock", "quantity": "1.5", "unit": "cups" },
    { "name": "Onion", "quantity": "1", "unit": "large" },
    { "name": "Vegetable oil", "quantity": "3", "unit": "tbsp" }
  ],
  "instructions": [
    { "step": 1, "description": "Blend tomatoes, scotch bonnet peppers, and half the onion." },
    { "step": 2, "description": "Fry the tomato blend in oil with tomato paste for 15–20 minutes until the rawness cooks out." },
    { "step": 3, "description": "Add rice, stock, and seasoning. Cover tightly and cook on low heat for 30 minutes." }
  ],
  "nutritionInfo": {
    "calories": 350,
    "protein": "8g",
    "carbs": "65g",
    "fat": "6g"
  },
  "tips": [
    "Use parboiled rice — it holds up better in the sauce.",
    "Cook on the lowest heat setting to get the signature smoky bottom."
  ],
  "variations": ["Ghanaian Jollof", "Senegalese Thieboudienne", "Party Jollof"],
  "isFeatured": true,
  "rating": 4.8,
  "reviewCount": 142,
  "viewCount": 9800,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-06-15T12:00:00.000Z"
}
```

**Field reference**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | **Required.** Display name |
| `localName` | string | Name in the local language |
| `aliases` | string[] | Alternate names across regions |
| `searchTerms` | string[] | Auto-generated lowercase tokens for fuzzy search |
| `countryId` | string | **Required.** ID of the country |
| `tribeId` | string | ID of the ethnic group |
| `region` | string | e.g. `West Africa` |
| `categories` | string[] | e.g. `["traditional", "street food", "breakfast"]` |
| `targetAudience` | string[] | `university-students`, `young-professionals` |
| `difficulty` | string | `easy`, `medium`, `hard` |
| `prepTime` | integer | Preparation time in minutes |
| `cookTime` | integer | Cooking time in minutes |
| `estimatedCost` | string | e.g. `"budget-friendly"`, `"$5-10"` |
| `isFeatured` | boolean | Shown in featured feeds |

---

### Country

```json
{
  "id": "NG001",
  "name": "Nigeria",
  "code": "NG",
  "region": "West Africa",
  "capital": "Abuja",
  "population": 220000000,
  "languages": ["English", "Hausa", "Yoruba", "Igbo"]
}
```

---

### Region

```json
{
  "id": "west_africa",
  "name": "West Africa",
  "countries": ["NG", "GH", "SN", "CI", "ML", "BJ", "TG", "GN"]
}
```

---

### Tribe

```json
{
  "id": "yoruba_001",
  "name": "Yoruba",
  "countryId": "NG001",
  "countryName": "Nigeria",
  "population": 42000000,
  "region": "Southwest Nigeria"
}
```

---

## Error Codes

| HTTP Status | Meaning |
|-------------|---------|
| `200` | OK |
| `400` | Bad request — missing or invalid parameter |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## Running Locally

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore enabled
- A Firebase Admin SDK service account key

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-org/african-food-database.git
cd african-food-database

# 2. Install dependencies
npm install

# 3. Set up environment variables
#    Copy the example and fill in your Firebase credentials
cp .env.example .env
```

**.env reference**

```env
PORT=3000
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json

# Optional — only needed for external enrichment endpoints
USDA_API_KEY=your_usda_api_key
SPOONACULAR_API_KEY=your_spoonacular_api_key
```

Place your Firebase service account JSON at `config/serviceAccountKey.json`.

### Start the server

```bash
npm start        # production
npm run dev      # development (auto-reload)
```

The API will be available at `http://localhost:3000`.

---

## Quick Start Examples

### JavaScript / fetch

```js
const BASE = 'https://african-food-database-production.up.railway.app/api';

// Get 5 Nigerian street foods
const res = await fetch(`${BASE}/foods?countryId=NG001&category=street+food&limit=5`);
const { data } = await res.json();
console.log(data.items);

// Fuzzy search
const search = await fetch(`${BASE}/search?q=egusi&limit=10`);
const result = await search.json();
console.log(result.data.items);

// Autocomplete for a search input
const ac = await fetch(`${BASE}/search/autocomplete?q=jol&limit=8`);
const { data: suggestions } = await ac.json();
// ["Jollof Rice", "Jolof", ...]

// Look up Ghana by ISO code
const gh = await fetch(`${BASE}/countries/code/GH`);
const { data: country } = await gh.json();
```

### Python

```python
import requests

BASE = "https://african-food-database-production.up.railway.app/api"

# Search for dishes by ingredient
r = requests.get(f"{BASE}/search/ingredient", params={"q": "plantain", "limit": 10})
foods = r.json()["data"]["items"]
for food in foods:
    print(food["name"], "—", food["countryName"])

# Get full recipe for a food
r = requests.get(f"{BASE}/foods/jollof_rice_NG001")
recipe = r.json()["data"]
print(recipe["name"], recipe["nutritionInfo"])
```

### cURL

```bash
# List all Ethiopian foods
curl "https://african-food-database-production.up.railway.app/api/foods?countryId=ET001&limit=20"

# Get the top 5 most-requested missing dishes
curl "https://african-food-database-production.up.railway.app/api/food-requests/top"

# Search with a fuzzy query
curl "https://african-food-database-production.up.railway.app/api/search?q=injra"
```
