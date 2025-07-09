const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")
const { userAuth } = require("../middlewares/auth");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;
    const requestRecevied = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({ message: "Data fetched successfully", data: requestRecevied });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const connectedUser = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "Data Fetched", Data: connectedUser });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit > 50 ? 50 : limit
    const skip = (page - 1) * limit

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id }, 
        { toUserId: loggedInUser._id }
      ],
    }).select('fromUserId toUserId')

    const hideusersfromFeed = new Set()
    connectionRequest.forEach((req) => {
      hideusersfromFeed.add(req.fromUserId.toString())
      hideusersfromFeed.add(req.toUserId.toString())
    });

    const users = await User.find({
      $and: [
        {_id: {$nin: Array.from(hideusersfromFeed)}},
        {_id: {$ne: loggedInUser._id}}
      ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)


    res.json({data: users})

  } catch (err) {
    res.status(400).json({ message: "Error " + err.message });
  }
});

module.exports = userRouter;
