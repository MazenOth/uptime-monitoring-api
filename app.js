const express = require("express");
const bodyParser = require("body-parser");
const userAuthRoutes = require("./routes/userAuthRoutes.js");
const reportRouter = require("./routes/reportRouter.js");
const checksRoutes = require("./routes/checksRoutes.js");
const mongoose = require("mongoose");
const config = require("./config.js");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userAuthRoutes);
app.use(checksRoutes);
app.use(reportRouter);
app.get("/", (req, res) => res.status(200).send("Welcome and Hello"));

mongoose.connect("mongodb://127.0.0.1:27017/uptimeMonitoring").then(() => {
  console.log("Connected to MongoDB!");
});

module.exports = app;
