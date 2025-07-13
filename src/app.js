const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors')
require("dotenv").config()

const requestRouter = require('./routes/request')
const profileRouter = require('./routes/profile')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')



// app.use(cors({
//   origin: "http://localhost:5173",
//   //origin: "https://codemate-web-c3fd.onrender.com",
//   credentials: true, 
// })) 


const allowedOrigins = [
  "http://localhost:5173",
  "https://codemate-web-c3fd.onrender.com", // when deployed
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow Postman/cURL
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));



app.use(express.json());
app.use(cookieParser());

app.use('/', requestRouter)
app.use('/', profileRouter)
app.use('/', authRouter)
app.use('/', userRouter)


connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT, () => console.log("Server listening on Port 3000"));
  })
  .catch((err) => {
    console.log("Error Connecting to DB");
  });
