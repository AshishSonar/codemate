const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");

requestRouter.post(
  "/request/send/:status/:touserId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const toUserId = req.params.touserId;
      const fromUserId = req.userData._id;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status: " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "user not found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({ message: "sent connection request", data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const requestId = req.params.requestId;
      const loggedInUser = req.userData._id;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        toUserId: loggedInUser,
        status: "interested",
        _id: requestId,
      });

      //console.log(connectionRequest);

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      console.log(connectionRequest.status)

      const data = await connectionRequest.save();
      console.log(connectionRequest.status)
      
      res.send({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).json({ message: "Error: " + err });
    }
  }
);

module.exports = requestRouter;
