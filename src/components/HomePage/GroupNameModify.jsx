import React, { useState } from "react";

const GroupNameModify = ({ groupInfo, socket, onClose, setError }) => {
  const [name, setName] = useState(groupInfo.groupName);

  const onSubmit = async () => {
    if (name == groupInfo.groupName) {
      onClose();
      setError(null);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/group/change/name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newName: name,
          oldName: groupInfo.groupName,
          groupId: groupInfo.id,
        }),
      });
      const result = await response.json();
      if (result.valid && response.ok) {
        onClose();
        groupInfo.groupName = name;
        socket.emit("groupProfileUpdated", {
          id: groupInfo.id,
          groupName: name,
        });
        return;
      } else {
        setError(result.error);
        return;
      }
    } catch (error) {
      console.log(error);
      setError(error);
      return;
    }
  };

  return (
    <div className="relative mt-4">
      <input
        type="text"
        placeholder="Enter group name "
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={25}
        className="w-full p-2 mb-4 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-end mb-2 mr-6">
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 text-white rounded`}
          onClick={onSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default GroupNameModify;
