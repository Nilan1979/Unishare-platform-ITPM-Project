const Report = require("../models/Report");

// Create Report
exports.createReport = async (req, res) => {
  try {
    const report = new Report(req.body);
    const savedReport = await report.save();
    res.status(201).json({
      success: true,
      data: savedReport,
      message: "Report created successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Reports
exports.getAllReports = async (req, res) => {
  try {
    // Fetch reports without populating User reference to avoid schema errors
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reports,
      message: "Reports retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Reports by Student ID
exports.getReportsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const reports = await Report.find({ reportedUserId: studentId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: reports,
      message: "Student reports retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Report Count for a Student
exports.getReportCount = async (req, res) => {
  try {
    const { studentId } = req.params;
    const count = await Report.countDocuments({ reportedUserId: studentId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Report Status
exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Report
exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }
    res.json({
      success: true,
      data: report,
      message: "Report retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
