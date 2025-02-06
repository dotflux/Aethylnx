import React from "react";

const ReplyBar = ({ repliedContent, setRepliedContent, setReply }) => {
  return (
    <div className="fixed bottom-28 left-0 right-0 bg-gray-700 bg-opacity-80 text-white text-sm px-4 py-1 rounded-md flex items-center space-x-2 z-50 mx-4 md:left-72 justify-between">
      <div>
        <span className="text-xs">Replying to:</span>
        <strong className="ml-2">{repliedContent}</strong>
      </div>
      <button
        className="ml-auto hover:cursor-pointer rounded-full bg-slate-400 w-8 h-8 flex items-center justify-center"
        onClick={() => {
          setReply(null);
          setRepliedContent(null);
        }}
      >
        X
      </button>
    </div>
  );
};

export default ReplyBar;
