import React from "react";

const ChatWindowHeader = ({
  currentChannel,
  showPopup,
  setPopup,
  defaultPfp,
  recieverInfo,
  handleSearch,
  searchRef,
}) => {
  return (
    <div>
      {currentChannel && (
        <div
          className={`fixed flex items-center ${
            currentChannel && "md:left-72"
          } left-0 top-0 right-0 bg-slate-900 w-full h-20 px-2 z-50`}
        >
          <div onClick={() => setPopup(!showPopup)}>
            <img
              src={recieverInfo?.avatarURL || defaultPfp}
              alt="Receiver's Profile"
              className="w-14 h-14 rounded-full"
            />
          </div>
          <div className="ml-4 flex flex-col justify-center">
            <h2 className="text-white text-lg font-bold leading-tight">
              {recieverInfo
                ? recieverInfo.displayName === ""
                  ? recieverInfo.username
                  : recieverInfo.displayName
                : "Receiver"}
            </h2>
            <p className="text-gray-400 text-sm">
              {recieverInfo ? recieverInfo.username : ""}
            </p>
          </div>
          {/* Search bar */}
          <div className="flex-1 absolute right-0 md:right-96">
            <input
              type="text"
              placeholder="Search messages..."
              onChange={handleSearch}
              className="ml-auto px-4 py-2 rounded-full bg-gray-700 text-white"
              ref={searchRef}
              maxLength={2000}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindowHeader;
