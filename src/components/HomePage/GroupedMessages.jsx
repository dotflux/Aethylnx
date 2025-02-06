import React, { useEffect } from "react";
import EditMessage from "./EditMessage";

const GroupedMessages = ({
  senderId,
  displayDate,
  messageId,
  messageContent,
  fileUrl,
  fileType,
  isEdited,
  isEditing,
  setIsEditing,
  socket,
  createdAt,
  lastCreatedAt,
  lastSenderId,
  setDisplayDate,
  repliedMessages,
  repliedTo,
  blockedUsers,
}) => {
  // Format the date
  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const now = new Date();

    if (
      dateObj.getDate() === now.getDate() &&
      dateObj.getMonth() === now.getMonth() &&
      dateObj.getFullYear() === now.getFullYear()
    ) {
      return `Today ${dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      dateObj.getDate() === yesterday.getDate() &&
      dateObj.getMonth() === yesterday.getMonth() &&
      dateObj.getFullYear() === yesterday.getFullYear()
    ) {
      return `Yesterday ${dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return dateObj.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if a new group should start
  useEffect(() => {
    if (!createdAt) return;

    const currentTime = new Date(createdAt).getTime();
    const lastTime = lastCreatedAt ? new Date(lastCreatedAt).getTime() : 0;

    // If sender changed or more than 1 minute passed, show the date
    if (senderId !== lastSenderId || currentTime - lastTime > 60000) {
      setDisplayDate(formatDate(createdAt));
    } else {
      setDisplayDate("");
    }
  }, [createdAt, lastSenderId, senderId, lastCreatedAt]);

  return (
    <div>
      {!displayDate && (
        <div className="ml-14 max-w-[80%] break-words">
          {isEditing ? (
            <EditMessage
              setEditing={setIsEditing}
              senderId={senderId}
              messageId={messageId}
              initialValue={messageContent}
              onCancel={() => setIsEditing(false)}
              socket={socket}
            />
          ) : (
            <div className="text-md text-white break-words whitespace-pre-wrap mt-0.5">
              {repliedTo ? (
                <div className="flex flex-col gap-1 p-3 bg-gray-800 rounded-lg">
                  <div className="relative flex items-center justify-center gap-2 border-l-4 border-blue-500 pl-3 text-sm text-gray-400">
                    {/* Replied Message */}
                    {repliedTo.exists ? (
                      <>
                        <span className="font-semibold text-blue-500">
                          {repliedTo.senderDisplayName
                            ? repliedTo.senderDisplayName
                            : repliedTo.senderUsername}
                        </span>
                        <span>
                          {repliedTo.message.length > 10
                            ? repliedTo.message.substring(0, 10) + "..."
                            : repliedTo.message}
                        </span>
                      </>
                    ) : (
                      <span>Original Message Was Deleted</span>
                    )}
                  </div>

                  {/* Your Message */}
                  <div className="text-white">
                    {blockedUsers.includes(senderId)
                      ? "Blocked Message"
                      : messageContent}
                  </div>
                </div>
              ) : blockedUsers.includes(senderId) ? (
                "Blocked Message"
              ) : (
                messageContent
              )}

              {fileUrl && (
                <div className="file-preview">
                  {fileType === "image" ? (
                    <img
                      src={fileUrl}
                      alt="attachment"
                      className="image-preview"
                    />
                  ) : fileType === "video" ? (
                    <video
                      controls
                      src={fileUrl}
                      className="video-preview"
                    ></video>
                  ) : fileType &&
                    fileType !== "image" &&
                    fileType !== "video" ? (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                      Download File
                    </a>
                  ) : null}
                </div>
              )}

              {isEdited && (
                <span className="text-slate-400 text-xs italic ml-1">
                  (edited)
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupedMessages;
