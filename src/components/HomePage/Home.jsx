import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeBg from "./HomeBg";
import BelowBar from "./BelowBar";
import SideBar from "./SideBar";
import ChatWindow from "./ChatWindow";
import { io } from "socket.io-client";
import PageLoad from "./PageLoad";

const socket = io("http://localhost:3000");

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const verifyToken = async () => {
    const response = await fetch("http://localhost:3000/verify-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok && !result.valid) {
      navigate("/login");
    } else {
      setUser(result.user);
      socket.emit("user_online", result.user._id);
    }
  };

  useEffect(() => {
    verifyToken();

    // Handle reconnection
    socket.on("connect", () => {
      if (user) {
        socket.emit("user_online", user._id);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      if (user) {
        socket.emit("user_offline", user._id);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      socket.emit("user_online", user._id);

      // Handle disconnect on page unload
      window.addEventListener("beforeunload", () => {
        socket.emit("user_offline", user._id);
      });

      return () => {
        window.removeEventListener("beforeunload", () => {
          socket.emit("user_offline", user._id);
        });
      };
    }
  }, [user]);

  useEffect(() => {
    socket.on("profileUpdated", (updatedUser) => {
      if (updatedUser._id === user._id) {
        setUser((prevUser) => ({ ...prevUser, ...updatedUser })); // Merge old and updated user data
      }
    });

    return () => {
      socket.off("profileUpdated");
    };
  }, [user]);

  return (
    <div>
      {user ? (
        <div>
          <HomeBg />
          <div>
            <ChatWindow user={user} />
          </div>
          <div>
            <SideBar user={user} />
          </div>
          <div>
            <BelowBar user={user} />
          </div>
        </div>
      ) : (
        <div>
          <PageLoad />
        </div>
      )}
    </div>
  );
};

export default Home;
