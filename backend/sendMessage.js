import { conversationModel } from "./models/conversationModel.js";
import { messageModel } from "./models/messageModel.js";
import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { Readable } from "stream";

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

export const sendMessage = async (req, res, io) => {
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
    const recieverId = req.params.id;
    if (!recieverId) {
      return res
        .status(402)
        .json({ valid: false, error: "Receiver is required" });
    }
    const senderUser = await userModel.findOne({ userId: decoded.id });
    const recieverUser = await userModel.findById(recieverId);

    if (!senderUser) {
      return res.status(407).json({ valid: fasle, error: "Invalid user" });
    }

    if (!recieverUser) {
      return res.status(408).json({ valid: false, error: "Invalid reciever" });
    }

    if (recieverId == senderUser._id) {
      return res
        .status(400)
        .json({ valid: false, error: "Cannot send a message to yourself" });
    }
    if (recieverUser.blockedUsers.includes(senderUser._id)) {
      return res
        .status(409)
        .json({ valid: false, error: "Message Failed To deliver" });
    }
    if (senderUser.blockedUsers.includes(recieverUser._id)) {
      return res
        .status(409)
        .json({ valid: false, error: "Can't send message to blocked user" });
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

    let conversation = await conversationModel.findOne({
      participants: { $all: [senderUser._id, recieverId] },
      $or: [{ isGroup: false }, { isGroup: { $exists: false } }],
    });

    // If conversation doesn't exist or is a group with multiple participants, create a new one
    if (!conversation || conversation.participants.length > 2) {
      conversation = new conversationModel({
        participants: [senderUser._id, recieverId],
        isGroup: false,
        messages: [],
      });

      // Add conversation to both users
      senderUser.conversations.push({
        id: conversation._id,
        participant: recieverId,
      });

      recieverUser.conversations.push({
        id: conversation._id,
        participant: senderUser._id,
      });

      if (
        senderUser.conversations[0].id.toString() !==
        conversation._id.toString()
      ) {
        senderUser.conversations = senderUser.conversations.filter(
          (convo) => convo.id.toString() !== conversation._id.toString()
        );
        senderUser.conversations.unshift({
          id: conversation._id,
          participant: recieverId,
        });
        io.emit("conversation_updated", {
          conversations: senderUser.conversations,
          id: senderUser._id,
        });
      }

      if (
        recieverUser.conversations[0].id.toString() !==
        conversation._id.toString()
      ) {
        recieverUser.conversations = recieverUser.conversations.filter(
          (convo) => convo.id.toString() !== conversation._id.toString()
        );
        recieverUser.conversations.unshift({
          id: conversation._id,
          participant: senderUser._id,
        });
        io.emit("conversation_updated", {
          conversations: recieverUser.conversations,
          id: recieverUser._id,
        });
      }

      await Promise.all([senderUser.save(), recieverUser.save()]);
    }

    // Create a new message
    const newMessage = new messageModel({
      senderId: senderUser._id,
      recieverId,
      message,
      fileUrl,
      fileType,
      replyTo: reply,
    });

    // Add message to conversation
    conversation.messages.push(newMessage._id);

    // Reorder the conversations: move the new conversation to the front only if it's not already the first one
    if (
      senderUser.conversations[0].id.toString() !== conversation._id.toString()
    ) {
      senderUser.conversations = senderUser.conversations.filter(
        (convo) => convo.id.toString() !== conversation._id.toString()
      );
      senderUser.conversations.unshift({
        id: conversation._id,
        participant: recieverId,
      });
      io.emit("conversation_updated", {
        conversations: senderUser.conversations,
        id: senderUser._id,
      });
    }

    if (
      recieverUser.conversations[0].id.toString() !==
      conversation._id.toString()
    ) {
      recieverUser.conversations = recieverUser.conversations.filter(
        (convo) => convo.id.toString() !== conversation._id.toString()
      );
      recieverUser.conversations.unshift({
        id: conversation._id,
        participant: senderUser._id,
      });
      io.emit("conversation_updated", {
        conversations: recieverUser.conversations,
        id: recieverUser._id,
      });
    }

    // Save everything
    await Promise.all([
      conversation.save(),
      newMessage.save(),
      senderUser.save(),
      recieverUser.save(),
    ]);

    res
      .status(200)
      .json({
        valid: true,
        messageId: newMessage._id,
        senderId: senderUser._id,
        recieverId: recieverUser._id,
      });
  } catch (error) {
    console.error(`Error in sending message: ${error}`);
    res.status(500).json({ valid: false, error: "Internal server error" });
  }
};
