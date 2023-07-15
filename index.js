const Check = require("./models/check.js");
const pingUrl = require("./utils/pingUrl.js");
const app = require("./app.js");
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port} `);
});

getAllChecks();
async function getAllChecks() {
  const checks = await Check.find();
  checks.forEach((check) => {
    pingUrl(check);
  });
}

module.exports = app;
