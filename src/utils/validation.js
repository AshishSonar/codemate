const validator = require("validator");

const validateSignUpDada = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Data not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Data not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Pls enter strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpDada, validateEditProfileData };
