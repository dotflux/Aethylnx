import React, { useState } from "react";
import sendIcon from "../../assets/send.svg";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatBox = ({ currentChannel }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

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
        setMessage("");
      } else {
        console.log(result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission or default behavior
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-0 left-72 right-0 shadow-lg p-4 pb-16">
      <div className="relative w-full rounded-full overflow-hidden bg-gray-800 shadow-xl">
        <input
          className="w-full px-6 py-4 text-lg font-semibold font-sans bg-transparent border-none outline-none text-white"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
          <button
            className="w-12 h-12 rounded-full bg-violet-500 shadow-xl flex items-center justify-center hover:w-14 hover:h-14 transition-all duration-200 ease-in-out"
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
