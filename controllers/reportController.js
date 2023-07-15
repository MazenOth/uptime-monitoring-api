const Report = require("../models/Report.js");

const getReportById = async (req, res) => {
  const id = req.params.id;
  try {
    const report = await Report.findById(id).where({
      applicationUserId: req.user._id,
    });
    if (!report) return res.status(404).json({ message: "No reports found" });
    console.log(req.user._id);
    console.log(report.userId);
    if (req.user._id.toString() != report.applicationUserId.toString())
      return res
        .status(403)
        .json({ message: "forbidden request by wrong user" });
    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const report = await Report.find({ applicationUserId: req.user._id });
    if (report.length === 0)
      return res.status(404).json({ message: "No reports found" });
    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllReports, getReportById };
