import React, { useState, useRef, useEffect } from "react";
import sendIcon from "../../assets/send.svg";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatBox = ({
  currentChannel,
  userId,
  isTyping,
  setTyping,
  recieverId,
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      const response = await fetch(
        `http://localhost:3000/messages/send/${currentChannel}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ message: message }),
        }
      );
      const result = await response.json();
      if (result.valid) {
        socket.emit("send_message", {
          message: message,
          channel: currentChannel,
        });
        setMessage(""); // Clear the message after sending
      } else {
        console.log(result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsSending(false);
  };

  const handleKeyDown = (e) => {
    // Prevent sending if a message is already being sent
    if (isSending) return;

    // Allow Shift + Enter to create a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default action (like form submission)
      handleSendMessage();
      setTyping(false);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (currentChannel == recieverId) {
      socket.emit("typing", { channelId: currentChannel, typerId: userId });
      setTyping(true);
    }
    setTimeout(() => {
      socket.emit("stop_typing", {
        channelId: currentChannel,
        typerId: userId,
      });
      setTyping(false);
    }, 3000);
  };

  useEffect(() => {
    setTimeout(() => {
      if (textareaRef.current) {
        const lineHeight = parseInt(
          getComputedStyle(textareaRef.current).lineHeight
        );
        const maxRows = 4;
        const currentRows = Math.min(
          Math.floor(textareaRef.current.scrollHeight / lineHeight),
          maxRows
        );
        // Set the number of rows based on scrollHeight or revert to 1 row if empty
        textareaRef.current.rows = message.trim() ? currentRows : 1;
      }
    }, 0);
  }, [message]);

  return (
    <div className="fixed bottom-0 left-0 md:left-72 right-0 p-4 pb-16">
      <div className="relative w-full bg-gray-800 shadow-xl">
        <textarea
          ref={textareaRef}
          className="w-full px-6 py-2 text-lg font-semibold font-sans bg-transparent border-none outline-none text-white resize-none"
          style={{
            wordBreak: "break-word", // Ensures long words break to next line
            whiteSpace: "pre-wrap", // Allows for line breaks in the message
          }}
          rows={1}
          placeholder="Type a message..."
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown} // Set the event handler
          maxLength={2000}
        />
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
          <button
            className={`w-12 h-12 rounded-full bg-violet-500 shadow-xl flex items-center justify-center hover:w-14 hover:h-14 transition-all duration-200 ease-in-out ${
              isSending && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleSendMessage}
            disabled={isSending} // Disable button while sending
          >
            <img src={sendIcon} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
