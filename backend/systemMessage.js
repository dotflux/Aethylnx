import { messageModel } from "./models/messageModel.js";
import { conversationModel } from "./models/conversationModel.js";

export const addSystemMessage = async (groupId, message, io) => {
  try {
    const systemMsg = new messageModel({
      message: message,
      system: true,
    });
    const conversation = await conversationModel.findOne({ _id: groupId });
    systemMsg.save();
    conversation.messages.push(systemMsg._id);
    conversation.save();
    io.emit("new_system_msg", {
      id: groupId,
    });
  } catch (error) {
    console.log("error in sending system message: ", error);
  }
};
