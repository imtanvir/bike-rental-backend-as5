import { Buffer } from "buffer";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// path: string
export const sendImageToCloudinary = (
  imageName: string,
  buffer: Buffer
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: imageName.trim() },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        // fs.unlink(path, (err) => {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     console.log("File is deleted.");
        //   }
        // });
      }
    );

    // Stream the buffer to Cloudinary
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Function to delete image from Cloudinary
export const deleteImageFromCloudinary = (
  imageName: string
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(imageName.trim(), function (error, result) {
      if (error) {
        reject(error);
        console.log({ error });
      }
      console.log({ result });
      resolve(result);
    });
  });
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.cwd() + "/uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

// Configure multer to use memory storage instead of disk storage
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
