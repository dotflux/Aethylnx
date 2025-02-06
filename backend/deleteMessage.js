import { conversationModel } from "./models/conversationModel.js";
import { messageModel } from "./models/messageModel.js";
import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

export const deleteMsg = async (req, res) => {
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

    if (!senderId || !messageId) {
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
        .json({ valid: false, message: "Failed to delete that message" });
    }

    if (message.senderId != senderId) {
      return res
        .status(405)
        .json({ valid: false, message: "You cant delete that message" });
    }

    if (message.fileUrl) {
      const publicId = message.fileUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: message.fileType,
      });
    }

    await messageModel.findByIdAndDelete(messageId);
    await conversationModel.updateOne(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    return res.status(200).json({ valid: true, message: "Deleted" });
  } catch (error) {
    console.log("Error deleting message, ", error);
    return res
      .status(500)
      .json({ valid: false, message: "Internal Server Error" });
  }
};
