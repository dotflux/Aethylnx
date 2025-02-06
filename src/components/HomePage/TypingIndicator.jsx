import React from "react";

const TypingIndicator = ({ typerUser }) => {
  return (
    <div>
      {/* Changed bottom-16 to bottom-28 to position below ReplyBar */}
      <h1 className="fixed bottom-11 left-4 right-4 md:left-72 md:right-0 bg-gray-900 bg-opacity-80 text-white text-sm px-4 py-1 rounded-md shadow-lg z-50">
        {`${typerUser || "User"} is typing...`}
      </h1>
    </div>
  );
};

export default TypingIndicator;
