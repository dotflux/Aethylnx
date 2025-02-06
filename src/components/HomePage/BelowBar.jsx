import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import defaultPfp from "../../assets/defaultPfp.png";
import userSettings from "../../assets/userSettings.svg";
import userGroup from "../../assets/groupAdd.svg";
import createGroup from "../../assets/usergroup.svg";
import messageIcon from "../../assets/messages.svg";
import UserInfoPopup from "./UserInfoPopup";
import GroupCreateModal from "./GroupCreateModal";

const BelowBar = ({ user }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  return (
    <div>
      {user ? (
        <div className="fixed bottom-0 left-0 right-0 flex justify-start h-12 w-full bg-gray-800 z-40">
          {/* Profile Section */}
          <div
            className="relative flex items-center hover:bg-slate-700 hover:cursor-pointer px-6 -ml-4"
            onMouseEnter={(e) => {
              if (user.displayName) {
                const statusElement =
                  e.currentTarget.querySelector(".status-text");
                if (statusElement) statusElement.innerText = user.username;
              }
            }}
            onMouseLeave={(e) => {
              const statusElement =
                e.currentTarget.querySelector(".status-text");
              if (statusElement)
                statusElement.innerText = user.isActive ? "Online" : "Offline";
            }}
            onClick={() => setShowPopup(!showPopup)} // Toggle popup visibility
          >
            <div className="relative flex items-center">
              <img
                src={user.avatarURL === "" ? defaultPfp : user.avatarURL}
                className="justify-start relative rounded-full m-1 h-8 w-8"
                alt="Profile"
              />
              <div
                className={`absolute bottom-0 right-0 rounded-full border-2 ${
                  user.isActive
                    ? "bg-green-500 border-black h-3 w-3 mb-1 mr-1"
                    : "bg-gray-500 border-black h-3 w-3 mb-1 mr-1"
                }`}
              ></div>
            </div>
            <div className="ml-2">
              <h3 className="mt-2 text-white text-sm">
                {user.displayName === "" ? user.username : user.displayName}
              </h3>
              <h5 className="status-text text-gray-400 text-xs mb-1 relative">
                {user.isActive ? "Online" : "Offline"}
              </h5>
            </div>
          </div>

          {/* UserInfoPopup */}
          {showPopup && (
            <div className="absolute bottom-14 left-4">
              <UserInfoPopup
                avatarUrl={user.avatarURL}
                username={user.username}
                displayname={user.displayName}
                isActive={user.isActive}
                bio={user.bio}
                showProfileButtons={true}
                closePopup={() => setShowPopup(false)}
              />
            </div>
          )}

          {showGroupModal && (
            <div>
              <GroupCreateModal
                user={user}
                isOpen={showGroupModal}
                onClose={() => setShowGroupModal(false)}
              />
            </div>
          )}

          {/* Navigation Icons */}
          <div className="flex space-x-6 items-center justify-center m-auto">
            <Link to="/home/find">
              <img src={userGroup} alt="Friends" className="h-6 w-6" />
            </Link>
            <Link to="/home">
              <img src={messageIcon} alt="Messages" className="h-6 w-6" />
            </Link>
            <img
              src={createGroup}
              alt="Group"
              className="h-6 w-6 hover:cursor-pointer"
              onClick={() => setShowGroupModal(true)}
            />
            <Link to="/home/settings">
              <img src={userSettings} alt="Settings" className="h-6 w-6" />
            </Link>
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default BelowBar;
