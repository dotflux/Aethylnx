import React, { useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const ChangeBio = ({ user }) => {
  const [bio, setBio] = useState(user.bio);

  const handleChange = (e) => {
    let input = e.target.value;
    // Trim only leading and trailing spaces
    input = input.trimStart().replace(/\s+/g, " ");
    // Limit input to 350 characters
    if (input.length <= 350) {
      setBio(input);
    }
  };

  const handleSubmit = async () => {
    try {
      const r = await fetch("http://localhost:3000/change/bio", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: bio,
          userId: user.userId,
          id: user._id,
        }),
      });

      const result = await r.json();
      if (r.status === 500 || r.status === 501) {
        toast.error("Internal Server Error (Try Refreshing)", {
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
        return;
      }
      if (!r.ok) {
        result.errors.forEach((error) => {
          toast.error(`${error.error}`, {
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
        });

        return;
      }
      if (r.ok) {
        toast.success("Changed Bio Successfully", {
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
        setBio(result.changedBio);
        socket.emit("profileUpdated", {
          bio: bio,
        });
        user.bio = bio;
      }
    } catch (err) {
      console.log("Network error:", err);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-center items-center">
        <textarea
          value={bio}
          onChange={handleChange}
          maxLength={350} // Limit to 350 characters (about 50 words)
          placeholder="Enter your bio..."
          rows="4"
          cols="50"
          className="bg-slate-700 text-white resize-none rounded-lg shadow-md mt-2"
        />
      </div>
      <div className="flex justify-center items-center">
        <button
          className="px-2 py-1 bg-gradient-to-r from-gray-600 to-slate-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:from-slate-500 hover:to-gray-950 transition duration-300 transform hover:scale-105 ml-60 mt-4"
          type="submit"
          onClick={() => {
            handleSubmit();
          }}
        >
          Change Bio
        </button>
      </div>
    </div>
  );
};

export default ChangeBio;
