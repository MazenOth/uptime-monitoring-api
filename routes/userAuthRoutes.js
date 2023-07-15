const express = require("express");
const {
  signUp,
  signIn,
  emailVerification,
} = require("../controllers/UserAuthController.js");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verification/:verificationId", emailVerification);

module.exports = router;
