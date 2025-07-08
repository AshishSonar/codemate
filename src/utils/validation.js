const validator = require("validator");

const validateSignUpDada = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Data not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Data not valid");
  }else if(!validator.isStrongPassword(password)){
    throw new Error('Pls enter strong password')
  }
};

module.exports = {validateSignUpDada};
