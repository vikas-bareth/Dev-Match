const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, gender, age } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!emailId) {
    throw new Error("Email is not valid!");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  } else if (!age) {
    throw new Error("Age required");
  } else if (!gender) {
    throw new Error("Gender is required");
  }
};

validateUpdateUserData = (req) => {};

module.exports = { validateSignUpData, validateUpdateUserData };
