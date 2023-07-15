const bcrypt = require("bcrypt");

const salt = 10;

const encryptPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const comparePasswords = (inputPassword, hashedPassword) => {
  return bcrypt.compareSync(inputPassword, hashedPassword);
};

module.exports = { encryptPassword, comparePasswords };
