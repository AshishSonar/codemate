const express = require('express')
const authRouter = express.Router()
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpDada } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpDada(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();

    res.send("User added succesfully" + user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const findUserFromDb = await User.findOne({ emailId });
    if (!findUserFromDb) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await findUserFromDb.validatePassword(password)

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }
    const token = await findUserFromDb.getJWT()

    res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
    res.send("Login Successful!!!!");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});


module.exports = authRouter