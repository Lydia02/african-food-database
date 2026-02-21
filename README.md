# PantryPal — African Food Database API 🍲🌍

A comprehensive REST API featuring **358+ traditional African dishes** from all **54 African countries** — complete with nutrition data, images, descriptions, and smart search. Built with Express 5 and Firebase.

## Live Demo

> **Base URL**: `https://your-deployment-url.com`
>
> Try it: `GET /api/foods?limit=5`

---

## Features

- **358+ African foods** with nutrition, images, and descriptions
- **54 countries** represented across all African regions
- **Smart search** with fuzzy matching (Levenshtein distance), autocomplete, and ingredient search
- **Nutrition enrichment** via 3-tier pipeline: local reference → OpenFoodFacts → USDA
- **Wikipedia discovery** — automatically finds and imports new African dishes
- **Community food requests** — users can request missing dishes
- **Image upload** to Firebase Storage
- **Rate limiting** and security via Helmet + CORS

---

## Quick Start

### Prerequisites

- **Node.js** 18+
- **Firebase project** with Firestore enabled
- **USDA API key** (free: [signup here](https://fdc.nal.usda.gov/api-key-signup.html))

### Installation

```bash
git clone https://github.com/your-username/african-food-database.git
cd african-food-database
npm install
```

### Environment Variables

Create a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json

# USDA FoodData Central API Key
USDA_API_KEY=your-usda-api-key
```

Place your Firebase service account JSON at `./config/serviceAccountKey.json`.

### Seed the Database

```bash
# Seed countries first, then all food regions
npm run seed:countries
npm run seed:all-regions

# Seed additional food collections
npm run seed:street
npm run seed:everyday

# Enrich foods with nutrition data
npm run enrich:nutrition
```

### Run the Server

```bash
# Development (hot reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:3000`.

---

## API Endpoints

### Health & Info

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API info + available endpoints |
| `GET` | `/api/health` | Health check |

### Foods (10 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/foods` | List all foods (pagination: `?page=1&limit=20`) |
| `GET` | `/api/foods/:id` | Get food by ID |
| `GET` | `/api/foods/featured` | Get featured foods |
| `GET` | `/api/foods/students` | Budget-friendly student meals |
| `GET` | `/api/foods/professionals` | Quick professional meals |
| `GET` | `/api/foods/country/:countryId` | Foods by country |
| `GET` | `/api/foods/tribe/:tribeId` | Foods by tribe |
| `POST` | `/api/foods` | Create a food |
| `PUT` | `/api/foods/:id` | Update a food |
| `DELETE` | `/api/foods/:id` | Delete a food |

### Search (3 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search?q=jollof` | Smart fuzzy search |
| `GET` | `/api/search/autocomplete?q=fu` | Autocomplete suggestions |
| `GET` | `/api/search/ingredient?q=plantain` | Search by ingredient |

### Countries (6 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/countries` | List all 54 countries |
| `GET` | `/api/countries/:id` | Get country by ID |
| `GET` | `/api/countries/code/:code` | Get country by ISO code (e.g., `NG`) |
| `POST` | `/api/countries` | Create a country |
| `PUT` | `/api/countries/:id` | Update a country |
| `DELETE` | `/api/countries/:id` | Delete a country |

### Regions (6 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/regions` | List all regions |
| `GET` | `/api/regions/:id` | Get region by ID |
| `GET` | `/api/regions/country/:countryId` | Regions by country |
| `POST` | `/api/regions` | Create a region |
| `PUT` | `/api/regions/:id` | Update a region |
| `DELETE` | `/api/regions/:id` | Delete a region |

### Tribes (6 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tribes` | List all tribes |
| `GET` | `/api/tribes/:id` | Get tribe by ID |
| `GET` | `/api/tribes/country/:countryId` | Tribes by country |
| `POST` | `/api/tribes` | Create a tribe |
| `PUT` | `/api/tribes/:id` | Update a tribe |
| `DELETE` | `/api/tribes/:id` | Delete a tribe |

### Food Requests (6 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/food-requests` | List all community requests |
| `GET` | `/api/food-requests/top` | Most requested foods |
| `GET` | `/api/food-requests/stats` | Request analytics |
| `POST` | `/api/food-requests` | Submit a new request |
| `PATCH` | `/api/food-requests/:id/status` | Update request status |
| `DELETE` | `/api/food-requests/:id` | Delete a request |

### Upload (2 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload single image |
| `POST` | `/api/upload/multiple` | Upload multiple images (max 10) |

### External / Enrichment (15 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/external/search?q=fufu` | Search across all external APIs |
| `GET` | `/api/external/search/openfoodfacts?q=...` | Search OpenFoodFacts |
| `GET` | `/api/external/search/usda?q=...` | Search USDA FoodData Central |
| `GET` | `/api/external/search/spoonacular?q=...` | Search Spoonacular |
| `GET` | `/api/external/product/:barcode` | Lookup by barcode |
| `GET` | `/api/external/nutrition/:foodId` | Get nutrition for a food |
| `GET` | `/api/external/discover` | Discover missing dishes from Wikipedia |
| `GET` | `/api/external/discover/wikipedia/:category` | Discover by category |
| `GET` | `/api/external/discover/wikipedia/info/:title` | Get Wikipedia info |
| `POST` | `/api/external/discover/import` | Import a discovered dish |
| `POST` | `/api/external/discover/import/bulk` | Bulk import dishes |
| `POST` | `/api/external/enrich/:foodId/nutrition` | Enrich one food's nutrition |
| `POST` | `/api/external/enrich/:foodId/wikipedia` | Enrich from Wikipedia |
| `POST` | `/api/external/enrich/bulk/nutrition` | Bulk nutrition enrichment |
| `POST` | `/api/external/enrich/bulk/wikipedia` | Bulk Wikipedia enrichment |

> **Total: 53 endpoints**

---

## Example Requests

### Search for a food

```bash
curl "https://your-api.com/api/search?q=jollof+rice"
```

```json
{
  "success": true,
  "count": 3,
  "results": [
    {
      "id": "abc123",
      "name": "Jollof Rice",
      "description": "A beloved West African one-pot rice dish...",
      "imageUrl": "https://upload.wikimedia.org/...",
      "nutritionInfo": {
        "calories": 230,
        "protein": "5.2g",
        "carbs": "38g",
        "fat": "7.1g"
      }
    }
  ]
}
```

### Autocomplete

```bash
curl "https://your-api.com/api/search/autocomplete?q=fu&limit=5"
```

```json
{
  "success": true,
  "suggestions": ["Fufu", "Fufu & Light Soup", "Ful Medames", "Funge", "Fufu (Congolese)"]
}
```

### Get all foods (paginated)

```bash
curl "https://your-api.com/api/foods?page=1&limit=10"
```

---

## Data Model

### Food Document

```javascript
{
  name: "Jollof Rice",
  localName: "Jolof",
  aliases: ["Benachin", "Ceebu Jen"],
  description: "A beloved West African one-pot rice dish...",
  countryId: "nigeria",
  countryName: "Nigeria",
  region: "Nationwide",
  categories: ["traditional", "lunch", "dinner"],
  imageUrl: "https://...",
  ingredients: ["rice", "tomatoes", "onions", "pepper", "spices"],
  nutritionInfo: {
    calories: 230,
    protein: "5.2g",
    carbs: "38g",
    fat: "7.1g",
    fiber: "1.8g",
    sodium: "420mg"
  },
  nutritionSource: "pantrypal-reference",
  difficulty: "medium",
  prepTime: 20,
  cookTime: 60,
  servings: 6,
  tags: ["rice", "one-pot", "party"],
  isFeatured: false,
  rating: 0,
  viewCount: 0,
  createdAt: "2026-02-20T...",
  updatedAt: "2026-02-21T..."
}
```

---

## Nutrition Enrichment Pipeline

Foods are enriched through a 3-tier waterfall:

```
1. PantryPal Local Reference (instant)
   └── ~150+ curated African food entries
   └── Exact match → substring match → word match

2. OpenFoodFacts API (free, no rate limit)
   └── Packaged food database
   └── Best for commercially available items

3. USDA FoodData Central (1000 req/hr with API key)
   └── Most comprehensive nutrition database
   └── Circuit breaker: auto-disables on rate limit
```

---

## CLI Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start dev server (hot reload) |
| `npm test` | Run tests with coverage |
| `npm run seed:countries` | Seed 54 African countries |
| `npm run seed:all-regions` | Seed all regional foods |
| `npm run seed:street` | Seed 42 street foods |
| `npm run seed:everyday` | Seed 37 everyday foods |
| `npm run enrich:nutrition` | Enrich all foods with nutrition data |
| `npm run enrich:wikipedia` | Enrich foods from Wikipedia |
| `npm run discover` | Discover new dishes (dry run) |
| `npm run discover:import:safe` | Import top discoveries (confidence >70) |

---

## Project Structure

```
african-food-database/
├── app.js                    # Express app entry point
├── package.json
├── .env                      # Environment variables
├── config/
│   ├── firebase.js           # Firebase Admin SDK init
│   ├── constants.js          # App constants
│   └── serviceAccountKey.json
├── models/
│   ├── Food.js               # Food schema + validation
│   ├── Country.js            # Country schema
│   ├── Region.js             # Region schema
│   ├── Tribe.js              # Tribe schema
│   ├── FoodRequest.js        # Food request schema
│   └── index.js
├── controllers/
│   ├── foodController.js     # Food CRUD handlers
│   ├── countryController.js  # Country handlers
│   ├── regionController.js   # Region handlers
│   ├── tribeController.js    # Tribe handlers
│   ├── uploadController.js   # Image upload handlers
│   └── externalController.js # External API handlers
├── services/
│   ├── foodService.js        # Food business logic
│   ├── countryService.js     # Country business logic
│   ├── searchService.js      # Fuzzy search engine
│   ├── enrichmentService.js  # Nutrition enrichment pipeline
│   ├── externalApiService.js # USDA, OFF, Wikipedia clients
│   ├── discoveryService.js   # Wikipedia food discovery
│   ├── uploadService.js      # Firebase Storage uploads
│   └── foodRequestService.js # Food request logic
├── routes/
│   ├── foodRoutes.js
│   ├── countryRoutes.js
│   ├── searchRoutes.js
│   ├── externalRoutes.js
│   └── ... (8 route files)
├── middleware/
│   ├── errorHandler.js       # Global error handler
│   ├── validate.js           # Request validation
│   └── index.js
├── data/
│   └── nutritionReference.js # 150+ African food nutrition data
└── migrations/
    ├── seed.js               # Base seeder
    ├── seedCountries.js      # 54 countries
    ├── seedNigerianFoods.js  # 58 Nigerian foods
    ├── seedWestAfricanFoods.js
    ├── seedEastAfricanFoods.js
    ├── seedNorthAfricanFoods.js
    ├── seedSouthernAfricanFoods.js
    ├── seedCentralAfricanFoods.js
    ├── seedFoodCombos.js
    ├── seedStreetFood.js     # 42 street foods
    ├── seedEverydayFood.js   # 37 everyday foods
    ├── enrichAll.js          # Bulk enrichment runner
    └── importDiscoveries.js  # Wikipedia import CLI
```

---

## Deployment

### Option 1: Railway (Recommended — Free Tier)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

Set environment variables in Railway dashboard.

### Option 2: Render (Free Tier)

1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables

### Option 3: Google Cloud Run (Free Tier)

```bash
# Build and deploy
gcloud run deploy african-food-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Framework | Express 5.2 |
| Database | Firebase Firestore |
| Storage | Firebase Cloud Storage |
| Security | Helmet, CORS, express-rate-limit |
| External APIs | USDA, OpenFoodFacts, Wikipedia, Spoonacular |
| Testing | Jest, Supertest |

---

## Rate Limits

- **100 requests** per 15-minute window per IP
- Returns `429 Too Many Requests` with retry message

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/new-dish`)
3. Commit changes (`git commit -m 'Add Senegalese dishes'`)
4. Push to branch (`git push origin feature/new-dish`)
5. Open a Pull Request

---

## License

ISC

---

## Author

**Lydia** — Built with ❤️ for African cuisine

---

> *"Food is our common ground, a universal experience."* — James Beard
