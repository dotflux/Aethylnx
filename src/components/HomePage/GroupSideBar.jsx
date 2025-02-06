import React, { useState, useEffect } from "react";
import closeGroupSide from "../../assets/closeGroupSide.svg";
import MessageLoader from "./MessageLoader";
import defaultPfp from "../../assets/defaultPfp.png";
import groupAdd from "../../assets/groupAdd.svg";
import GroupAddModal from "./GroupAddModal";
import ManageUserInGroup from "./ManageUserInGroup";
import modifyIcon from "../../assets/modify.svg";
import GroupModifyModal from "./GroupModifyModal";
import leaveIcon from "../../assets/logout.svg";
import LeaveConfirmationModal from "./LeaveConfirmationModal";
import crown from "../../assets/crown.svg";

const GroupParticipantBox = ({ part, userId, isAdmin, groupId, isBlocked }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div
      key={part._id}
      className="w-full h-12 flex items-center px-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-600"
      onClick={() => setShowPopup(true)}
    >
      {/* Profile Image */}
      <div className="relative flex items-center">
        <img
          src={part.avatarURL || defaultPfp}
          alt="Profile"
          className="rounded-full h-8 w-8"
        />
        <div
          className={`absolute bottom-0 right-0 rounded-full border-2 ${
            part.isActive
              ? "bg-green-500 border-gray-800 h-3 w-3"
              : "bg-gray-500 border-gray-800 h-3 w-3"
          }`}
        ></div>
      </div>

      {/* User Details */}
      <div className="ml-2 flex flex-col justify-center">
        <h3 className="text-white text-sm">
          {part.displayName || part.username}
        </h3>
        <h5 className="text-gray-400 text-xs">
          {part.bio
            ? part.bio.length > 20
              ? part.bio.slice(0, 20) + "..."
              : part.bio
            : ""}
        </h5>
      </div>
      {isAdmin && (
        <div className="flex justify-end w-5 h-5 ml-5">
          <img src={crown} />
        </div>
      )}

      {showPopup && (
        <ManageUserInGroup
          avatarUrl={part.avatarURL}
          username={part.username}
          displayname={part.displayName}
          isActive={part.isActive}
          bio={part.bio}
          showProfileButtons={part._id == userId && true}
          showSocialButtons={part._id != userId && true}
          closePopup={() => setShowPopup(false)}
          id={part._id}
          isAdmin={isAdmin}
          groupId={groupId}
          isBlocked={isBlocked}
        />
      )}
    </div>
  );
};

const GroupSideBar = ({
  setShowSidebar,
  participantsInGroup,
  user,
  groupId,
  admins,
  socket,
  groupInfo,
}) => {
  const [groupParticipants, setGroupParts] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showConfirmLeave, setConfirmLeave] = useState(false);

  const fetchGroupParticipants = async () => {
    try {
      const response = await fetch(`http://localhost:3000/group/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: participantsInGroup,
        }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.valid && response.ok) {
        setGroupParts(result.groupParts);
      } else {
        console.error(result.error);

        return;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchGroupParticipants();
  }, [participantsInGroup]);

  return (
    <div className="fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-slate-900 to-gray-700 flex-1 overflow-y-auto z-50 shadow-lg">
      <div className="flex relative mt-4 mb-4">
        <img
          src={closeGroupSide}
          className="justify-start items-start ml-2 hover:cursor-pointer hover:bg-slate-600"
          onClick={() => setShowSidebar(false)}
        />
        <img
          src={groupAdd}
          className="ml-5 hover:cursor-pointer hover:bg-slate-600"
          onClick={() => setShowAddModal(true)}
        />
        <img
          src={modifyIcon}
          className="ml-5 hover:cursor-pointer hover:bg-slate-600 w-5 h-5"
          onClick={() => setShowModifyModal(true)}
        />
        <img
          src={leaveIcon}
          className="ml-5 hover:cursor-pointer hover:bg-slate-600"
          onClick={() => setConfirmLeave(true)}
        />
      </div>
      <div>
        {groupParticipants ? (
          groupParticipants.map((part) => (
            <GroupParticipantBox
              key={part._id}
              part={part}
              userId={user?._id}
              isAdmin={admins.includes(part._id)}
              groupId={groupId}
              isBlocked={user.blockedUsers.includes(part._id)}
            />
          ))
        ) : (
          <MessageLoader />
        )}
      </div>
      {showAddModal && (
        <GroupAddModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          user={user}
          participantsInGroup={participantsInGroup}
          groupId={groupId}
        />
      )}
      {showModifyModal && (
        <GroupModifyModal
          isOpen={showModifyModal}
          onClose={() => setShowModifyModal(false)}
          groupInfo={groupInfo}
          userId={user.userId}
          socket={socket}
        />
      )}
      {showConfirmLeave && (
        <LeaveConfirmationModal
          isOpen={showConfirmLeave}
          onClose={() => setConfirmLeave(false)}
          groupId={groupId}
        />
      )}
    </div>
  );
};

export default GroupSideBar;
