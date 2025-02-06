import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import closeIcon from "../../assets/close.svg";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultPfp from "../../assets/defaultPfp.png";

const UserInfoPopup = ({
  avatarUrl,
  username,
  displayname,
  isActive,
  bio,
  showSocialButtons,
  showProfileButtons,
  id,
  closePopup,
  isBlocked,
}) => {
  const navigate = useNavigate();
  const [blocked, setBlocked] = useState(isBlocked);
  const blockUser = async () => {
    if (!showSocialButtons) return;
    try {
      const response = await fetch(`http://localhost:3000/blockuser`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });

      const result = await response.json();
      if (result.valid && response.ok) {
        setBlocked(true);
        isBlocked = true;
      } else {
        console.log(result.error);
        toast.error(result.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const unblockUser = async () => {
    if (!showSocialButtons) return;
    try {
      const response = await fetch(`http://localhost:3000/unblockuser`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });

      const result = await response.json();
      if (result.valid && response.ok) {
        setBlocked(false);
        isBlocked = false;
      } else {
        console.log(result.error);
        toast.error(result.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closePopup} // Close when clicking the background
    >
      <div className="card__content relative">
        <div
          className="bg-gray-800 w-64 rounded-lg shadow-lg p-4 text-white relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button (X Symbol) */}
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            onClick={closePopup}
          >
            <img src={closeIcon} alt="close" />
          </button>

          {/* Header Section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <img
                src={avatarUrl !== "" ? avatarUrl : defaultPfp}
                alt={`${username}'s avatar`}
                className="w-16 h-16 rounded-full border border-gray-700"
              />
              <div
                className={`w-4 h-4 rounded-full absolute bottom-0 right-0 border-2 border-black ${
                  isActive ? "bg-green-500" : "bg-gray-500"
                }`}
              ></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{displayname}</h3>
              <p className="text-sm text-gray-400">{username}</p>
            </div>
          </div>

          {/* Bio Section */}
          {bio && (
            <div className="mb-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <h4 className="text-sm font-medium text-gray-300">Bio:</h4>
              <p className="text-sm text-gray-400 break-words whitespace-pre-line">
                {bio}
              </p>
            </div>
          )}

          {/* Interaction Buttons */}
          {showSocialButtons && (
            <div className="flex gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
                onClick={() => navigate(`/home?channel=${id}`)}
              >
                Message
              </button>
              {blocked ? (
                <button
                  className="hover:bg-red-600 border-red-700 border-2 text-white text-sm px-4 py-2 rounded"
                  onClick={unblockUser}
                >
                  Unblock
                </button>
              ) : (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
                  onClick={blockUser}
                >
                  Block
                </button>
              )}
            </div>
          )}
          {showProfileButtons && (
            <div>
              {/* Edit Profile Button */}
              <button
                className="flex items-center gap-1 bg-gray-700 text-white text-sm px-3 py-1 rounded hover:bg-gray-600 transition"
                onClick={() => navigate("/profile")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.012 19.7a4.5 4.5 0 01-1.681 1.072l-3.031 1.01a.75.75 0 01-.95-.95l1.01-3.03a4.5 4.5 0 011.072-1.682L16.862 3.487z"
                  />
                </svg>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoPopup;
