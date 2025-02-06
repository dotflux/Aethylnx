import { conversationModel } from "./models/conversationModel.js";
import { messageModel } from "./models/messageModel.js";
import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getMessages = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "Token Not Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    const recieverId = req.params.id;

    const senderUser = await userModel.findOne({ userId: decoded.id });
    const conversation = await conversationModel
      .findOne({
        participants: { $all: [senderUser._id, recieverId] },
        $or: [{ isGroup: false }, { isGroup: { $exists: false } }],
      })
      .populate({
        path: "messages",
        model: messageModel,
      });

    const recieverUser = await userModel.findOne({ _id: recieverId });
    const reciever = {
      username: recieverUser.username,
      id: recieverUser._id,
      avatarURL: recieverUser.avatarURL,
      displayName: recieverUser.displayName,
      bio: recieverUser.bio,
      isActive: recieverUser.isActive,
      isBlocked: senderUser.blockedUsers.includes(recieverUser._id),
    };

    if (!conversation) {
      return res.status(404).json({
        valid: false,
        error: "Conversation Not Found",
        recieverInfo: reciever,
      });
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    return res.status(200).json({
      valid: true,
      messages: conversation.messages,
      recieverInfo: reciever,
      lastMessage: lastMessage || null,
    });
  } catch (error) {
    console.error(`Error fetching messages: ${error}`);
    return res
      .status(500)
      .json({ valid: false, message: "Internal server error" });
  }
};

export const getMessageById = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "Token Not Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    const messageId = req.body.messageId;

    if (!messageId) {
      return res
        .status(401)
        .json({ valid: false, error: "No message provided" });
    }

    const message = await messageModel.findOne({ _id: messageId });

    if (!message) {
      const repliedTo = {
        exists: false,
      };
      return res.status(200).json({ valid: false, repliedTo: repliedTo });
    }

    const user = await userModel.findOne({ _id: message.senderId });

    if (!user) {
      return res.status(403).json({ valid: false, error: "No such user" });
    }

    const repliedTo = {
      message: message.message,
      senderAvatar: user.avatarURL,
      senderUsername: user.username,
      senderDisplayName: user.displayName,
      exists: true,
    };
    return res.status(200).json({
      valid: true,
      repliedTo: repliedTo,
    });
  } catch (error) {
    console.error(`Error fetching replied messages: ${error}`);
    return res
      .status(500)
      .json({ valid: false, message: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "Token Not Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    const groupId = req.params.id;

    if (!groupId) {
      return res.status(400).json({ valid: false, error: "Group id required" });
    }

    const senderUser = await userModel.findOne({ userId: decoded.id });
    const conversation = await conversationModel
      .findOne({ _id: groupId })
      .populate({
        path: "messages",
        model: messageModel,
      });

    const conv = {
      groupName: conversation.groupName,
      id: conversation._id,
      groupAvatar: conversation.groupAvatar,
      participants: conversation.participants,
      admins: conversation.admins,
    };

    if (!conversation) {
      return res.status(404).json({
        valid: false,
        error: "Conversation Not Found",
      });
    }

    if (!conversation.participants.includes(senderUser._id)) {
      return res
        .status(400)
        .json({ valid: false, error: "You are not a participant" });
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    return res.status(200).json({
      valid: true,
      messages: conversation.messages,
      groupInfo: conv,
      lastMessage: lastMessage || null,
    });
  } catch (error) {
    console.error(`Error fetching group messages: ${error}`);
    return res
      .status(500)
      .json({ valid: false, message: "Internal server error" });
  }
};
