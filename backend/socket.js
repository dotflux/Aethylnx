import { userModel } from "./models/userModel.js";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    // Handle receiving a new message
    socket.on("send_message", (data) => {
      io.emit("receive_message", data); // Broadcast to all connected clients
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
    socket.on("typing", ({ channelId, typerId }) => {
      socket.to(channelId).emit("typing", { channelId, typerId });
    });

    // Handle stop typing event
    socket.on("stop_typing", ({ channelId, typerId }) => {
      socket.to(channelId).emit("stop_typing", { channelId, typerId });
    });

    // Handle user disconnection
    socket.on("disconnect", () => {});
  });
};
