import { useEffect } from "react";

export const groupChatSockets = async ({
  navigate,
  user,
  socket,
  currentChannel,
  setMessages,
  messages,
  fetchMessages,
  toast,
  setTypingId,
  setTyperUser,
  setTyping,
  groupInfo,
  Bounce,
  setTypingChannel,
  setGroupInfo,
}) => {
  useEffect(() => {
    fetchMessages();

    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      fetchMessages();
      if (
        user?._id != newMessage.senderId &&
        currentChannel != newMessage.senderId &&
        currentChannel != newMessage.recieverId
      ) {
        toast(
          <div className="flex items-center space-x-3">
            <img
              src={newMessage.senderAvatar}
              alt="Avatar"
              className="h-8 w-8 rounded-full"
            />
            <span>
              <strong>
                {newMessage?.senderDisplayName || newMessage.senderUsername}
              </strong>
              :{" "}
              {newMessage.message.length > 30
                ? newMessage.message.slice(0, 30) + "..."
                : newMessage.message}
            </span>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          }
        );
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [currentChannel]);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!currentChannel || !messages || messages.length === 0) return;

      user.conversations.forEach((conv) => {
        if (conv.id == groupInfo.id && conv.unreadCounter > 0) {
          socket.emit("group_message_read", {
            userId: user._id,
            groupId: currentChannel,
          });
        }
      });
    };

    markMessagesAsRead();
  }, [messages, currentChannel]);

  useEffect(() => {
    // Handle the "edit_message" event
    socket.on("edit_message", (newMessage) => {
      fetchMessages();
    });

    // Handle the "delete_message" event
    socket.on("delete_message", (deletedMessageId) => {
      fetchMessages();
    });

    // Cleanup the socket listeners
    return () => {
      socket.off("edit_message");
      socket.off("delete_message");
    };
  }, [currentChannel]);

  useEffect(() => {
    socket.on("typing", ({ channelId, typerId, typerUsername }) => {
      setTypingId(typerId);
      setTyperUser(typerUsername);
      setTyping(true);
      setTypingChannel(channelId);
    });
    socket.on("stop_typing", ({ channelId, typerId }) => {
      setTypingId(null);
      setTyperUser(null);
      setTyping(false);
      setTypingChannel(null);
    });
    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, []);

  useEffect(() => {
    socket.on("group_remove", (data) => {
      if (data.groupId == currentChannel && data.removedId == user._id) {
        navigate("/home");
      }
      fetchMessages();
    });
    socket.on("group_add", (data) => {
      fetchMessages();
    });
    socket.on("groupProfileUpdated", (updatedGroup) => {
      if (updatedGroup.id == currentChannel) {
        fetchMessages();
      }
    });
    socket.on("group_leave", (data) => {
      if (data.newParticipants.length > 0) {
        fetchMessages();
      }
      if (data.groupId == currentChannel && data.userId == user._id) {
        navigate("/home");
      }
    });
    socket.on("new_system_msg", (data) => {});
    return () => {
      socket.off("group_remove");
      socket.off("group_add");
      socket.off("groupProfileUpdated");
      socket.off("new_system_msg");
    };
  }, []);
};
