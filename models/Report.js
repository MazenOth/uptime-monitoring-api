const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  checkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "check",
  },
  applicationUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "applicationUser",
    required: true,
  },
  status: {
    type: String,
  },
  availability: {
    type: String,
  },
  outages: {
    type: Number,
  },
  downtime: {
    type: Number,
  },
  uptime: {
    type: Number,
  },
  responseTime: {
    type: Number,
  },
  history: [{ status: String, timestamp: Date }],
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
