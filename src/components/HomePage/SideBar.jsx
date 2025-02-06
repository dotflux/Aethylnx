import React, { useState, useEffect } from "react";
import ConvoBox from "./ConvoBox";
import ConvLoader from "./ConvLoader";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const SideBar = ({ user, setUser }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Set the search query in lowercase for easier comparison
  };

  useEffect(() => {
    socket.on("conversation_updated", (data) => {
      if (data.id === user?._id) {
        setUser((prevUser) => ({
          ...prevUser,
          conversations: data.conversations,
        }));
      }
    });

    socket.on("group_conversation_updated", (data) => {
      if (data.id === user?._id) {
        setUser((prevUser) => ({
          ...prevUser,
          conversations: data.conversations,
        }));
      }
    });

    return () => {
      socket.off("conversation_updated");
      socket.off("group_conversation_updated");
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 bottom-0 w-full h-full bg-gray-900 text-white transition-transform z-20 md:w-72 md:h-auto sm:w-full sm:h-full">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search conversations..."
        className="ml-3 w-[calc(100%-2rem)] px-4 py-2 rounded-full mb-4 bg-gray-800 text-white mt-3"
        value={searchQuery}
        onChange={handleSearch}
        maxLength={10}
      />

      {user ? (
        user.conversations.length > 0 ? (
          user.conversations.map((conversation) => (
            <ConvoBox
              key={conversation.id}
              participant={conversation.participant}
              searchQuery={searchQuery}
              user={user}
              isGroup={conversation.isGroup}
              id={conversation.id}
              unreadCounterGroups={conversation.unreadCounter}
            />
          ))
        ) : (
          <h1 className="flex justify-center items-center mt-60 text-white text-xl text-center">
            No conversations initiated, Start One.
          </h1>
        )
      ) : (
        <ConvLoader />
      )}
    </div>
  );
};

export default SideBar;
