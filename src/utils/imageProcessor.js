/**
 * Image Processing Utility
 * Handles compression, format conversion, and EXIF removal
 */

// Constants
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_PRODUCT_IMAGES = 10;
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const TARGET_FORMAT = 'image/jpeg';
const TARGET_QUALITY = 0.85; // 85% quality for good balance
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;

/**
 * Validates file size
 */
export const validateFileSize = (file, maxSize = MAX_IMAGE_SIZE) => {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    throw new Error(`حجم الصورة كبير جداً. الحد الأقصى: ${maxSizeMB} ميجابايت`);
  }
  return true;
};

/**
 * Validates file format
 */
export const validateFileFormat = (file) => {
  if (!ALLOWED_FORMATS.includes(file.type.toLowerCase())) {
    throw new Error(`صيغة الصورة غير مدعومة. الصيغ المدعومة: JPG, PNG, WebP, HEIC`);
  }
  return true;
};

/**
 * Validates image count
 */
export const validateImageCount = (currentCount, additionalCount = 1, maxCount = MAX_PRODUCT_IMAGES) => {
  if (currentCount + additionalCount > maxCount) {
    throw new Error(`يمكنك إضافة ${maxCount} صور كحد أقصى`);
  }
  return true;
};

/**
 * Creates a canvas element and draws image
 */
const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

/**
 * Calculates new dimensions maintaining aspect ratio
 */
const calculateDimensions = (width, height, maxWidth = MAX_WIDTH, maxHeight = MAX_HEIGHT) => {
  let newWidth = width;
  let newHeight = height;

  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;
    
    if (width > height) {
      newWidth = Math.min(width, maxWidth);
      newHeight = newWidth / aspectRatio;
    } else {
      newHeight = Math.min(height, maxHeight);
      newWidth = newHeight * aspectRatio;
    }
  }

  return { width: Math.round(newWidth), height: Math.round(newHeight) };
};

/**
 * Loads image from file
 */
const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Converts HEIC/HEIF to JPEG using canvas
 * Note: This requires heic2any library for full HEIC support
 * For now, we'll handle it as best we can with canvas
 */
const convertHeicToJpeg = async (file) => {
  // If heic2any is available, use it
  if (window.heic2any) {
    try {
      const convertedBlob = await window.heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: TARGET_QUALITY,
      });
      return convertedBlob instanceof Array ? convertedBlob[0] : convertedBlob;
    } catch (error) {
      console.warn('HEIC conversion failed, trying fallback:', error);
    }
  }
  
  // Fallback: try to load as image (may not work for HEIC)
  try {
    const img = await loadImage(file);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return new Promise((resolve) => {
      canvas.toBlob(resolve, TARGET_FORMAT, TARGET_QUALITY);
    });
  } catch (error) {
    throw new Error('فشل تحويل صيغة HEIC. يرجى تحويل الصورة إلى JPG يدوياً');
  }
};

/**
 * Compresses and optimizes image
 * - Resizes if too large
 * - Converts to JPEG
 * - Removes EXIF data
 * - Applies quality compression
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = MAX_WIDTH,
    maxHeight = MAX_HEIGHT,
    quality = TARGET_QUALITY,
    targetFormat = TARGET_FORMAT,
  } = options;

  try {
    // Validate format
    validateFileFormat(file);

    // Handle HEIC/HEIF format
    let imageFile = file;
    if (file.type.toLowerCase() === 'image/heic' || file.type.toLowerCase() === 'image/heif') {
      imageFile = await convertHeicToJpeg(file);
      if (!(imageFile instanceof Blob)) {
        imageFile = new File([imageFile], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: TARGET_FORMAT,
        });
      }
    }

    // Load image
    const img = await loadImage(imageFile instanceof Blob ? imageFile : file);

    // Calculate new dimensions
    const { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);

    // Create canvas and draw image (this removes EXIF data)
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Use high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw image
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to blob (this removes EXIF metadata)
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('فشل ضغط الصورة'));
            return;
          }

          // Create a new File object with original name (or modified for HEIC)
          const fileName = file.name.replace(/\.(heic|heif|png)$/i, '.jpg');
          const compressedFile = new File([blob], fileName, {
            type: targetFormat,
            lastModified: Date.now(),
          });

          // Validate compressed size
          if (compressedFile.size > file.size * 1.1) {
            // If compression didn't help, use original but validate size
            console.warn('Compression did not reduce size, using original');
            validateFileSize(file);
            resolve(file);
          } else {
            resolve(compressedFile);
          }
        },
        targetFormat,
        quality
      );
    });
  } catch (error) {
    // If compression fails, return original file (but validate size first)
    console.warn('Image compression failed:', error);
    validateFileSize(file);
    return file;
  }
};

/**
 * Processes multiple images
 */
export const processImages = async (files, options = {}) => {
  const processedFiles = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const file = files[i];
      validateFileSize(file, options.maxSize || MAX_IMAGE_SIZE);
      const compressed = await compressImage(file, options);
      processedFiles.push(compressed);
    } catch (error) {
      errors.push({ index: i, file: files[i].name, error: error.message });
    }
  }

  if (errors.length > 0 && processedFiles.length === 0) {
    throw new Error(`فشل معالجة الصور: ${errors.map(e => e.error).join(', ')}`);
  }

  if (errors.length > 0) {
    console.warn('Some images failed to process:', errors);
  }

  return { files: processedFiles, errors };
};

/**
 * Creates a clean file object without preview metadata
 */
export const createCleanFile = (file) => {
  // Create a new File object to ensure no extra properties
  return new File([file], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  });
};

/**
 * Gets file size in human-readable format
 */
export const getFileSizeString = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

