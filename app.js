import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { countryRoutes, foodRoutes, regionRoutes, tribeRoutes, uploadRoutes, externalRoutes, searchRoutes, foodRequestRoutes } from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security & parsing middleware ─────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Rate limiting ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

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
  res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
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
  });
}

export default app;
