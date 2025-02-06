import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeBg from "./HomeBg";
import BelowBar from "./BelowBar";
import SideBar from "./SideBar";
import ChatWindow from "./ChatWindow";
import GroupChatWindow from "./GroupChatWindow";
import { io } from "socket.io-client";
import PageLoad from "./PageLoad";

const socket = io("http://localhost:3000");

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Handle token verification and user authentication
  const verifyToken = async () => {
    const response = await fetch("http://localhost:3000/verify-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok || !result.valid) {
      navigate("/login");
    } else {
      setUser(result.user);
      socket.emit("user_online", result.user._id);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []); // Run only once on mount

  return (
    <div>
      {user ? (
        <div>
          <HomeBg />
          <ChatWindow user={user} />
          <GroupChatWindow user={user} />
          <SideBar user={user} setUser={setUser} />
          <BelowBar user={user} />
        </div>
      ) : (
        <PageLoad />
      )}
    </div>
  );
};

export default Home;
