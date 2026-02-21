import { bucket } from '../config/firebase.js';
import { randomUUID } from 'crypto';
import path from 'path';

/**
 * Upload an image to Firebase Storage
 */
export const uploadImage = async (file, folder = 'foods') => {
  if (!file) throw new Error('No file provided');

  const fileName = `${folder}/${randomUUID()}-${Date.now()}${path.extname(file.originalname)}`;
  const blob = bucket.file(fileName);

  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
      metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(new Error(`Upload failed: ${err.message}`));
    });

    blobStream.on('finish', async () => {
      // Make file publicly accessible
      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve({
        url: publicUrl,
        fileName,
        contentType: file.mimetype,
        size: file.size,
      });
    });

    blobStream.end(file.buffer);
  });
};

/**
 * Delete an image from Firebase Storage
 */
export const deleteImage = async (fileName) => {
  try {
    await bucket.file(fileName).delete();
    return { deleted: true, fileName };
  } catch (error) {
    console.error('Error deleting image:', error.message);
    throw error;
  }
};

/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (files, folder = 'foods') => {
  const uploads = files.map((file) => uploadImage(file, folder));
  return Promise.all(uploads);
};

export default { uploadImage, deleteImage, uploadMultipleImages };
