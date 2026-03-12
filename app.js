import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { countryRoutes, foodRoutes, regionRoutes, tribeRoutes, uploadRoutes, externalRoutes, searchRoutes, foodRequestRoutes } from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import * as foodCache from './services/foodCacheService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Disable ETags — prevents 304 Not Modified on dynamic API responses
app.set('etag', false);

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ─── Security & parsing middleware ─────────────────────────────
app.use(helmet());
app.use(cors());

// Force fresh responses for all /api routes — no client-side caching
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Rate limiting ─────────────────────────────────────────────
// General read limiter — generous for search-heavy clients
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== 'GET',
  message: { success: false, error: 'Too many requests, please try again later.' },
});

// Strict write limiter — POST / PATCH / PUT / DELETE
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'GET',
  message: { success: false, error: 'Too many requests, please try again later.' },
});

app.use('/api', readLimiter);
app.use('/api', writeLimiter);

// ─── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'African Food Database API 🍲',
    version: '1.0.0',
    endpoints: {
      countries: '/api/countries',
      regions: '/api/regions',
      tribes: '/api/tribes',
      foods: '/api/foods',
      search: '/api/search',
      foodRequests: '/api/food-requests',
      upload: '/api/upload',
      external: '/api/external',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cache: foodCache.stats(),
  });
});

app.post('/api/cache/refresh', (req, res) => {
  foodCache.invalidate();
  res.json({ success: true, message: 'Cache cleared. Next request will reload fresh data from Firestore.' });
});

// ─── API routes ────────────────────────────────────────────────
app.use('/api/countries', countryRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/tribes', tribeRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/food-requests', foodRequestRoutes);

// ─── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// ─── Global error handler ──────────────────────────────────────
app.use(errorHandler);

// ─── Start server ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🚀 African Food Database API running on http://localhost:${PORT}`);
    console.log(`📖 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    // Warm up the in-memory food cache eagerly so the first request is fast
    foodCache.warmUp().catch((err) => {
      console.error('⚠️  Initial cache warm-up failed (will retry on first request):', err.message);
    });
  });
}

export default app;
