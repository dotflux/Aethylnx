import { userModel } from "./models/userModel.js";
import { conversationModel } from "./models/conversationModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { addSystemMessage } from "./systemMessage.js";

dotenv.config();

export const addToGroup = async (req, res, io) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res
      .status(404)
      .json({ valid: false, error: "No token found (refresh page)" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    const user = await userModel.findOne({ userId: decoded.id });
    if (!user) {
      return res.status(404).json({ valid: false, error: "No user found" });
    }
    const conversationId = req.body.groupId;
    const conversation = await conversationModel.findOne({
      _id: conversationId,
    });
    if (!conversation) {
      return res
        .status(404)
        .json({ valid: false, error: "No such conversation" });
    }
    const isAdmin = await conversationModel.findOne({
      _id: conversationId,
      admins: { $in: [user._id] }, // Checks if userId exists in admins array
    });
    if (!isAdmin) {
      return res.status(400).json({
        valid: false,
        error: "You're not an admin hence you can't add people to this group",
      });
    }

    const addList = req.body.addList;
    const groupLength = req.body.groupLength;

    if (!addList || addList.length <= 0) {
      return res.status(400).json({
        valid: false,
        error:
          "No user provided to add (If you wish to not add then press cancel)",
      });
    }

    if (!groupLength) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid Parameters (refresh)" });
    }
    if (groupLength >= 10) {
      return res.status(400).json({
        valid: false,
        error: "Can't add more people to this group (max 10)",
      });
    }
    for (const participant of addList) {
      const participantUser = await userModel.findOne({ _id: participant });
      if (!participantUser) {
        return res
          .status(400)
          .json({ valid: false, error: "Invalid user provided" });
      }
      if (conversation.participants.includes(participantUser._id)) {
        return res
          .status(400)
          .json({ valid: false, error: "User already in group" });
      }
      conversation.participants.push(participant);

      participantUser.conversations.push({
        id: conversation._id,
        participant: null,
        isGroup: true,
        unreadCounter: 1,
      });

      // Reorder the conversation for participantUser if needed
      if (
        participantUser.conversations[0]?.id.toString() !==
        conversation._id.toString()
      ) {
        participantUser.conversations = participantUser.conversations.filter(
          (conv) => conv.id.toString() !== conversation._id.toString()
        );
        participantUser.conversations.unshift({
          id: conversation._id,
          isGroup: true,
        });
      }

      await participantUser.save().then(() => {
        io.emit("group_conversation_updated", {
          conversations: participantUser.conversations,
          id: participantUser._id,
        });
        io.emit("group_add", {
          groupId: conversation._id,
        });
      });
      // Emit event for this participant

      addSystemMessage(
        conversation._id,
        `${user.username} added ${participantUser.username}`,
        io
      );
    }
    conversation.save();

    return res
      .status(200)
      .json({ valid: true, message: "User(s) Added Successfully" });
  } catch (error) {
    console.log("error in adding users to group: ", error);
    return res
      .status(500)
      .json({ valid: false, error: "Internal Server Error" });
  }
};
