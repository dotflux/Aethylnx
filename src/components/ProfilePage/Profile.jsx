import React, { useState, useEffect } from "react";
import HomeBg from "../HomePage/HomeBg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import leftArrow from "../../assets/leftarrow.svg";
import ChangePfp from "./Pfp/ChangePfp";
import ChangeUsername from "./Username/ChangeUsername";
import ChangeDisplayname from "./Displayname/ChangeDisplayname";
import ChangeBio from "./ChangeBio";
import PageLoad from "../HomePage/PageLoad";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Profile = () => {
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
    }
  };
  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <HomeBg />
          <div className="relative ml-4 mt-3">
            <Link to="/home">
              <img src={leftArrow} className="h-10 w-10" />
            </Link>
          </div>
          <div className="relative w-auto h-auto flex justify-center items-center ">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              {/* Text Section */}
              <div className="flex flex-col text-center md:text-left">
                <div className="mb-2 mt-6 md:mt-28">
                  <ChangeUsername user={user} />
                </div>
                <div className="mb-2">
                  <ChangeDisplayname user={user} />
                </div>
                <div>
                  <ChangeBio user={user} />
                </div>
              </div>

              {/* Profile Picture */}
              <div className="mt-6 md:mr-6 md:mt-10 order-first">
                <ChangePfp user={user} />
              </div>
            </div>
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

export default Profile;
