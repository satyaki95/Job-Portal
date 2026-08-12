import Inquiry from "../models/inquiry.model.js";
import { sendAdminInquiryEmail } from "../utils/emailService.js";

// TO SUBMIT A QUERY
export const submitInquiry = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const inquiry = await Inquiry.create({
      fullName,
      email,
      phone,
      subject,
      message,
    });

    try {
      await sendAdminInquiryEmail(fullName, email, phone, subject, message);
    } catch (emailError) {
      console.error("Error sending inquiry email:", emailError);
    }

    res
      .status(201)
      .json({
        success: true,
        inquiry,
        message: "Inquiry submitted successfully",
      });
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
