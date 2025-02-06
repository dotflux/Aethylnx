import React, { useState, useEffect, useRef } from "react";

const EditMessage = ({
  setEditing,
  senderId,
  messageId,
  initialValue,
  onCancel,
  socket,
}) => {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);

  const editMsg = async (newMessage) => {
    if (!senderId) return;
    try {
      const response = await fetch(`http://localhost:3000/message/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: senderId,
          messageId: messageId,
          newMessage: newMessage,
        }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.valid && response.ok) {
        socket.emit("edit_message", result.editedMessage);
        setEditing(false);
      } else {
        console.error(result.error);

        return;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  // Handle key events
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      editMsg(value);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className="w-full bg-slate-800 text-white p-2 rounded resize-none outline-none h-auto"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Edit your message..."
      />
    </div>
  );
};

export default EditMessage;
