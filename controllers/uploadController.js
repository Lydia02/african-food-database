import { uploadImage, uploadMultipleImages } from '../services/uploadService.js';

/**
 * POST /api/upload
 */
export const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const folder = req.body.folder || 'foods';
    const result = await uploadImage(req.file, folder);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/upload/multiple
 */
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }
    const folder = req.body.folder || 'foods';
    const results = await uploadMultipleImages(req.files, folder);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default { uploadSingleImage, uploadImages };
