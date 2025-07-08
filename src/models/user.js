const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email Id is not valid" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validator(value){
        if(!validator.isStrongPassword(value)){
            throw new Error('Enter strong password' + value)
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/9187/9187532.png",
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error("Email Id is not valid" + value);
        }
      },
    },
    about: {
      type: String,
      default: "Default about of user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);


userSchema.methods.getJWT = async function(){
  const user = this
  const token = await jwt.sign({ _id: user._id }, "Hi@297842TOKEN", {expiresIn: '7d'});
  return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this
  const passwordHash = user.password

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

  return isPasswordValid
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
