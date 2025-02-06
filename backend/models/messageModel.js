import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const message = mongoose.createConnection(process.env.CONNEC_STR_CONV);

message.once("open", () => console.log("MongoDB connected to message model"));
message.on("error", (err) =>
  console.error("MongoDB connection error (Msg Model):", err)
);

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      ref: "usersInfo",
    },
    recieverId: {
      type: String,
      ref: "usersInfo",
      default: null,
    },
    edited: {
      type: Boolean,
      default: false,
      ref: "messages",
    },
    message: { type: String, ref: "messages" },
    fileUrl: { type: String },
    fileType: { type: String },
    replyTo: {
      type: String,
      ref: "messages",
    },
    read: { type: Boolean, default: false },
    system: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const messageModel = message.model("messages", messageSchema);
