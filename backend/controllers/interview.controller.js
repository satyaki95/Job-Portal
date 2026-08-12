import InterviewCompany from "../models/interviewCompany.model.js";
import InterviewQuestion from "../models/interviewQuestion.model.js";
import InterviewRole from "../models/interviewRole.model.js";
import RoleQuestion from "../models/roleQuestion.model.js";
import {
  uploadFiles,
  parseQuestions,
  handleError,
  replaceQuestions,
} from "../utils/helpers.js";

// INTERVIEW QUESTIONS

// ADD A COMPANY INTERVIEW QUESTION
export const addInterviewCompany = async (req, res) => {
  try {
    const { companyName, questionsCount, questionsDate } = req.body;

    if (!companyName || !questionsCount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await InterviewCompany.findOne({ companyName });

    if (exists) {
      return res.status(400).json({ message: "Company already exists" });
    }

    const uploads = await uploadFiles(req.files, {
      logoFile: { folder: "jobportal/logos", type: "image" },
      csvFile: { folder: "jobportal/csv", type: "raw" },
    });

    const company = await InterviewCompany.create({
      companyName,
      logo: uploads.logoFile || "",
      questionsCount,
      csvUrl: uploads.csvFile || "",
      createdBy: req.user.id,
    });

    if (questionsDate) {
      const formatted = parseQuestions(
        questionsDate,
        "company",
        company._id,
        req.user.id,
      );
      await InterviewQuestion.insertMany(formatted);
    }

    return res
      .status(201)
      .json({ success: true, message: "Company added successfully", company });
  } catch (error) {
    console.error(error);
    return handleError(res, error);
  }
};

// GET COMPANIES QUESTIONS
export const getInterviewCompanies = async (req, res) => {
  try {
    const companies = await InterviewCompany.find().sort({ createdAt: -1 });

    return res.status(200).json({ success: true, companies });
  } catch (error) {
    console.error(error);
    return handleError(res, error);
  }
};

// NOW TO GET QUESTIONS FOR THE COMPANY
export const getInterviewQuestionsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const [company, questions] = await Promise.all([
      InterviewCompany.findById(companyId),
      InterviewQuestion.find({ company: companyId }).sort({ postDate: -1 }),
    ]);

    return res.status(200).json({ success: true, company, questions });
  } catch (error) {
    console.error(error);
    return handleError(res, error);
  }
};

// UPDATE COMPANY
export const updateInterviewCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { companyName, questionsCount, questionsData } = req.body;

    const company = await InterviewCompany.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (companyName) company.companyName = companyName;
    if (questionsCount) company.questionsCount = questionsCount;

    const uploads = await uploadFiles(req.files, {
      logoFile: { folder: "jobportal/logos", type: "image" },
      csvFile: { folder: "jobportal/csv", type: "raw" },
    });

    // Update logo or csv file
    if (uploads.logoFile) company.logo = uploads.logoFile;
    if (uploads.csvFile) company.csvFileUrl = uploads.csvFile;

    await company.save();

    if (questionsData) {
      const formatted = parseQuestions(
        questionsData,
        "company",
        company._id,
        req.user.id,
      );

      await replaceQuestions(
        InterviewQuestion,
        { company: companyId },
        formatted,
      );
    }

    res.status(200).json({ success: true, company });
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE COMPANY
export const deleteInterviewCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    await InterviewCompany.findByIdAndDelete(companyId);

    await InterviewQuestion.deleteMany({ company: companyId });

    res
      .status(200)
      .json({ success: true, message: "Company deleted successfully" });
  } catch (err) {
    handleError(res, err);
  }
};

// ROLE QUESTIONS

// TO ADD A ROLE
export const addInterviewRole = async (req, res) => {
  try {
    const { roleName, questionsCount, questionsData } = req.body;

    if (!roleName || !questionsCount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await InterviewRole.findOne({ roleName });

    if (exists) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const uploads = await uploadFiles(req.files, {
      imageFile: { folder: "jobportal/roles", type: "image" },
      csvFile: { folder: "jobportal/csv", type: "raw" },
    });

    const role = await InterviewRole.create({
      roleName,
      image: uploads.imageFile || "",
      questionsCount,
      csvFileUrl: uploads.csvFile || "",
      createdBy: req.user.id,
    });

    if (questionsData) {
      const formatted = parseQuestions(
        questionsData,
        "role",
        role._id,
        req.user.id,
      );
      await RoleQuestion.insertMany(formatted);
    }

    res
      .status(201)
      .json({ success: true, message: "Role added successfully", role });
  } catch (err) {
    handleError(res, err);
  }
};

// GET ROLES
export const getInterviewRoles = async (req, res) => {
  try {
    const roles = await InterviewRole.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, roles });
  } catch (err) {
    handleError(res, err);
  }
};

// TO FETCH QUESTIONS FOR ROLES
export const getQuestionsByRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const [role, questions] = await Promise.all([
      InterviewRole.findById(roleId),
      RoleQuestion.find({ roleId }).sort({ postDate: -1 }),
    ]);
    res.status(200).json({ success: true, role, questions });
  } catch (err) {
    handleError(res, err);
  }
};

// UPDATE ROLE
export const updateInterviewRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { roleName, questionsCount, questionsData } = req.body;

    const role = await InterviewRole.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (roleName) role.roleName = roleName;
    if (questionsCount) role.questionsCount = questionsCount;

    const uploads = await uploadFiles(req.files, {
      imageFile: { folder: "jobportal/roles", type: "image" },
      csvFile: { folder: "jobportal/csv", type: "raw" },
    });

    if (uploads.imageFile) role.image = uploads.imageFile;
    if (uploads.csvFile) role.csvFileUrl = uploads.csvFile;

    await role.save();

    if (questionsData) {
      const formatted = parseQuestions(
        questionsData,
        "role",
        role._id,
        req.user.id,
      );

      await replaceQuestions(RoleQuestion, { roleId }, formatted);
    }

    res.status(200).json({ success: true, role });
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE ROLE
export const deleteInterviewRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    await InterviewRole.findByIdAndDelete(roleId);
    await RoleQuestion.deleteMany({ roleId });
    res
      .status(200)
      .json({ success: true, message: "Role deleted successfully" });
  } catch (err) {
    handleError(res, err);
  }
};
