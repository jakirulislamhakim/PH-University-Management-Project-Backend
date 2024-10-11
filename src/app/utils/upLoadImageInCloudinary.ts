import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import multer from 'multer';
import fs from 'fs';

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const upLoadImageInCloudinary = async (
  imagePath: string,
  publicId: string,
) => {
  try {
    // Upload an image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
    });

    // Delete the image from 'uploads' folder after successful upload to Cloudinary
    await fs.promises.unlink(imagePath);

    // Return or log the result
    return uploadResult;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error uploading image to Cloudinary',
    );
  }
};

// Set up multer for file handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/'); // Store in 'uploads/' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname);
  },
});

export const upload = multer({ storage: storage });
