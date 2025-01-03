import React, { useState, useEffect } from "react";
import defaultPfp from "../../assets/defaultPfp.png";

const MessageBox = ({ messageContent, senderId }) => {
  const [senderInfo, setSenderInfo] = useState(null);

  const fetchSenderInfo = async () => {
    if (!senderId) return;
    const response = await fetch("http://localhost:3000/sender/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ senderId: senderId }),
    });
    const result = await response.json();
    if (result.valid) {
      setSenderInfo(result.senderDetails);
    } else {
      console.log(result.error);
    }
  };

  useEffect(() => {
    fetchSenderInfo();
  }, [senderId]); // Re-run if senderId changes

  return (
    <div className="w-full h-auto p-2 my-2 rounded-lg shadow-md">
      <div className="flex items-top">
        <img
          src={defaultPfp}
          alt="Sender's Profile"
          className="w-8 h-8 rounded-full mr-2"
        />
        <div>
          <p className="text-sm text-slate-100">
            {senderInfo ? senderInfo.username : "Loading.."}
          </p>
          <p className="text-md text-white">{messageContent}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
