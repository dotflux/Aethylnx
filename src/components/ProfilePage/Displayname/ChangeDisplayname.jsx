import React, { useState } from "react";
import editIcon from "../../../assets/edit.svg";
import DisplaynameModal from "./DisplaynameModal";

const ChangeDisplayname = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="relative">
      <div className="flex items-center justify-center mt-2">
        <h3 className="text-md text-slate-200 mr-2">
          Display Name:{" "}
          {user
            ? user.displayName
              ? user.displayName
              : "No Display Name"
            : "Loading..."}
        </h3>
        <img
          src={editIcon}
          alt="Edit Icon"
          className="w-6 h-6 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
      </div>
      <DisplaynameModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default ChangeDisplayname;
