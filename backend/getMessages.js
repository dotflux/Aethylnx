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
      })
      .populate({ path: "messages", model: messageModel });

    if (!conversation) {
      return res
        .status(404)
        .json({ valid: false, error: "Conversation Not Found" });
    }
    const recieverUser = await userModel.findOne({ _id: recieverId });
    const reciever = {
      username: recieverUser.username,
      id: recieverUser._id,
      avatarURL: recieverUser.avatarURL,
      displayName: recieverUser.displayName,
    };
    return res.status(200).json({
      valid: true,
      messages: conversation.messages,
      recieverInfo: reciever,
    });
  } catch (error) {
    console.error(`Error fetching messages: ${error}`);
    return res
      .status(500)
      .json({ valid: false, message: "Internal server error" });
  }
};
