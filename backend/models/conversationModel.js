import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const conv = mongoose.createConnection(process.env.CONNEC_STR_CONV);

conv.once("open", () => console.log("MongoDB connected to conversation model"));
conv.on("error", (err) =>
  console.error("MongoDB connection error (Conv Model):", err)
);

const convSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "usersInfo" }],
    messages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "messages", default: [] },
    ],
  },
  { timestamps: true }
);

export const conversationModel = conv.model("conversations", convSchema);
