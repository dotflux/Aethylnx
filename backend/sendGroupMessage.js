import { conversationModel } from "./models/conversationModel.js";
import { messageModel } from "./models/messageModel.js";
import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import mongoose from "mongoose";

dotenv.config();

// Function to upload file to Cloudinary using a stream
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto" }, // Automatically detect file type
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null); // End the stream
    readableStream.pipe(stream);
  });
};

export const sendGroupMessage = async (req, res, io) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "Token Not Found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }

    const message = req.body.message || "";
    const groupId = req.params.id;
    const groupParticipants = JSON.parse(req.body.groupParticipants); // Convert string to array

    if (!groupParticipants) {
      return res
        .status(400)
        .json({ valid: false, error: "No participants provided" });
    }
    if (!groupId) {
      return res
        .status(402)
        .json({ valid: false, error: "Receiver is required" });
    }
    const senderUser = await userModel.findOne({ userId: decoded.id });
    const inUserModel = await userModel.findOne({ _id: groupId });

    if (!senderUser) {
      return res.status(407).json({ valid: fasle, error: "Invalid user" });
    }

    if (groupId == senderUser._id) {
      return res
        .status(400)
        .json({ valid: false, error: "Cannot send a message to yourself" });
    }
    if (inUserModel) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid parameters" });
    }

    if (message.length >= 1999) {
      return res.status(401).json({
        valid: false,
        error: "Message exceeds limit of 2000 characters",
      });
    }

    let fileUrl = null;
    let fileType = null;

    // Handle file upload
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        fileUrl = uploadResult.secure_url;
        fileType = uploadResult.resource_type;
      } catch (uploadError) {
        console.error("Error uploading file to Cloudinary:", uploadError);
        return res.status(500).json({
          valid: false,
          error: "File upload failed",
        });
      }
    }

    let reply = req.body.reply;

    if (reply === "null") {
      reply = null;
    }

    const conversation = await conversationModel.findOne({
      _id: groupId,
    });

    // If conversation doesn't exist or is a group with multiple participants, create a new one
    if (!conversation) {
      return res
        .status(404)
        .json({ valid: false, error: "Group Does'nt Exist" });
    }

    if (!conversation.participants.includes(senderUser._id)) {
      return res.status(400).json({
        valid: false,
        error: "You are not a participant of this group",
      });
    }

    // Create a new message
    const newMessage = new messageModel({
      senderId: senderUser._id,
      recieverId: null,
      message,
      fileUrl,
      fileType,
      replyTo: reply,
    });

    // Add message to conversation
    conversation.messages.push(newMessage._id);

    const updates = [];

    conversation.participants.forEach(async (participant) => {
      const participantUser = await userModel.findOne({ _id: participant });
      if (participantUser._id.toString() !== senderUser._id.toString()) {
        const updatedConvo = participantUser.conversations.find(
          (conv) => conv.id.toString() === conversation._id.toString()
        );
        if (updatedConvo) {
          updatedConvo.unreadCounter += 1;
        }
      }

      // Reorder conversations if not already at the top
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

      updates.push(
        participantUser.save().then(() => {
          io.emit("group_conversation_updated", {
            conversations: participantUser.conversations,
            id: participantUser._id,
          });
        })
      );
    });

    // Wait for all updates to complete
    await Promise.all(updates);

    // Save everything
    await Promise.all([conversation.save(), newMessage.save()]);

    res
      .status(200)
      .json({
        valid: true,
        messageId: newMessage._id,
        senderId: senderUser._id,
        recieverId: conversation._id,
      });
  } catch (error) {
    console.error(`Error in sending message: ${error}`);
    res.status(500).json({ valid: false, error: "Internal server error" });
  }
};
