import React from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import defaultPfp from "../../assets/defaultPfp.png";
import userSettings from "../../assets/userSettings.svg";
import userGroup from "../../assets/usergroup.svg";
import messageIcon from "../../assets/messages.svg";

const socket = io("http://localhost:3000");

const BelowBar = ({ user }) => {
  // Emit isActive status when user connects or disconnects
  useEffect(() => {
    if (user) {
      // Emit user online status when they connect
      socket.emit("user_online", user._id);

      // Cleanup: Emit user offline status when they disconnect
      return () => {
        socket.emit("user_offline", user._id);
      };
    }
  }, [user]);
  return (
    <div>
      <div className="fixed bottom-0 left-0 right-0 flex justify-start h-12 w-full bg-gray-800">
        <div className="relative flex items-center">
          <img
            src={defaultPfp}
            className="justify-start relative rounded-full m-1 h-10 w-10"
          />
          <div
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 ${
              user
                ? user.isActive
                  ? "bg-green-500 border-white"
                  : "bg-gray-500 border-gray-300"
                : "bg-gray-500 border-gray-300"
            }`}
          ></div>
        </div>
        <div className="items-center ml-1">
          <h3 className="mt-2 text-white flex relative text-sm">
            {user ? user.username : "Loading.."}
          </h3>
          <h5 className=" text-gray-400 text-xs">
            {user ? (user.isActive ? "Online" : "Offline") : "Loading.."}
          </h5>
        </div>

        <div className="flex space-x-6 items-center justify-center m-auto">
          <Link to="/home/friends">
            <img src={userGroup} alt="friends" className="h-6 w-6" />
          </Link>
          <Link to="/home">
            <img src={messageIcon} alt="messages" className="h-6 w-6" />
          </Link>
          <Link to="/home/settings">
            <img src={userSettings} alt="settings" className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BelowBar;
