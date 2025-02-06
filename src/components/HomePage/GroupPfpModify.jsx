import React, { useState } from "react";
import LoaderModal from "../ProfilePage/Pfp/LoaderModal";
import editIcon from "../../assets/edit.svg";
import defaultPfp from "../../assets/defaultPfp.png";
import { toast, Bounce } from "react-toastify";

const GroupPfpModify = ({ groupInfo, userId, socket }) => {
  const [profilePic, setProfilePic] = useState(groupInfo.groupAvatar);
  const [loading, setLoading] = useState(false);

  // Handle file change and image upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast.error("File Size Exceeds 10MB", {
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

      // Validate if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          // Create FormData and append the file
          const formData = new FormData();
          formData.append("groupPic", file);
          formData.append("groupId", groupInfo.id);
          formData.append("userId", userId);

          // Send the file to the backend using fetch
          try {
            setLoading(true); // Start loading state

            const response = await fetch(
              "http://localhost:3000/group/change/pfp",
              {
                method: "POST",
                credentials: "include",
                body: formData, // Send the FormData containing the image
              }
            );

            const result = await response.json();

            if (!response.ok || !result.valid) {
              toast.error(`${result.error}` || "An Unknown Error Occured", {
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
            if (response.ok && result.valid) {
              toast.success("Changed Profile Picture Successfully", {
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

              setProfilePic(result.imageUrl);
              groupInfo.groupAvatar = result.imageUrl;
              socket.emit("groupProfileUpdated", {
                id: groupInfo.id,
                groupAvatar: result.imageUrl,
              });
              return;
            }
          } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Network Error Please Try Again", {
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
          } finally {
            setLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please Upload A Valid Image File.", {
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
    }
  };
  return (
    <div>
      <div className="relative">
        <h5 className="text-white text-xs text-center mt-5">
          Group Avatar Is Saved On Upload
        </h5>
        <div className="flex justify-center items-center mt-16 relative group">
          {/* Profile Picture */}
          <img
            src={!profilePic ? defaultPfp : profilePic}
            alt="User's Profile"
            className="w-56 h-56 rounded-full transition-opacity duration-300 ease-in-out group-hover:opacity-75"
          />
          {/* Edit Icon in the center */}
          <img
            src={editIcon}
            alt="Edit Icon"
            className="absolute inset-0 m-auto w-8 h-8 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 ease-in-out"
            onClick={() => document.getElementById("fileInput").click()}
          />
          {/* File input (hidden) */}
          <input
            id="fileInput"
            type="file"
            accept="image/*" // Only allows image files
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Show loading indicator or error */}
        {loading && <LoaderModal />}
      </div>
    </div>
  );
};

export default GroupPfpModify;
