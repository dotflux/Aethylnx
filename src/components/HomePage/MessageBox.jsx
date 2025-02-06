import React, { useState, useEffect } from "react";
import defaultPfp from "../../assets/defaultPfp.png";
import MessageLoader from "./MessageLoader";
import { io } from "socket.io-client";
import editIcon from "../../assets/edit.svg";
import deleteIcon from "../../assets/deleteIcon.svg";
import replyIcon from "../../assets/reply.svg";
import UngroupedMessages from "./UngroupedMessages";
import GroupedMessages from "./GroupedMessages";

const socket = io("http://localhost:3000");

const MessageBox = ({
  messageContent,
  senderId,
  lastSenderId,
  createdAt,
  lastCreatedAt,
  messageId,
  userId,
  isEdited,
  popupMessageId,
  setPopupMessageId,
  fileUrl,
  fileType,
  setPopup,
  showPopup,
  isBlocked,
  setReply,
  repliedMessages,
  setRepliedContent,
  setSender,
  isSystem,
  blockedUsers,
}) => {
  const [senderInfo, setSenderInfo] = useState(null);
  const [displayDate, setDisplayDate] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [repliedTo, setReplied] = useState(null);

  const closePopup = () => setPopupMessageId(null);

  const deleteMsg = async () => {
    if (!senderId) return;
    try {
      const response = await fetch(`http://localhost:3000/message/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: senderId,
          messageId: messageId,
        }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.valid && response.ok) {
        socket.emit("delete_message", messageId);
      } else {
        console.error(result.error);

        return;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const replyMsg = async () => {
    setReply(messageId);
    setRepliedContent(messageContent);
  };

  const fetchReply = async () => {
    if (!repliedMessages) return;
    try {
      const response = await fetch(`http://localhost:3000/message/byId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: repliedMessages,
        }),
        credentials: "include",
      });
      const result = await response.json();
      if (!result.valid && response.ok) {
        setReplied(result.repliedTo);
      }
      if (result.valid && response.ok) {
        setReplied(result.repliedTo);
        setReply(null);
        setRepliedContent(null);
      } else {
        console.error(result.error);

        return;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    socket.on("edit_message", (data) => {
      fetchReply();
    });
    socket.on("delete_message", (data) => {
      fetchReply();
    });
  }, []);

  useEffect(() => {
    fetchReply();
  }, [repliedMessages]);

  const togglePopup = () => {
    setPopupMessageId((prevId) => (prevId === messageId ? null : messageId));
    if (showPopup) setPopup(false);
  };

  // Fetch sender info when the sender changes
  useEffect(() => {
    if (!senderId) return;

    const fetchSenderInfo = async () => {
      const response = await fetch("http://localhost:3000/sender/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ senderId }),
      });
      const result = await response.json();
      if (result.valid && response.ok) {
        setSenderInfo(result.senderDetails);
        if (setSender) setSender(result.senderDetails);
      } else {
        console.error(result.error);
      }
    };

    fetchSenderInfo();
  }, [senderId]);

  useEffect(() => {
    socket.on("profileUpdated", (updatedUser) => {
      if (updatedUser.id === senderId) {
        setSenderInfo((prevUser) => ({ ...prevUser, ...updatedUser })); // Merge old and updated user data
      }
    });
    // Cleanup on component unmount
    return () => {
      socket.off("profileUpdated");
    };
  }, []);

  return (
    <div
      className={`w-full hover:bg-slate-900 hover:rounded-lg ${
        senderId !== lastSenderId && "mt-4"
      } ${displayDate ? "mt-4" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isSystem ? (
        <div className="bg-slate-800 mb-2">
          <h2 className="text-white text-center text-sm">{messageContent}</h2>
        </div>
      ) : (
        <div>
          {senderInfo ? (
            <div className="flex items-start">
              {(senderId !== lastSenderId || displayDate) && (
                <UngroupedMessages
                  senderInfo={senderInfo}
                  closePopup={closePopup}
                  isBlocked={isBlocked}
                  popupMessageId={popupMessageId}
                  defaultPfp={defaultPfp}
                  displayDate={displayDate}
                  messageId={messageId}
                  messageContent={messageContent}
                  fileUrl={fileUrl}
                  fileType={fileType}
                  isEdited={isEdited}
                  userId={userId}
                  senderId={senderId}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  socket={socket}
                  togglePopup={togglePopup}
                  repliedMessages={repliedMessages}
                  repliedTo={repliedTo}
                  blockedUsers={blockedUsers}
                />
              )}
              <GroupedMessages
                displayDate={displayDate}
                messageId={messageId}
                messageContent={messageContent}
                fileUrl={fileUrl}
                fileType={fileType}
                isEdited={isEdited}
                userId={userId}
                senderId={senderId}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                socket={socket}
                createdAt={createdAt}
                lastSenderId={lastSenderId}
                lastCreatedAt={lastCreatedAt}
                setDisplayDate={setDisplayDate}
                repliedMessages={repliedMessages}
                repliedTo={repliedTo}
                blockedUsers={blockedUsers}
              />

              {/* Edit/Delete Buttons */}
              {isHovered && (
                <div className="flex items-center space-x-2 ml-auto">
                  <img
                    src={replyIcon}
                    alt="reply"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => replyMsg()}
                  />
                  {userId === senderId && (
                    <div className="flex items-center space-x-2 ml-auto">
                      <img
                        src={editIcon}
                        alt="Edit"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => {
                          setIsEditing(true);
                        }}
                      />
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => deleteMsg()}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <MessageLoader />
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBox;
