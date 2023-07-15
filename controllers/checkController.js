const pingUrl = require("../utils/pingUrl.js");
const Check = require("../models/check.js");
const report = require("../models/Report.js");

const addCheck = async (req, res) => {
  const checkData = req.body;
  try {
    if (!checkData.name) throw Error("Please insert yor name");
    if (!checkData.url) throw Error("Please insert yor url");
    if (!checkData.protocol) throw Error("Please insert yor protocol");
    const isUrlExist = await Check.findOne({ url: checkData.url }).where({
      applicationUserId: req.user._id,
    });
    if (isUrlExist) throw Error("This url already exists");
    const urlData = {
      applicationUserId: req.user._id,
      name: checkData.name,
      url: checkData.url,
      protocol: checkData.protocol,
      path: checkData.path,
      port: checkData.port,
      webhook: checkData.webhook,
      threshold: checkData.threshold,
      authentication: checkData.authentication,
      httpHeaders: checkData.httpHeaders,
      assert: checkData.assert,
      tag: checkData.tag,
      ignoreSSL: checkData.ignoreSSL,
    };
    if (checkData.interval) {
      urlData.interval = checkData.interval * 60000;
    }
    if (checkData.timeout) {
      urlData.timeout = checkData.timeout * 1000;
    }
    const newCheck = await new Check(urlData).save();
    new report({
      checkId: newCheck._id,
      applicationUserId: req.user._id,
    }).save();
    pingUrl(newCheck);
    return res.status(201).json({ message: "check created", check: newCheck });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const getAllChecks = async (req, res) => {
  const { tags } = req.query;
  try {
    const urlChecks = tags
      ? await Check.find({
          applicationUserId: req.user._id,
          tag: { $in: tags },
        })
      : await Check.find({ applicationUserId: req.user._id });

    if (urlChecks.length === 0) throw Error("No checks found");
    return res.status(200).json(urlChecks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
const getCheckById = async (req, res) => {
  try {
    const id = req.params.id;
    const urlCheck = await Check.findById(id).where({
      applicationUserId: req.user._id,
    });
    if (urlCheck.length === 0) throw Error("No urls found ");
    return res.status(200).json(urlCheck);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
const deleteCheck = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const urlCheck = await Check.findByIdAndDelete(id);
    const report = await Report.findOneAndDelete({ checkId: id }).where({
      applicationUserId: req.user._id,
    });
    console.log(urlCheck);
    if (!urlCheck) throw Error("No check found to delete");
    return res.status(200).json({ message: `Check ${id} deleted` });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
const updateCheck = async (req, res) => {
  const checkData = req.body;
  const id = req.params.id;
  try {
    const urlData = {
      applicationUserId: req.user._id,
      name: checkData.name,
      url: checkData.url,
      protocol: checkData.protocol,
      path: checkData.path,
      port: checkData.port,
      webhook: checkData.webhook,
      timeout: checkData.timeout,
      interval: checkData.interval,
      threshold: checkData.threshold,
      authentication: checkData.authentication,
      httpHeaders: checkData.httpHeaders,
      assert: checkData.assert,
      tag: checkData.tag,
      ignoreSSL: checkData.ignoreSSL,
    };
    const updateCheck = await Check.findByIdAndUpdate(id, urlData).where({
      applicationUserId: req.user._id,
    });
    if (!updateCheck) throw Error("Couldnt update the check");
    return res.status(200).json({
      message: "url check updated",
      updatedCheck: urlData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addCheck,
  getAllChecks,
  getCheckById,
  deleteCheck,
  updateCheck,
};
