import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import defaultPfp from "../../assets/defaultPfp.png";
import { io } from "socket.io-client";
import MessageLoader from "./MessageLoader";

const socket = io("http://localhost:3000");

const ConvoBox = ({
  participant,
  searchQuery,
  user,
  isGroup,
  id,
  unreadCounterGroups,
}) => {
  const [participantDetail, setParticipant] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // To get the current URL
  const [lastMessage, setLastMsg] = useState("");
  const [messages, setMessages] = useState(null);
  const [groupDetail, setGroupDetail] = useState(null);
  const [unreadCounter, setUnreadCounter] = useState(unreadCounterGroups || 0);

  // Extract the channel query parameter
  const queryParams = new URLSearchParams(location.search);
  const currentChannel = queryParams.get("channel");
  const currentGroup = queryParams.get("groupId");

  const participantDetails = async () => {
    if (!participant) return;
    const response = await fetch("http://localhost:3000/participant/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        participant: participant,
      }),
    });
    const result = await response.json();
    if (result.valid && response.ok) {
      setParticipant(result.userDetails);
    } else {
      console.log(result.error);
    }
  };

  const fetchGroupDetails = async () => {
    if (!isGroup || !id) return;
    const response = await fetch("http://localhost:3000/participant/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ isGroup: isGroup, id: id }),
    });
    const result = await response.json();
    if (result.valid && response.ok) {
      setGroupDetail(result.convDetails);
    } else {
      console.error(result.error);
    }
  };

  const getLastMessage = async () => {
    if (!participant || isGroup) return;

    const response = await fetch(
      `http://localhost:3000/messages/${participant}`,
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
      if (result.lastMessage && result.lastMessage.senderId == participant) {
        setLastMsg(result.lastMessage.message);
        setMessages(result.messages);
      }
    } else {
      console.log(result.error);
    }
  };

  useEffect(() => {
    isGroup ? fetchGroupDetails() : participantDetails();

    getLastMessage();
  }, []);

  const handleClick = () => {
    if (isGroup) {
      navigate(`/home?groupId=${id}`);
    } else {
      navigate(`/home?channel=${participant}`);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      getLastMessage();
      if (isGroup && data.channel === id && user?._id != data.senderId) {
        setUnreadCounter((prev) => prev + 1);
      }
    });
    socket.on("message_read", (data) => {
      getLastMessage();
    });
    socket.on("group_message_read", (data) => {
      setUnreadCounter(0);
    });
    return () => {
      socket.off("receive_message");
      socket.off("message_read");
      socket.off("group_message_read");
    };
  }, []);

  useEffect(() => {
    socket.on("user_status_change", (data) => {
      if (data.userId === participant) {
        setParticipant((prev) => ({ ...prev, isActive: data.isActive }));
      }
    });

    socket.on("profileUpdated", (updatedUser) => {
      if (updatedUser.id === participant) {
        setParticipant((prevUser) => ({ ...prevUser, ...updatedUser })); // Merge old and updated user data
      }
    });

    socket.on("groupProfileUpdated", (updatedGroup) => {
      if (updatedGroup.id === id) {
        setGroupDetail((prevGroup) => ({ ...prevGroup, ...updatedGroup })); // Merge old and updated user data
      }
    });

    return () => {
      socket.off("user_status_change");
      socket.off("profileUpdated");
      socket.off("groupProfileUpdated");
    };
  }, []);

  const isMatch = searchQuery
    ? (isGroup &&
        groupDetail?.groupName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (!isGroup &&
        participantDetail &&
        (participantDetail.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          participantDetail.displayName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())))
    : true;

  if (!participantDetail && !groupDetail) return <MessageLoader />;

  return isMatch ? (
    <div
      className={`w-full h-12 flex items-center px-2 transition-all duration-300 ${
        currentChannel === participant || currentGroup === id
          ? "bg-gradient-to-r from-gray-800 to-slate-700 opacity-75"
          : "hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-600"
      }`}
      onClick={handleClick}
    >
      {/* Profile Image */}
      <div className="relative flex items-center">
        <img
          src={
            isGroup
              ? groupDetail.groupAvatar || defaultPfp
              : participantDetail?.avatarURL || defaultPfp
          }
          alt="Profile"
          className="rounded-full h-8 w-8"
        />
        {!isGroup && (
          <div
            className={`absolute bottom-0 right-0 rounded-full border-2 ${
              participantDetail?.isActive
                ? "bg-green-500 border-gray-800 h-3 w-3"
                : "bg-gray-500 border-gray-800 h-3 w-3"
            }`}
          ></div>
        )}
      </div>

      {/* Details Section */}
      <div className="ml-2 flex flex-col justify-center">
        <h3 className="text-white text-sm">
          {isGroup
            ? groupDetail.groupName || "Unnamed Group"
            : participantDetail?.displayName || participantDetail?.username}
        </h3>
        <h5 className="text-gray-400 text-xs">
          {isGroup
            ? `${groupDetail.groupParticipants.length} participants`
            : lastMessage ||
              (participantDetail?.isActive ? "Online" : "Offline")}
        </h5>
      </div>

      {participant && messages && messages.some((msg) => !msg.read) && (
        <div className="relative flex justify-end items-end ml-auto">
          <div className="bg-red-600 h-8 w-8 rounded-full">
            <h3 className=" text-white text-center mt-1">
              {messages.filter((msg) => !msg.read).length}
            </h3>
          </div>
        </div>
      )}
      {isGroup && unreadCounter > 0 && (
        <div className="relative flex justify-end items-end ml-auto">
          <div className="bg-red-600 h-8 w-8 rounded-full">
            <h3 className=" text-white text-center mt-1">{unreadCounter}</h3>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default ConvoBox;
