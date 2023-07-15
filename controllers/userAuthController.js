const ApplicationUser = require("../models/ApplicationUser.js");
const bcrypt = require("../utils/bcrypt.js");
const jwt = require("jsonwebtoken");
const config = require("../config.js");
const nodeMailer = require("../utils/nodeMailer.js");
const { v4: uuidv4 } = require("uuid");

const signUp = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email)
      return res.status(400).json({ message: "Please insert yor email" });
    if (!password)
      return res.status(400).json({ message: "Please insert yor password" });
    const user = await ApplicationUser.findOne({ email: email });

    if (user)
      return res.status(401).json({ message: "This user already exists" });
    const hashedPassword = bcrypt.encryptPassword(password);
    const verificationId = uuidv4();
    const newUser = await new ApplicationUser({
      email: email,
      password: hashedPassword,
      verificationId: verificationId,
    }).save();
    const emailBody = `Congratuations, you successfully signed up!
        go to ${config.URL}/verification/${verificationId}`;
    const mailResponse = await nodeMailer(email, emailBody);
    return res.status(201).json({
      token:
        "Please check your email address an email with a verification link have been sent to you!",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email)
    return res.status(400).json({ message: "Please insert yor email" });
  if (!password)
    return res.status(400).json({ message: "Please insert yor password" });
  const user = await ApplicationUser.findOne({ email: email });
  const verifiedPassword = bcrypt.comparePasswords(password, user.password);
  if (!verifiedPassword)
    return res.status(400).json({ message: "Please check your password" });
  if (!user.isVerified)
    return res
      .status(401)
      .json({ message: "Please verify your email address to sign in" });
  const token = jwt.sign({ userid: user._id }, config.tokenSecret, {
    expiresIn: 60 * 60 * 60 * 60,
  });
  return res.status(200).json({ accessToken: token });
};

const emailVerification = async (req, res, next) => {
  const verificationId = req.params.verificationId;
  const verifiedUser = await ApplicationUser.findOne(
    { verificationId: verificationId },
    null
  );
  if (!verifiedUser)
    return res.status(404).json({ message: "This user does not exist" });
  const updateVerification = await ApplicationUser.updateOne(
    { verificationId: verificationId },
    { $set: { isVerified: true } }
  );
  if (updateVerification.modifiedCount === 0)
    return res.status(400).json({ message: "User is already verified" });
  if (updateVerification)
    return res.status(200).json({
      message: "Email address updated successfully you can now sign in",
    });
  else res.status(400).json({ message: "Error verifying the email address" });
};

module.exports = { signUp, signIn, emailVerification };
