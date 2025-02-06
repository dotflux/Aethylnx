import React, { useState } from "react";
import errorIcon from "../../assets/error.svg";
import GroupPfpModify from "./GroupPfpModify";
import GroupNameModify from "./GroupNameModify";

const GroupModifyModal = ({ isOpen, onClose, groupInfo, userId, socket }) => {
  const [errors, setError] = useState(null);

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-slate-950 p-6 rounded-lg w-full sm:w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/3 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Modify Group</h2>

        <GroupPfpModify groupInfo={groupInfo} userId={userId} socket={socket} />
        <GroupNameModify
          groupInfo={groupInfo}
          socket={socket}
          onClose={onClose}
          setError={setError}
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
            onClick={handleCancel}
          >
            Cancel
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

export default GroupModifyModal;
