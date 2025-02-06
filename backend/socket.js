import { userModel } from "./models/userModel.js";
import { messageModel } from "./models/messageModel.js";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    io.emit("user_online");
    // Handle receiving a new message
    socket.on("send_message", (data) => {
      io.emit("receive_message", data); // Broadcast to all connected clients
    });
    socket.on("edit_message", (message) => {
      io.emit("edit_message", message);
    });

    socket.on("delete_message", (messageId) => {
      io.emit("delete_message", messageId);
    });

    // Handle user going online
    socket.on("user_online", async (userId) => {
      try {
        await userModel.updateOne({ _id: userId }, { isActive: true });
        io.emit("user_status_change", { userId, isActive: true });
      } catch (error) {
        console.error("Error updating user status to online:", error);
      }
    });
    // On the server (Socket.IO event handling)
    socket.on("profileUpdated", (updatedUserInfo) => {
      socket.broadcast.emit("profileUpdated", updatedUserInfo); // Emit to other clients
    });

    socket.on("groupProfileUpdated", (updatedGroup) => {
      io.emit("groupProfileUpdated", updatedGroup);
    });

    // Handle user going offline
    socket.on("user_offline", async (userId) => {
      try {
        await userModel.updateOne({ _id: userId }, { isActive: false });
        io.emit("user_status_change", { userId, isActive: false });
      } catch (error) {
        console.error("Error updating user status to offline:", error);
      }
    });

    // Handle typing event
    socket.on("typing", ({ channelId, typerId, typerUsername }) => {
      socket.broadcast.emit("typing", { channelId, typerId, typerUsername });
    });

    // Handle stop typing event
    socket.on("stop_typing", ({ channelId, typerId }) => {
      socket.broadcast.emit("stop_typing", { channelId, typerId });
    });

    socket.on("message_read", async (data) => {
      const message = await messageModel.findOne({ _id: data.messageId });
      if (message && message.recieverId == data.recieverId) {
        message.read = true;
        message.save();
      }
      socket.broadcast.emit("message_read");
    });

    socket.on("group_message_read", async (data) => {
      const user = await userModel.findOne({ _id: data.userId });
      if (user && user._id == data.userId) {
        user.conversations.forEach(async (conv) => {
          if (conv.id == data.groupId) {
            conv.unreadCounter = 0;
            user.save();
          }
        });
      }
      socket.broadcast.emit("group_message_read");
    });

    socket.on("group_remove", (data) => {
      io.emit("group_remove", {
        removedId: data.removedId,
        groupId: data.groupId,
      });
    });
    socket.on("group_leave", (data) => {
      io.emit("group_leave", data);
    });

    socket.on("new_system_msg", (data) => {
      io.emit("new_system_msg", data);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      io.emit("user_offline");
    });
  });
};
