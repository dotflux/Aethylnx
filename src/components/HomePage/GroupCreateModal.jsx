import React, { useState, useEffect } from "react";
import defaultPfp from "../../assets/defaultPfp.png";
import errorIcon from "../../assets/error.svg";
import MessageLoader from "./MessageLoader";
import checkedIcon from "../../assets/check.svg";
import { useNavigate } from "react-router-dom";

const ParticipantBox = ({ convParticipant, onSelect, onDeselect }) => {
  const [participantDetails, setParticipantDetails] = useState(null);
  const [checked, setChecked] = useState(false);

  const onInteract = () => {
    if (!checked) {
      setChecked(true);
      onSelect && onSelect(convParticipant);
    } else {
      setChecked(false);
      onDeselect && onDeselect(convParticipant);
    }
  };

  const fetchParticipant = async () => {
    if (!convParticipant) return;
    const response = await fetch("http://localhost:3000/participant/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        participant: convParticipant,
      }),
    });
    const result = await response.json();
    if (result.valid && response.ok) {
      setParticipantDetails(result.userDetails);
    } else {
      console.log(result.error);
    }
  };

  useEffect(() => {
    fetchParticipant();
  }, []);
  return (
    <div>
      {participantDetails ? (
        <div
          className="w-full h-12 flex items-center px-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-600 relative mb-4"
          onClick={onInteract}
        >
          {/* Profile Image */}
          <div className="relative flex items-center">
            <img
              src={participantDetails.avatarURL || defaultPfp}
              alt="Profile"
              className="rounded-full h-8 w-8"
            />
            <div
              className={`absolute bottom-0 right-0 rounded-full border-2 ${
                participantDetails.isActive
                  ? "bg-green-500 border-gray-800 h-3 w-3"
                  : "bg-gray-500 border-gray-800 h-3 w-3"
              }`}
            ></div>
          </div>

          {/* User Details */}
          <div className="ml-2 flex flex-col justify-center">
            <h3 className="text-white text-sm">
              {participantDetails.displayName || participantDetails.username}
            </h3>
            <h5 className="text-gray-400 text-xs">
              {participantDetails.bio
                ? participantDetails.bio.length > 20
                  ? participantDetails.bio.slice(0, 20) + "..."
                  : participantDetails.bio
                : ""}
            </h5>
          </div>
          {checked && (
            <img src={checkedIcon} className="justify-end items-end ml-auto" />
          )}
        </div>
      ) : (
        <MessageLoader />
      )}
    </div>
  );
};

const GroupCreateModal = ({ user, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [errors, setError] = useState(null);
  const [addList, setAddList] = useState([]);
  const [groupName, setName] = useState("");

  const handleCancel = () => {
    onClose();
  };

  const handleSelect = (participantId) => {
    setAddList((prevList) =>
      prevList.includes(participantId) ? prevList : [...prevList, participantId]
    );
  };

  const handleDeselect = (participantId) => {
    setAddList((prevList) => prevList.filter((id) => id !== participantId));
  };

  const onSubmit = async () => {
    if (!groupName || !addList || addList.length <= 1) {
      setError(
        "Group name and more than 2 members are required to form a group"
      );
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          participants: addList,
          groupName: groupName,
        }),
      });
      const result = await response.json();
      if (result.valid && response.ok) {
        onClose();
        navigate(`/home?groupId=${result.groupId}`);
      } else {
        setError(result.error);
        return;
      }
    } catch (error) {
      console.log("error in adding users: ", error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-slate-950 p-6 rounded-lg w-full sm:w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/3 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Create A Group
        </h2>

        <input
          type="text"
          placeholder="Enter group name (required) "
          value={groupName}
          onChange={(e) => setName(e.target.value)}
          maxLength={25}
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div>
          {user?.conversations.map((conv) => {
            if (!conv.isGroup) {
              return (
                <ParticipantBox
                  key={conv.participant}
                  convParticipant={conv.participant}
                  onSelect={handleSelect}
                  onDeselect={handleDeselect}
                />
              );
            }
          })}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-500 text-white rounded`}
            onClick={onSubmit}
          >
            Create
          </button>
        </div>
        {errors && (
          <div className="flex justify-start items-start">
            <img src={errorIcon} />
            <h3 className="text-red-600 ml-1">{errors}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCreateModal;
