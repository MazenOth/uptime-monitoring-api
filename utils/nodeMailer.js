const nodemailer = require("nodemailer");
const config = require("../config.js");


const sendVerificationMail = async (to, text) => {
  
  var transporter = nodemailer.createTransport({
    host: config.nodemailAuthHost,
    port: config.nodeMailAuthPort,
    auth: {
      user: config.nodemailAuthUser,
      pass: config.nodemailAuthPass,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Mailing service ready.");
    }
  });

  let info = await transporter.sendMail({
    from: config.mailUser, 
    to: to, 
    subject: "Email Verification", 
    text: text, 
  });
  return info;
};

module.exports = sendVerificationMail;
