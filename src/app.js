const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpDada } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.find({ emailId: email });
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const user = req.body.id;
    const deleteUser = await User.findByIdAndDelete(user);
    res.send(deleteUser);
  } catch (err) {
    console.log(err);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const dataToUpdate = req.body;

    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isAllowedUpdate = Object.keys(dataToUpdate).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });
    if (!isAllowedUpdate) {
      throw new Error("Update not allowed");
    }
    if (
      Array.isArray(dataToUpdate.skills) &&
      dataToUpdate?.skills.length > 10
    ) {
      throw new Error("Skills cannot be more than 10");
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id: userId },
      dataToUpdate,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
    //updateUser.save()
    res.send("User Updated" + updateUser);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.get("/profile",userAuth, async(req, res) => {
  try {
         const userData = req.userData
        res.send(userData)
  } catch (err) {
    res.status(400).send("ERROR:" +err.message  )
  }
});

app.post('/sendconnectionrequest', userAuth, (req,res)=>{

  const userData = req.userData
  res.send(userData.firstName + 'sent connection request')
})

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen("3000", () => console.log("Server listening on Port 3000"));
  })
  .catch((err) => {
    console.log("Error Connecting to DB");
  });
