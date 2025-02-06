import React, { useEffect } from "react";

export const chatWindowSocketHandler = async ({
  user,
  socket,
  currentChannel,
  setMessages,
  messages,
  fetchMessages,
  toast,
  setTypingId,
  setTyping,
  typingId,
  Bounce,
}) => {
  useEffect(() => {
    fetchMessages();

    socket.on("receive_message", (newMessage) => {
      fetchMessages();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log(
        typeof user._id,
        typeof newMessage.senderId,
        typeof newMessage.recieverId
      );
      if (
        user._id === newMessage.recieverId
        // current user is the receiver
      ) {
        console.log("CONDITION FUCKIN MATCHED");
      }
      if (
        user._id === newMessage.recieverId
        // current user is the receiver
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

      // Filter unread messages
      const unreadMessages = messages.filter(
        (msg) => !msg.read && msg.recieverId === user._id
      );

      // Emit message_read event for each unread message
      unreadMessages.forEach((msg) => {
        socket.emit("message_read", {
          messageId: msg._id,
          recieverId: user._id,
        });
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
    socket.on("typing", ({ channelId, typerId }) => {
      if (channelId == currentChannel) {
        setTypingId(typerId);
        setTyping(true);
      }
    });
    socket.on("stop_typing", ({ channelId, typerId }) => {
      if (channelId == currentChannel && typerId == typingId) setTypingId(null);
      setTyping(false);
    });
    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, []);
};
