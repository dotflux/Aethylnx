import jwt from "jsonwebtoken";
import { userModel } from "./models/userModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { conversationModel } from "./models/conversationModel.js";

dotenv.config();

export const getUsrDetails = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "Token Not Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    const user = await userModel.findOne({ userId: decoded.id });
    if (!user) {
      return res.status(404).json({ valid: false, error: "User not found" });
    }
    res.status(200).json({ valid: true, message: "Valid user token", user });
    return;
  } catch (error) {
    return res.status(400).json({ valid: false, error: "Invalid token" });
  }
};

export const getParticipantDetails = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "Token Not Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const participantId = req.body.participant;
    const isGroup = req.body.isGroup;
    const id = req.body.id;

    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    if (isGroup) {
      const conv = await conversationModel.findOne({ _id: id });
      if (!conv) {
        return res
          .status(404)
          .json({ valid: false, error: "Conversation not found" });
      }
      const convDetails = {
        groupName: conv.groupName,
        groupId: conv._id,
        groupParticipants: conv.participants,
      };
      console.log("group info: ", convDetails);
      return res
        .status(200)
        .json({ valid: true, message: "Valid user token", convDetails });
    }
    const user = await userModel.findOne({ _id: participantId });
    const userDetails = {
      username: user.username,
      userId: user._id,
      isActive: user.isActive,
      avatarURL: user.avatarURL,
      displayName: user.displayName,
      _id: user._id,
      bio: user.bio,
    };
    if (!user) {
      return res
        .status(404)
        .json({ valid: false, error: "Participant not found" });
    }
    res
      .status(200)
      .json({ valid: true, message: "Valid user token", userDetails });
    return;
  } catch (error) {
    return res.status(400).json({ valid: false, error: "Invalid token" });
  }
};

export const getSenderDetails = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "Token Not Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const senderId = req.body.senderId;
    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res
        .status(401)
        .json({ valid: false, error: "Invalid Type Of Sender Id" });
    }
    const user = await userModel.findOne({ _id: senderId });
    const senderDetails = {
      username: user.username,
      isActive: user.isActive,
      displayName: user.displayName,
      avatarURL: user.avatarURL,
      _id: user._id,
      bio: user.bio,
    };
    if (!user) {
      return res
        .status(404)
        .json({ valid: false, error: "Participant not found" });
    }
    res
      .status(200)
      .json({ valid: true, message: "Valid user token", senderDetails });
    return;
  } catch (error) {
    return res.status(402).json({ valid: false, error: "Invalid token" });
  }
};

export const getGroupDetails = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "Token Not Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const isGroup = req.body.isGroup;
    const id = req.body.id;

    if (!id) {
      return res.status(400).json({ valid: false, error: "No id provided" });
    }

    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    if (!isGroup) {
      return res
        .status(404)
        .json({ valid: true, error: "No such conversation" });
    }

    const conv = await conversationModel.findOne({ _id: id });

    if (!conv) {
      return res
        .status(404)
        .json({ valid: false, error: "Conversation not found" });
    }
    const convDetails = {
      groupName: conv.groupName,
      groupId: conv._id,
      groupParticipants: conv.participants,
      groupAvatar: conv.groupAvatar,
    };

    res
      .status(200)
      .json({ valid: true, message: "Valid user token", convDetails });
    return;
  } catch (error) {
    return res.status(400).json({ valid: false, error: "Invalid token" });
  }
};
