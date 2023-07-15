require("dotenv").config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  tokenSecret: `${process.env.SECRET_KEY}`,
  URL: process.env.URL,
  mailUser: process.env.MAIL_USER,
  nodemailAuthUser: process.env.NODEMAIL_AUTH_USER,
  nodemailAuthPass: process.env.NODEMAIL_AUTH_PASS,
  nodeMailAuthPort: process.env.NODEMAIL_AUTH_PORT,
  nodemailAuthHost: process.env.NODEMAIL_AUTH_HOST,
};
