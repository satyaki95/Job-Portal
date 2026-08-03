import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (
  fileBuffer,
  folderName,
  resourceType = "auto",
  publicId = null,
) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folderName,
      resource_type: resourceType,
      type: "upload",
      access_mode: "public",
      use_filename: true,
      unique_filename: true,
    };

    if (publicId) {
      if (resourceType === "raw") {
        uploadOptions.public_id = publicId; // For raw files, set the public_id directly
      } else {
        uploadOptions.public_id = publicId.includes(".")
          ? publicId.split(".").slice(0, -1).join(".")
          : publicId; // For images, remove the extension if present
      }
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.log("Cloudinary Upload Error:", error);
          return reject(error);
        }
        console.log("Cloudinary Upload Result:", result);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        });
      },
    );
    uploadStream.end(fileBuffer);
  });
};
