const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
require("dotenv").config();


const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const aiRouter = require("./routes/ai");
const chatRouter = require("./routes/chat");
const initialiseSoket = require("./utils/socket");


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", aiRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initialiseSoket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () =>
      console.log("Server listening on Port 3000")
    );
  })
  .catch((err) => {
    console.log("Error Connecting to DB");
  });
