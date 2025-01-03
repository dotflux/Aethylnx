import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MessageBox from "./MessageBox";
import ChatBox from "./ChatBox";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatWindow = ({ user }) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const chatWindowRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentChannel = queryParams.get("channel");

  // Fetch initial messages
  const fetchMessages = async () => {
    if (!user || !currentChannel) return;
    try {
      const response = await fetch(
        `http://localhost:3000/messages/${currentChannel}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();
      if (result.valid) {
        setMessages(result.messages);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle scroll event
  const handleScroll = () => {
    if (chatWindowRef.current) {
      const isAtBottom =
        chatWindowRef.current.scrollHeight -
          chatWindowRef.current.scrollTop -
          chatWindowRef.current.clientHeight <
        10;
      if (!isAtBottom) {
        setAutoScroll(false);
      } else {
        setAutoScroll(true);
      }
    }
  };

  // Scroll to bottom if auto-scroll is enabled
  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch messages and set up socket listener
  useEffect(() => {
    fetchMessages();

    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receive_message");
    };
  }, [currentChannel, user, messages]);

  return (
    <div
      ref={chatWindowRef}
      onScroll={handleScroll}
      className="fixed top-0 left-72 right-0 bottom-16 p-4 overflow-y-auto"
    >
      <div className="flex-1 overflow-y-auto p-12">
        {currentChannel ? (
          messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageBox
                key={message._id || index}
                messageContent={message.message}
                senderId={message.senderId}
              />
            ))
          ) : (
            <h1 className="text-center mt-60 text-white">
              No messages available
            </h1>
          )
        ) : (
          <h1 className="text-center mt-60 text-white">
            Chat is displayed here
          </h1>
        )}
      </div>
      {currentChannel && <ChatBox currentChannel={currentChannel} />}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
