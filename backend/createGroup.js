import { userModel } from "./models/userModel.js";
import { conversationModel } from "./models/conversationModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { addSystemMessage } from "./systemMessage.js";

dotenv.config();

export const createGroup = async (req, res, io) => {
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

    const participants = req.body.participants;
    const groupName = req.body.groupName;

    if (!participants || !groupName || participants.length <= 1) {
      return res.status(404).json({
        valid: false,
        error:
          "Group name and more than 2 members are required to form a group",
      });
    }

    if (participants.length >= 9) {
      return res.status(400).json({
        valid: false,
        error: "Can't create a group with more than 10 members",
      });
    }

    const conversation = new conversationModel({
      participants: [...participants, creator._id],
      isGroup: true,
      groupName: groupName,
      admins: [creator._id],
    });
    for (const participant of participants) {
      const user = await userModel.findOne({ _id: participant });

      // You can perform additional operations with the user object here
      if (!user) {
        return res.status(404).json({
          valid: false,
          error: `User with ID ${participant} not found`,
        });
      }

      // Optionally add the conversation to the user's record
      user.conversations.push({
        id: conversation._id,
        participant: null,
        isGroup: true,
        unreadCounter: 1,
      });

      if (
        user.conversations[0]?.id.toString() !== conversation._id.toString()
      ) {
        user.conversations = user.conversations.filter(
          (conv) => conv.id.toString() !== conversation._id.toString()
        );
        user.conversations.unshift({
          id: conversation._id,
          isGroup: true,
        });
      }

      await user.save().then(() => {
        io.emit("group_conversation_updated", {
          conversations: user.conversations,
          id: user._id,
        });
      });
    }

    creator.conversations.push({
      id: conversation._id,
      participant: null,
      isGroup: true,
      unreadCounter: 1,
    });

    if (
      creator.conversations[0]?.id.toString() !== conversation._id.toString()
    ) {
      creator.conversations = creator.conversations.filter(
        (conv) => conv.id.toString() !== conversation._id.toString()
      );
      creator.conversations.unshift({
        id: conversation._id,
        isGroup: true,
      });
    }

    creator.save().then(() => {
      io.emit("group_conversation_updated", {
        conversations: creator.conversations,
        id: creator._id,
      });
    });
    conversation.save();
    addSystemMessage(
      conversation._id,
      `${creator.username} created this group`
    );
    return res.status(200).json({
      valid: true,
      message: "Group Created Successfully",
      groupId: conversation._id,
    });
  } catch (error) {
    console.log("error creating group: ", error);
    return res
      .status(500)
      .json({ valid: false, error: "Internal Server Error" });
  }
};

export const participantsGroup = async (req, res, io) => {
  try {
    const groupParts = [];

    const participants = req.body.participants;

    if (!participants) {
      return res
        .status(400)
        .json({ valid: false, error: "Need the requested list" });
    }

    for (const participant of participants) {
      const user = await userModel.findOne({ _id: participant });

      // You can perform additional operations with the user object here
      if (!user) {
        return res
          .status(404)
          .json({ message: `User with ID ${participant} not found` });
      }

      // Optionally add the conversation to the user's record
      groupParts.push({
        _id: user._id,
        username: user.username,
        avatarURL: user.avatarURL,
        displayName: user.displayName,
        bio: user.bio,
        isActive: user.isActive,
      });
    }

    return res.status(200).json({
      valid: true,
      message: "Fetched Successfully",
      groupParts: groupParts,
    });
  } catch (error) {
    console.log("error in fetching group participants: ", error);
    return res
      .status(500)
      .json({ valid: false, error: "Internal Server Error" });
  }
};
