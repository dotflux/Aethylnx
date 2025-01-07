import React, { useState } from "react";
import editIcon from "../../../assets/edit.svg";
import UsernameModal from "./UsernameModal";

const ChangeUsername = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="relative">
      <div className="flex items-center justify-center mt-2 top-1">
        <h1 className="font-bold text-2xl text-white mr-2">
          Username: {user ? user.username : "Loading..."}
        </h1>
        <img
          src={editIcon}
          alt="Edit Icon"
          className="w-6 h-6 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
      </div>
      <UsernameModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default ChangeUsername;
