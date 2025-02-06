import React, { useState } from "react";
import defaultPfp from "../../assets/defaultPfp.png";
import chatIcon from "../../assets/chat.svg";
import blockIcon from "../../assets/block.svg";
import unblockIcon from "../../assets/unblock.svg";
import { useNavigate } from "react-router-dom";

const UserBox = ({ userInfo, setError }) => {
  const navigate = useNavigate();
  const [isBlocked, setBlocked] = useState(userInfo.isBlocked);

  const blockUser = async () => {
    if (!userInfo) return;
    try {
      const response = await fetch(`http://localhost:3000/blockuser`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userInfo.username }),
      });

      const result = await response.json();
      if (result.valid && response.ok) {
        setBlocked(true);
      } else {
        console.log(result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const unblockUser = async () => {
    if (!userInfo) return;
    try {
      const response = await fetch(`http://localhost:3000/unblockuser`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userInfo.username }),
      });

      const result = await response.json();
      if (result.valid && response.ok) {
        setBlocked(false);
      } else {
        console.log(result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="relative">
      <div className="bg-slate-950 w-full rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center ml-2">
            <img
              src={userInfo.avatarUrl === "" ? defaultPfp : userInfo.avatarUrl}
              alt="pfp"
              className="rounded-full h-12 w-12"
            />
            <div className="flex-col text-start ml-2 relative">
              <h3 className="text-white">{userInfo.username}</h3>
              <h5 className="text-slate-400 text-sm">{userInfo.displayName}</h5>
            </div>
          </div>
          <div className="flex items-center space-x-3 mr-2">
            <img
              src={chatIcon}
              alt="message"
              className="cursor-pointer"
              onClick={() => {
                navigate(`/home?channel=${userInfo.id}`);
              }}
            />
            {isBlocked ? (
              <img
                src={unblockIcon}
                alt="unblock"
                className="cursor-pointer"
                onClick={unblockUser}
              />
            ) : (
              <img
                src={blockIcon}
                alt="block"
                className="cursor-pointer"
                onClick={blockUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
