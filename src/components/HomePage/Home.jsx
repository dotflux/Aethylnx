import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeBg from "./HomeBg";
import BelowBar from "./BelowBar";
import SideBar from "./SideBar";
import ChatWindow from "./ChatWindow";

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
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const getDetails = async () => {
    const response = await fetch("http://localhost:3000/usr/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await response.json();
    if (result.valid) {
      setUser(result.user);
    } else {
      console.log(result.error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
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
  );
};

export default Home;
