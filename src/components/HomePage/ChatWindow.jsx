import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MessageBox from "./MessageBox";
import ChatBox from "./ChatBox";
import io from "socket.io-client";
import defaultPfp from "../../assets/defaultPfp.png";

const socket = io("http://localhost:3000");

const ChatWindow = ({ user }) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [messages, setMessages] = useState([]);
  const [recieverInfo, setReciever] = useState(null);
  const [isTyping, setTyping] = useState(false);
  const [typingId, setTypingId] = useState(null);
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
        setReciever(result.recieverInfo);
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
  }, [currentChannel, user]);

  useEffect(() => {
    socket.on("typing", ({ channelId, typerId }) => {
      console.log("Received typerId on client:", typerId); // 🔍 Check if it's null
      setTypingId(typerId);
    });
    return () => {
      socket.off("typing");
    };
  }, [currentChannel, user, recieverInfo, isTyping]);
  return (
    <div
      ref={chatWindowRef}
      onScroll={handleScroll}
      className={`fixed top-0 left-0 bottom-16 right-0 ${
        currentChannel && "md:left-72"
      } p-4 bg-gradient-to-b from-gray-800 to-gray-900 flex-1 overflow-y-auto ${
        currentChannel ? "z-30" : "z-10"
      }`}
    >
      {currentChannel && (
        <div
          className={`fixed flex items-center ${
            currentChannel && "md:left-72"
          } left-0 top-0 right-0 bg-slate-950 w-full h-20 px-2`}
        >
          <img
            src={recieverInfo?.avatarURL || defaultPfp}
            alt="Receiver's Profile"
            className="w-14 h-14 rounded-full"
          />
          <div className="ml-4 flex flex-col justify-center">
            <h2 className="text-white text-lg font-bold leading-tight">
              {recieverInfo
                ? recieverInfo.displayName === ""
                  ? recieverInfo.username
                  : recieverInfo.displayName
                : "Reciever"}
            </h2>
            <p className="text-gray-400 text-sm">
              {recieverInfo
                ? recieverInfo.displayName === ""
                  ? ""
                  : recieverInfo.username
                : ""}
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-12">
        {currentChannel ? (
          messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageBox
                key={message._id || index}
                messageContent={message.message}
                senderId={message.senderId}
                lastSenderId={index > 0 ? messages[index - 1].senderId : null}
                createdAt={message.createdAt}
                lastCreatedAt={index > 0 ? messages[index - 1].createdAt : null}
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
      {typingId == currentChannel
        ? isTyping && (
            <h1 className="text-white text-2xl relative z-40">{`${recieverInfo.username} is typing`}</h1>
          )
        : ""}
      {currentChannel && (
        <ChatBox
          currentChannel={currentChannel}
          userId={user._id}
          isTyping={isTyping}
          setTyping={setTyping}
          recieverId={currentChannel}
        />
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
