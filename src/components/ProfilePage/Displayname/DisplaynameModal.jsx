import React, { useState } from "react";
import { useForm } from "react-hook-form";
import errorIcon from "../../../assets/error.svg";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const DisplaynameModal = ({ user, isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleCancel = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      const r = await fetch("http://localhost:3000/change/displayname", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayname: data.displayName,
          id: user.userId,
        }),
      });

      const result = await r.json();
      if (!r.ok) {
        result.errors.forEach((error) => {
          setError(error.type, { type: "server", message: error.error });
        });
        return;
      }
      if (r.ok) {
        reset();
        onClose();
        socket.emit("profileUpdated", {
          id: user._id,
          displayName: data.displayName,
        });
        user.displayName = data.displayName;
      }
      if (r.status === 500) {
        reset();
        onClose();
      }
    } catch (err) {
      console.log("Network error:", err);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-slate-950 p-6 rounded-lg w-full sm:w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/3 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Change Display Name
        </h2>
        <form
          method="post"
          action=""
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-white"
              htmlFor="displayName"
            >
              New Display Name
            </label>
            <input
              className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
              {...register("displayName")}
              placeholder={
                user.displayName ? user.displayName : "Enter new display name"
              }
              type="text"
            />
            {errors.displayName && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />
                <h3 className="text-red-600">{errors.displayName.message}</h3>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                isSubmitting && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isSubmitting}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisplaynameModal;
