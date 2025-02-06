import { userModel } from "./models/userModel.js";
import { conversationModel } from "./models/conversationModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { addSystemMessage } from "./systemMessage.js";

dotenv.config();

export const leaveGroup = async (req, res, io) => {
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
    const groupId = req.body.groupId;
    if (!groupId) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid Parameters" });
    }

    const conversation = await conversationModel.findOne({ _id: groupId });
    if (!conversation) {
      return res
        .status(400)
        .json({ valid: false, error: "No such conversation" });
    }
    if (!conversation.participants.includes(user._id)) {
      return res.status(400).json({ valid: false, error: "Not a participant" });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: user._id },
      {
        $pull: {
          conversations: {
            id: conversation._id,
            isGroup: true,
          },
        },
      },
      { new: true }
    );
    const updatedGroup = await conversationModel.findOneAndUpdate(
      { _id: conversation._id },
      {
        $pull: {
          participants: user._id,
        },
      },
      { new: true }
    );
    if (updatedUser.modifiedCount === 0 || updatedGroup.modifiedCount === 0) {
      return res.status(404).json({
        valid: false,
        error: "Conversation not found or user already left",
      });
    }

    if (updatedGroup.participants.length <= 0) {
      await conversationModel.deleteOne({ _id: conversation._id });
      return res.status(200).json({ valid: true, message: "Group Left" });
    }

    if (updatedGroup.admins.includes(user._id)) {
      await conversationModel.updateOne(
        { _id: conversation._id },
        {
          $pull: {
            admins: user._id,
          },
        }
      );
      // Select a random participant
      const randomParticipant =
        updatedGroup.participants[
          Math.floor(Math.random() * updatedGroup.participants.length)
        ];

      await conversationModel.updateOne(
        { _id: updatedGroup._id },
        {
          $addToSet: {
            admins: randomParticipant,
          },
        }
      );
    }

    io.emit("group_leave", {
      userId: user._id,
      groupId: conversation._id,
      newParticipants: updatedGroup.participants || 0,
    });

    io.emit("group_conversation_updated", {
      conversations: updatedUser.conversations,
      id: user._id,
    });

    addSystemMessage(conversation._id, `${user.username} left the group`, io);

    return res.status(200).json({ valid: true, message: "Group Left" });
  } catch (error) {
    console.log("error in leaving group: ", error);
    return res
      .status(500)
      .json({ valid: false, error: "Internal Server Error" });
  }
};
