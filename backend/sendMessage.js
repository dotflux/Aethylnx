import { conversationModel } from "./models/conversationModel.js";
import { messageModel } from "./models/messageModel.js";
import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const sendMessage = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "Token Not Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    const message = req.body.message;
    const recieverId = req.params.id;
    const senderUser = await userModel.findOne({ userId: decoded.id });

    if (recieverId == senderUser._id) {
      return res
        .status(400)
        .json({ valid: false, error: "Cant send message to yourself" });
    }

    if (message.length >= 2000) {
      return res
        .status(401)
        .json({
          valid: false,
          error: "Message exceeds limit of 2000 characters",
        });
    }

    if (!recieverId) {
      return res.status(402).json({ valid: false, error: "Need a reciever" });
    }

    let sender = await userModel.findOne({
      _id: senderUser._id,
    });

    let reciever = await userModel.findOne({
      _id: recieverId,
    });

    let conversation = await conversationModel.findOne({
      participants: { $all: [senderUser._id, recieverId] },
    });

    if (!conversation && sender && reciever) {
      conversation = new conversationModel({
        participants: [senderUser._id, recieverId],
        messages: [],
      });

      sender.conversations.push({
        id: conversation._id,
        participant: recieverId,
      });

      reciever.conversations.push({
        id: conversation._id,
        participant: senderUser._id,
      });
    }

    const newMessage = new messageModel({
      senderId: senderUser._id,
      recieverId: recieverId,
      message: message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([
      conversation.save(),
      newMessage.save(),
      sender.save(),
      reciever.save(),
    ]);

    res.status(200).json({ valid: true });
    return;
  } catch (error) {
    console.log(`error in sending msg: ${error}`);
    res.status(402).json({ valid: false, error: "Internal server error" });
    return;
  }
};
