/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err.message);
  console.error(err.stack);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large. Maximum size is 5MB.',
    });
  }

  // Multer file type error
  if (err.message && err.message.includes('Only JPEG')) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Validation errors
  if (err.message && err.message.includes('Validation failed')) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Not found
  if (err.message && err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: err.message,
    });
  }

  // Default 500
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
};

export default errorHandler;
