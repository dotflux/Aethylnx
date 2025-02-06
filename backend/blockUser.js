import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const blockUser = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "token not found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, message: "Invalid Token" });
    }
    const user = await userModel.findOne({ userId: decoded.id });
    if (!user) {
      return res.status(401).json({ valid: false, error: "No such user" });
    }
    const participantUsername = req.body.username;
    const participant = await userModel.findOne({
      username: participantUsername,
    });

    if (!participantUsername) {
      return res
        .status(402)
        .json({ valid: false, error: "Must provide a user to block" });
    }
    if (!participant) {
      return res
        .status(403)
        .json({ valid: false, error: "No such user to block" });
    }
    if (user._id === participant._id || user.userId === participant.userId) {
      return res
        .status(406)
        .json({ valid: false, error: "Can't Block Yourself" });
    }
    const isBlocked = user.blockedUsers.includes(participant._id);
    if (isBlocked) {
      return res
        .status(405)
        .json({ valid: false, error: "User is already blocked" });
    }
    user.blockedUsers.push(participant._id);
    user.save();
    return res
      .status(200)
      .json({ valid: true, message: "User is now Blocked" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ valid: false, error: "Internal server error" });
  }
};

export const unblockUser = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "token not found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, message: "Invalid Token" });
    }
    const user = await userModel.findOne({ userId: decoded.id });
    if (!user) {
      return res.status(401).json({ valid: false, error: "No such user" });
    }
    const participantUsername = req.body.username;
    const participant = await userModel.findOne({
      username: participantUsername,
    });

    if (!participantUsername) {
      return res
        .status(402)
        .json({ valid: false, error: "Must provide a user to unblock" });
    }
    if (!participant) {
      return res
        .status(403)
        .json({ valid: false, error: "No such user to unblock" });
    }
    if (user._id === participant._id || user.userId === participant.userId) {
      return res
        .status(406)
        .json({ valid: false, error: "Can't Unblock Yourself" });
    }
    const isBlocked = user.blockedUsers.includes(participant._id);
    if (!isBlocked) {
      return res
        .status(405)
        .json({ valid: false, error: "User is not blocked" });
    }
    await userModel.updateOne(
      { blockedUsers: participant._id },
      { $pull: { blockedUsers: participant._id } }
    );
    return res
      .status(200)
      .json({ valid: true, message: "User is now Unblocked" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ valid: false, error: "Internal server error" });
  }
};
