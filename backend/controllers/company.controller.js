import Company from "../models/company.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

//TO GET ALL COMPANIES
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// TO ADD A COMPANY (ADMIN)
export const addCompany = async (req, res) => {
  try {
    const { website } = req.body;

    if (!website) {
      return res
        .status(400)
        .json({ success: false, message: "Website is required" });
    }

    let logoUrl = ""; // Initialize logoUrl as an empty string
    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "jobportal/logos",
        "image",
        req.file.originalname,
      );
      logoUrl = uploadResult.secure_url; // Get the secure URL of the uploaded image
    }

    const createdBy = req.user.id; // Assuming you have user authentication and the user ID is available in req.user

    const company = await Company.create({ logo: logoUrl, website, createdBy });

    res.status(201).json({
      success: true,
      message: "Company added successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// TO DELETE A COMPANY
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
