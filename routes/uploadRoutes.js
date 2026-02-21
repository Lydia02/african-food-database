import { Router } from 'express';
import multer from 'multer';
import { uploadSingleImage, uploadImages } from '../controllers/uploadController.js';

const router = Router();

// Multer config — store in memory for Firebase upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'), false);
    }
  },
});

// POST /api/upload - Upload a single image
router.post('/', upload.single('image'), uploadSingleImage);

// POST /api/upload/multiple - Upload multiple images (max 10)
router.post('/multiple', upload.array('images', 10), uploadImages);

export default router;
