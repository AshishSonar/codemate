const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors')

const requestRouter = require('./routes/request')
const profileRouter = require('./routes/profile')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,  
}))


app.use('/', requestRouter)
app.use('/', profileRouter)
app.use('/', authRouter)
app.use('/', userRouter)


connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen("3000", () => console.log("Server listening on Port 3000"));
  })
  .catch((err) => {
    console.log("Error Connecting to DB");
  });
