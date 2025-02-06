import { userModel } from "./models/userModel.js";
import { conversationModel } from "./models/conversationModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { addSystemMessage } from "./systemMessage.js";

dotenv.config();

export const changeGroupName = async (req, res, io) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res
      .status(404)
      .json({ valid: false, error: "No Token Found (Refresh Page)" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }

    const user = await userModel.findOne({ userId: decoded.id });

    if (!user) {
      return res.status(400).json({
        valid: false,
        error: "Internal Server Error (Try Refreshing)",
      });
    }

    const newName = req.body.newName;
    const oldName = req.body.oldName;
    const groupId = req.body.groupId;

    if (!newName || !oldName || !groupId) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid Parameters" });
    }
    const conversation = await conversationModel.findOne({ _id: groupId });
    if (!conversation) {
      return res
        .status(404)
        .json({ valid: false, error: "Conversation Not Found" });
    }

    if (newName == oldName) {
      return res.status(400).json({
        valid: false,
        error: "New name can't be the same as old name",
      });
    }
    if (newName >= 25) {
      return res
        .status(400)
        .json({ valid: false, error: "Name exceeds 25 characters" });
    }

    if (!conversation.participants.includes(user._id)) {
      return res.status(400).json({ valid: false, error: "Not a participant" });
    }

    conversation.groupName = newName;
    conversation.save();
    addSystemMessage(
      conversation._id,
      `${user.username} changed the group name`,
      io
    );
    return res.status(200).json({ valid: true, message: "Name Changed" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ valid: false, error: "Internal Server Error" });
  }
};
