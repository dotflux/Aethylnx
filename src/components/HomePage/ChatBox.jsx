import React, { useState, useRef, useEffect } from "react";
import sendIcon from "../../assets/send.svg";
import fileIcon from "../../assets/file.svg";
import closeIcon from "../../assets/close.svg"; // Import a close icon for the "X" button
import io from "socket.io-client";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderModal from "../ProfilePage/Pfp/LoaderModal";
import { debounce } from "lodash";

const socket = io("http://localhost:3000");

const ChatBox = ({
  currentChannel,
  userId,
  isTyping,
  setTyping,
  recieverId,
  userAvatar,
  userUsername,
  userDisplayName,
  replyTo,
  isGroup,
  groupParticipants,
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files[0] && !file) {
      setFile(e.target.files[0]);
    }
  };

  // Remove the selected file
  const handleRemoveFile = () => {
    setFile(null);
  };

  // Handle sending the message
  const handleSendMessage = async () => {
    if (!file && !message.trim()) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append("message", message);
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          // 10MB
          toast.error("File Size Exceeds 10MB", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          setFile(null);
          setIsSending(false);
          return;
        }
        formData.append("file", file);
        setUploading(true);
      }

      formData.append("reply", replyTo);

      if (!isGroup) {
        const response = await fetch(
          `http://localhost:3000/messages/send/${currentChannel}`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const result = await response.json();
        if (result.valid && response.ok) {
          socket.emit("send_message", {
            message: message,
            channel: currentChannel,
            senderId: userId,
            recieverId: recieverId,
            senderAvatar: userAvatar,
            senderUsername: userUsername,
            senderDisplayName: userDisplayName,
            messageId: result.messageId,
          });
          setMessage("");
          setFile(null);
          setUploading(false);
        } else {
          console.log(result.error);
          toast.error(result.error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          setUploading(false);
        }
      } else {
        formData.append("groupParticipants", JSON.stringify(groupParticipants));
        formData.append("channelId", currentChannel);
        if (!groupParticipants) return;
        const response = await fetch(
          `http://localhost:3000/messages/group/send/${currentChannel}`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const result = await response.json();
        if (result.valid && response.ok) {
          socket.emit("send_message", {
            message: message,
            channel: currentChannel,
            senderId: result.senderId,
            recieverId: result.recieverId,
            senderAvatar: userAvatar,
            senderUsername: userUsername,
            senderDisplayName: userDisplayName,
            messageId: result.messageId,
          });
          setMessage("");
          setFile(null);
          setUploading(false);
        } else {
          console.log(result.error);
          toast.error(result.error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          setUploading(false);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setUploading(false);
    }

    setIsSending(false);
  };

  // Automatically adjust textarea height
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
        textareaRef.current.rows = message.trim() ? currentRows : 1;
      }
    }, 0);
  }, [message]);

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
  const stopTyping = debounce(() => {
    socket.emit("stop_typing", { channelId: currentChannel, typerId: userId });
  }, 5000);

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setTyping(true);
      socket.emit("typing", {
        channelId: currentChannel,
        typerId: userId,
        typerUsername: userUsername,
      });
    }
    stopTyping();
  };

  return (
    <div className="fixed bottom-0 left-0 md:left-72 right-0 p-4 pb-16 z-50">
      <div className="relative w-full bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        {/* File Upload Button */}
        {!file && (
          <label
            htmlFor="file-upload"
            className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer w-10 h-10 rounded-full bg-gray-700 shadow-xl flex items-center justify-center hover:bg-gray-600"
          >
            <img src={fileIcon} alt="send file" className="w-5 h-5" />
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="w-full px-14 py-2 text-lg font-semibold font-sans bg-transparent border-none outline-none text-white resize-none placeholder:text-gray-400"
          style={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
          rows={1}
          placeholder="Type a message..."
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={2000}
        />

        {/* Message Limit Warning */}
        {message.length >= 2000 && (
          <p className="text-red-500 text-sm px-4">Message Limit Exceeded</p>
        )}

        {/* File Preview Section */}
        {file && (
          <div className="flex items-center bg-gray-700 p-2 rounded-lg mt-2">
            <p className="text-white text-sm truncate">{file.name}</p>
            <button
              className="ml-auto text-red-500 hover:text-red-400"
              onClick={handleRemoveFile}
            >
              <img src={closeIcon} alt="Remove" className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Send Button */}
        <button
          className={`absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-violet-500 shadow-xl flex items-center justify-center hover:bg-violet-400 ${
            isSending && "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleSendMessage}
          disabled={isSending}
        >
          <img src={sendIcon} alt="send" className="w-5 h-6" />
        </button>
      </div>
      {uploading && <LoaderModal />}
    </div>
  );
};

export default ChatBox;
