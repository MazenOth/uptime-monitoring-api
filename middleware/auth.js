const jwt = require("jsonwebtoken");
const config = require("../config.js");
const ApplicationUser = require("../models/ApplicationUser.js");

const authentication = async (req, res, next) => {
  if (!req.headers.accesstoken)
    return res.status(403).json({ message: "unauthorized" });
  const accessToken = req.headers.accesstoken;
  try {
    const verifyToken = jwt.verify(accessToken, config.tokenSecret);
    const user = await ApplicationUser.findById(verifyToken.userid);
    if (!user)
      return res.status(401).json({ message: "invalid user verification" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};

module.exports = authentication;
