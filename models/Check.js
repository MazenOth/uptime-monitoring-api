const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema({
  applicationUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "applicationUser",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  protocol: {
    type: String,
    enum: ["http", "https", "tcp"],
    required: true,
  },
  path: {
    type: String,
  },
  port: {
    type: String,
  },
  webhook: {
    type: String,
    default: "",
  },
  timeout: {
    type: Number,
    default: 5000,
  },
  interval: {
    type: Number,
    default: 600000,
  },
  threshold: {
    type: Number,
    default: 1,
  },
  authentication: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  httpHeaders: [
    {
      key: String,
      value: String,
    },
  ],
  assert: {
    statusCode: {
      type: Number,
    },
  },
  tag: [String],
  ignoreSSL: {
    type: Boolean,
    default: false,
  },
});

const Check = mongoose.model("Check", checkSchema);

module.exports = Check;
