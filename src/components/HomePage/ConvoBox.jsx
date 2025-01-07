import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import defaultPfp from "../../assets/defaultPfp.png";
import { io } from "socket.io-client";
import MessageLoader from "./MessageLoader";

const socket = io("http://localhost:3000");

const ConvoBox = ({ participant }) => {
  const [participantDetail, setParticipant] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // To get the current URL

  // Extract the channel query parameter
  const queryParams = new URLSearchParams(location.search);
  const currentChannel = queryParams.get("channel");

  const participantDetails = async () => {
    const response = await fetch("http://localhost:3000/participant/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ participant }),
    });
    const result = await response.json();
    if (result.valid) {
      setParticipant(result.userDetails);
    } else {
      console.log(result.error);
    }
  };

  useEffect(() => {
    participantDetails();
  }, [participant, participantDetail]);

  const handleClick = () => {
    navigate(`/home?channel=${participant}`);
  };

  useEffect(() => {
    socket.on("user_status_change", (data) => {
      if (data.userId === participant) {
        setParticipant((prev) => ({ ...prev, isActive: data.isActive }));
      }
    });

    socket.on("profileUpdated", (updatedUser) => {
      if (updatedUser._id === participantDetail._id) {
        setParticipant((prevUser) => ({ ...prevUser, ...updatedUser })); // Merge old and updated user data
      }
    });

    return () => {
      socket.off("user_status_change");
      socket.off("profileUpdated");
    };
  }, [participant, participantDetail]);
  return (
    <div>
      {participantDetail ? (
        <div
          className={`w-full h-12 flex items-center px-2 transition-all duration-300 ${
            currentChannel === participant
              ? "bg-gradient-to-r from-gray-800 to-slate-700 opacity-75"
              : "bg-slate-950 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-600"
          }`}
          onClick={handleClick}
        >
          {/* Profile Image and Status Circle */}
          <div className="relative flex items-center">
            <img
              src={
                participantDetail.avatarURL === ""
                  ? defaultPfp
                  : participantDetail.avatarURL
              }
              className="rounded-full h-8 w-8"
            />
            <div
              className={`absolute bottom-0 right-0 rounded-full border-2 ${
                participantDetail.isActive
                  ? "bg-green-500 border-gray-800 h-3 w-3"
                  : "bg-gray-500 border-gray-800 h-3 w-3"
              }`}
            ></div>
          </div>

          {/* Username and Status */}
          <div className="ml-2 flex flex-col justify-center">
            <h3 className="text-white text-sm">
              {participantDetail.displayName === ""
                ? participantDetail.username
                : participantDetail.displayName}
            </h3>
            <h5 className="text-gray-400 text-xs">
              {participantDetail.isActive ? "Online" : "Offline"}
            </h5>
          </div>
        </div>
      ) : (
        <MessageLoader />
      )}
    </div>
  );
};

export default ConvoBox;
