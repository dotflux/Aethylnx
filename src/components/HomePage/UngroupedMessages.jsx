import React from "react";
import EditMessage from "./EditMessage";
import UserInfoPopup from "./UserInfoPopup";

const UngroupedMessages = ({
  senderInfo,
  senderId,
  closePopup,
  isBlocked,
  popupMessageId,
  defaultPfp,
  displayDate,
  messageId,
  messageContent,
  fileUrl,
  fileType,
  isEdited,
  isEditing,
  setIsEditing,
  socket,
  togglePopup,
  repliedMessages,
  repliedTo,
  userId,
  blockedUsers,
}) => {
  return (
    <>
      {/* Profile Picture */}
      <div onClick={() => togglePopup()}>
        <img
          src={senderInfo.avatarURL ? senderInfo.avatarURL : defaultPfp}
          alt="Sender's Profile"
          className="w-10 h-10 rounded-full mr-2 shrink-0"
        />
      </div>

      {/* Message Content */}
      <div className="flex flex-col ml-2 max-w-[80%] break-words">
        <div className="flex items-center">
          <p className="text-sm text-slate-100 mr-2 font-bold">
            {senderInfo.displayName || senderInfo.username}
          </p>
          {displayDate && (
            <p className="text-xs text-slate-400">{displayDate}</p>
          )}
        </div>

        {/* UserInfoPopup */}
        {popupMessageId === messageId && (
          <div className="absolute left-72 z-50">
            <UserInfoPopup
              avatarUrl={senderInfo.avatarURL}
              username={senderInfo.username}
              displayname={senderInfo.displayName}
              isActive={senderInfo.isActive}
              bio={senderInfo.bio}
              showSocialButtons={senderInfo._id != userId}
              showProfileButtons={senderInfo._id == userId}
              closePopup={closePopup}
              id={senderInfo._id}
              isBlocked={isBlocked}
            />
          </div>
        )}

        {/* Message Text */}
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
              <div className="flex flex-col p-2 bg-gray-800 rounded-lg">
                <div className="relative flex items-center border-l-4 border-blue-500 pl-2 text-sm text-gray-400 gap-2">
                  {/* Replied Message */}
                  {repliedTo.exists ? (
                    <>
                      <span className="font-semibold text-blue-500">
                        {repliedTo.senderDisplayName ||
                          repliedTo.senderUsername}
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
                ) : fileType && fileType !== "image" && fileType !== "video" ? (
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
    </>
  );
};

export default UngroupedMessages;
