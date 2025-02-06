import React from "react";

const GroupChatHeader = ({
  currentChannel,
  setPopup,
  groupInfo,
  defaultPfp,
  handleSearch,
  searchRef,
  showSidebar,
  setShowSidebar,
  openGroupSidebar,
}) => {
  return (
    <div>
      {currentChannel && (
        <div
          className={`fixed flex items-center ${
            currentChannel && "md:left-72"
          } left-0 top-0 right-0 bg-gray-900 w-full h-20 px-2 z-50`}
        >
          <div onClick={() => setPopup(!showPopup)}>
            <img
              src={groupInfo?.groupAvatar || defaultPfp}
              alt="Receiver's Profile"
              className="w-14 h-14 rounded-full"
            />
          </div>
          <div className="ml-4 flex flex-col justify-center z-30">
            <h2 className="text-white text-lg font-bold leading-tight">
              {groupInfo ? groupInfo.groupName : "Group"}
            </h2>
            <p className="text-gray-400 text-sm">
              {groupInfo ? `${groupInfo.participants.length} Members` : ""}
            </p>
          </div>
          {/* Search bar */}
          <div className="flex items-center absolute right-0 md:right-96 gap-4">
            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                onChange={handleSearch}
                className="px-4 py-2 rounded-full bg-gray-700 text-white w-48 md:w-64"
                ref={searchRef}
                maxLength={2000}
              />
            </div>

            {/* Add User Icon */}
            <div
              className={`p-2 bg-gray-700 rounded-full hover:bg-gray-600 cursor-pointer ${
                showSidebar && "bg-slate-500"
              }`}
            >
              <img
                src={openGroupSidebar}
                alt="add user"
                className="h-6 w-6 object-contain"
                onClick={() => setShowSidebar(!showSidebar)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChatHeader;
