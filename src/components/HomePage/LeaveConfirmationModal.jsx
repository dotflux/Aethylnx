import React from "react";

const LeaveConfirmationModal = ({ isOpen, onClose, groupId }) => {
  const handleCancel = () => {
    onClose();
  };
  const handleLeave = async () => {
    try {
      const response = await fetch("http://localhost:3000/group/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          groupId: groupId,
        }),
      });
      const result = await response.json();
      if (result.valid && response.ok) {
        onClose();
      } else {
        console.log(error);
        onClose();
        return;
      }
    } catch (error) {
      console.log(error);
      onClose();
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-slate-950 p-6 rounded-lg w-full sm:w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/3 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Leave Group</h2>
        <h2 className="text-white">
          Are you sure you want to leave this group? You can't access it again
          until someone adds you (when admins leave group their permissions are
          revoked and passed onto someone else)
        </h2>
        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="mr-4 px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleLeave}
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveConfirmationModal;
