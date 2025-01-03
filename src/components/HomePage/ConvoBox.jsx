import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import defaultPfp from "../../assets/defaultPfp.png";

const ConvoBox = ({ participant }) => {
  const [participantDetail, setParticipant] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // To get the current URL

  // Extract the channel query parameter
  const queryParams = new URLSearchParams(location.search);
  const currentChannel = queryParams.get("channel");

  const participantDetails = async () => {
    const response = await fetch("http://localhost:3000/participant/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ participant }),
    });
    const result = await response.json();
    if (result.valid) {
      setParticipant(result.userDetails);
    } else {
      console.log(result.error);
    }
  };

  useEffect(() => {
    participantDetails();
  }, [participant]);

  const handleClick = () => {
    navigate(`/home?channel=${participant}`);
  };

  return (
    <div>
      <div
        className={`w-full h-12 flex items-center px-2 transition-all duration-300 ${
          currentChannel === participant
            ? "bg-gradient-to-r from-gray-800 to-slate-700 opacity-75"
            : "bg-slate-950 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-600"
        }`}
        onClick={handleClick}
      >
        {/* Profile Image and Status Circle */}
        <div className="relative flex items-center">
          <img src={defaultPfp} className="rounded-full h-10 w-10" />
          <div
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 ${
              participantDetail
                ? participantDetail.isActive
                  ? "bg-green-500 border-white"
                  : "bg-gray-500 border-gray-300"
                : "bg-gray-500 border-gray-300"
            }`}
          ></div>
        </div>

        {/* Username and Status */}
        <div className="ml-2 flex flex-col justify-center">
          <h3 className="text-white text-sm">
            {participantDetail ? participantDetail.username : "Loading..."}
          </h3>
          <h5 className="text-gray-400 text-xs">
            {participantDetail
              ? participantDetail.isActive
                ? "Online"
                : "Offline"
              : "Loading..."}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default ConvoBox;
