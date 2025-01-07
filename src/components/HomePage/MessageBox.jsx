import React, { useState, useEffect } from "react";
import defaultPfp from "../../assets/defaultPfp.png";
import MessageLoader from "./MessageLoader";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const MessageBox = ({
  messageContent,
  senderId,
  lastSenderId,
  lastCreatedAt,
  createdAt,
}) => {
  const [senderInfo, setSenderInfo] = useState(null);
  const [displayDate, setDisplayDate] = useState("");

  // Fetch sender details based on senderId
  const fetchSenderInfo = async () => {
    if (!senderId) return;
    const response = await fetch("http://localhost:3000/sender/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ senderId }),
    });
    const result = await response.json();
    if (result.valid) {
      setSenderInfo(result.senderDetails);
    } else {
      console.error(result.error);
    }
  };

  // Function to format the date in the user's local timezone
  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const now = new Date();

    const isToday =
      dateObj.getDate() === now.getDate() &&
      dateObj.getMonth() === now.getMonth() &&
      dateObj.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday =
      dateObj.getDate() === yesterday.getDate() &&
      dateObj.getMonth() === yesterday.getMonth() &&
      dateObj.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return `Today ${dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    if (isYesterday) {
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

  // Compare timestamps to check if a new message group should start
  const checkGrouping = () => {
    if (!createdAt) return;

    const currentTime = new Date(createdAt).getTime();

    // Always display the date for the first message
    if (!lastCreatedAt) {
      setDisplayDate(formatDate(createdAt));
      return;
    }

    const lastTime = new Date(lastCreatedAt).getTime();

    // Check if the time difference is more than 1 minute
    if (currentTime - lastTime > 60000) {
      setDisplayDate(formatDate(createdAt));
    } else {
      setDisplayDate("");
    }
  };

  // Effect to fetch sender info and check grouping on each message
  useEffect(() => {
    fetchSenderInfo();
    checkGrouping();
  }, [senderId, createdAt, senderInfo]);

  useEffect(() => {
    socket.on("profileUpdated", (updatedUser) => {
      if (updatedUser._id === senderInfo._id) {
        setSenderInfo((prevUser) => ({ ...prevUser, ...updatedUser })); // Merge old and updated user data
      }
    });
    // Cleanup on component unmount
    return () => {
      socket.off("profileUpdated");
    };
  }, [senderId, senderInfo]);

  return (
    <div
      className={`w-full ${senderId !== lastSenderId && "mt-4"} ${
        displayDate && "mt-4"
      }`}
    >
      {senderInfo ? (
        <div className="flex items-start">
          {senderId !== lastSenderId || displayDate ? (
            <>
              <img
                src={
                  senderInfo.avatarURL === ""
                    ? defaultPfp
                    : senderInfo.avatarURL
                }
                alt="Sender's Profile"
                className="w-10 h-10 rounded-full mr-2"
              />
              <div className="flex flex-col ml-2">
                <div className="flex items-center">
                  <p className="text-sm text-slate-100 mr-2 font-bold">
                    {senderInfo.displayName === ""
                      ? senderInfo.username
                      : senderInfo.displayName}
                  </p>
                  {displayDate && (
                    <p className="text-xs text-slate-400">{displayDate}</p>
                  )}
                </div>
                <p className="text-md text-white break-words whitespace-pre-wrap">
                  {messageContent}
                </p>
              </div>
            </>
          ) : (
            <div className="ml-14">
              <p className="text-md text-white break-words whitespace-pre-wrap mt-0.5">
                {messageContent}
              </p>
            </div>
          )}
        </div>
      ) : (
        <MessageLoader />
      )}
    </div>
  );
};

export default MessageBox;
