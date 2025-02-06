import { userModel } from "./models/userModel.js";
import { conversationModel } from "./models/conversationModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { addSystemMessage } from "./systemMessage.js";

dotenv.config();

export const removeFromGroup = async (req, res, io) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res
      .status(404)
      .json({ valid: false, error: "Token Not Found (refresh page)" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    const creator = await userModel.findOne({ userId: decoded.id });
    if (!creator) {
      return res.status(404).json({ valid: false, error: "No user found" });
    }
    const removedId = req.body.removedId;
    const conversationId = req.body.groupId;
    if (!conversationId) {
      return res.status(400).json({
        valid: false,
        error: "Need to provide conversation for removal",
      });
    }
    if (!removedId) {
      return res
        .status(400)
        .json({ valid: false, error: "Need to provide user for removal" });
    }
    const user = await userModel.findOne({ _id: removedId });
    const conversation = await conversationModel.findOne({
      _id: conversationId,
    });

    if (!conversation.admins.includes(creator._id)) {
      return res.status(400).json({
        valid: false,
        error: "Needs admin permissions to perform that",
      });
    }

    if (!user) {
      return res
        .status(400)
        .json({ valid: false, error: "That user does not exist" });
    }
    if (!conversation) {
      return res
        .status(400)
        .json({ valid: false, error: "That conversation does not exist" });
    }
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: removedId },
      {
        $pull: {
          conversations: {
            id: conversationId,
            isGroup: true,
          },
        },
      },
      { new: true }
    );
    const updatedGroup = await conversationModel.findOneAndUpdate(
      { _id: conversationId },
      {
        $pull: {
          participants: removedId,
        },
      },
      { new: true }
    );
    if (updatedUser.modifiedCount === 0 || updatedGroup.modifiedCount === 0) {
      return res.status(404).json({
        valid: false,
        error: "Conversation not found or already removed",
      });
    }

    io.emit("group_remove", {
      groupId: conversationId,
      removedId: removedId,
    });
    io.emit("group_conversation_updated", {
      conversations: updatedUser.conversations,
      id: removedId,
    });

    addSystemMessage(
      conversation._id,
      `${creator.username} kicked ${user.username}`,
      io
    );

    return res.status(200).json({
      valid: true,
      message: "User Removed",
    });
  } catch (error) {
    console.log("error in removing user from group: ", error);
    return res
      .status(500)
      .json({ valid: false, error: "Internal Server Error" });
  }
};
