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
      required: true,
      ref: "usersInfo",
    },
    recieverId: {
      type: String,
      required: true,
      ref: "usersInfo",
    },
    message: { type: String, required: true, ref: "messages" },
  },
  { timestamps: true }
);

export const messageModel = message.model("messages", messageSchema);
