import { messageModel } from "./models/messageModel.js";
import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const editMsg = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, message: "No Token Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, message: "Invalid Token" });
    }
    const senderId = req.body.senderId;
    const messageId = req.body.messageId;
    const newMessage = req.body.newMessage;

    if (!senderId || !messageId || !newMessage) {
      return res
        .status(403)
        .json({ valid: false, message: "Required information not recieved" });
    }

    const user = await userModel.findOne({ userId: decoded.id });
    const message = await messageModel.findOne({ _id: messageId });

    if (!user || !message) {
      return res.status(402).json({ valid: false, message: "Not Found" });
    }

    if (user._id != senderId) {
      return res
        .status(401)
        .json({ valid: false, message: "Failed to edit that message" });
    }

    if (message.senderId != senderId) {
      return res
        .status(405)
        .json({ valid: false, message: "You cant edit that message" });
    }

    message.message = newMessage;
    message.edited = true;

    message.save();

    return res
      .status(200)
      .json({ valid: true, message: "Edited", editedMessage: message.message });
  } catch (error) {
    console.log("Error editing message, ", error);
    return res
      .status(500)
      .json({ valid: false, message: "Internal Server Error" });
  }
};
