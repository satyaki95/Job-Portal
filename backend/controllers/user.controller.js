import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// GET USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    // To Upload resume for job seekers
    if (req.file && req.user.role === "user") {
      const originalName = req.file.originalname;
      const extension = originalName.split(".").pop().toLowerCase();

      // Sanitized filename but keep the extension for raw files
      const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
      const sanitizedBase = nameWithoutExt
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9\-_]/g, "");
      const sanitizedFileName = `${sanitizedBase}.${extension}`;

      // Determine resource type: images should be 'image', docs/pdf's often safer as 'raw' for delivery
      const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
      const resourceType = isImage ? "image" : "raw";

      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "jobportal/resumes",
        resourceType,
        sanitizedFileName,
      );
      if (uploadResult && uploadResult.secure_url) {
        updateData.resume = uploadResult.secure_url;
        updateData.resumePublicId = uploadResult.public_id; // Store public_id for future reference
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      returnDocument: "after",
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// HELPER FUNCTION TO EXTRACT PUBLIC ID FROM CLOUDINARY URL
export const getPublicIdFromUrl = (url, resourceType) => {
  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");

    if (uploadIndex === -1) return null;

    const pathAfterVersion = urlParts.slice(uploadIndex + 2).join("/");

    if (resourceType === "raw") return pathAfterVersion; // For raw files, return the full path after 'upload'

    return (
      pathAfterVersion.substring(0, pathAfterVersion.lastIndexOf(".")) ||
      pathAfterVersion
    ); // For images, remove the extension
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

// TO GET USER RESUME
export const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("resume");

    if (!user || !user.resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resourceType = user.resume.includes("/raw/") ? "raw" : "image"; // Determine resource type based on the presence of an extension

    const publicId =
      user.resumePublicId || getPublicIdFromUrl(user.resume, resourceType);

    if (!publicId) {
      return res.status(404).json({
        success: false,
        message: "Public ID not found for the resume",
      });
    }

    if (resourceType === "raw") {
      const fileName = publicId.split("/").pop() || "resume.pdf"; // Extract the filename from the public ID

      const format = fileName.includes(".")
        ? fileName.split(".").pop().toLowerCase()
        : "pdf"; // Default to pdf if no extension

      const signedUrl = cloudinary.utils.private_download_url(
        publicId,
        format,
        {
          resource_type: "raw",
          type: "upload",
          secure: true,
          expires_at: Math.floor(Date.now() / 1000) + 300, // 5 minutes
        },
      );

      return res.redirect(signedUrl);
    }

    // For images, we can directly return the secure URL
    const signedUrl = cloudinary.url(publicId, {
      resource_type: "image",
      type: "upload",
      secure: true,
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 300,
    });

    return res.redirect(signedUrl);
  } catch (err) {
    console.error("Resume Access Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
