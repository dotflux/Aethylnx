import React from "react";
import ConvoBox from "./ConvoBox";

const SideBar = ({ user }) => {
  return (
    <div className="fixed top-0 left-0 bottom-0 w-full h-full bg-gray-900 text-white transition-transform md:w-72 md:h-auto sm:w-full sm:h-full">
      <h2 className="text-lg mb-2">Recent Conversations</h2>
      {user ? (
        user.conversations.length > 0 ? (
          user.conversations.map((conversation) => {
            return (
              <ConvoBox
                key={conversation.id}
                participant={conversation.participant}
              />
            );
          })
        ) : (
          <h1 className="flex justify-center items-center mt-60 text-white text-xl text-center">
            No conversations innitiated, Start One.
          </h1>
        )
      ) : (
        "Loading"
      )}
    </div>
  );
};

export default SideBar;
