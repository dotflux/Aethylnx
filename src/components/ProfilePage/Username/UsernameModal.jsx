import React, { useState } from "react";
import { useForm } from "react-hook-form";
import showIcon from "../../../assets/show.svg";
import hideIcon from "../../../assets/hide.svg";
import errorIcon from "../../../assets/error.svg";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const UsernameModal = ({ user, isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
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
      const r = await fetch("http://localhost:3000/change/username", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
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
          username: data.username,
        });
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
          Change Username
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
              htmlFor="username"
            >
              New Username
            </label>
            <input
              className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
              {...register("username", {
                required: { value: true, message: "This field is required" },
                minLength: {
                  value: 5,
                  message: "The username must be minimum 5 letters",
                },
                maxLength: {
                  value: 10,
                  message: "The username exceeds the limit of 10 letters",
                },
              })}
              placeholder="Enter new username"
              type="text"
            />
            {errors.username && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />
                <h3 className="text-red-600">{errors.username.message}</h3>
              </div>
            )}
          </div>

          <div className="mb-4 relative">
            <label
              className="block text-sm font-medium text-white"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
              {...register("password", {
                required: { value: true, message: "This field is required" },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <div
              className="absolute inset-y-11 right-2 flex items-center pr-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <img src={showIcon} alt="Show" />
              ) : (
                <img src={hideIcon} alt="Hide" />
              )}
            </div>
            {errors.password && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />
                <h3 className="text-red-600">{errors.password.message}</h3>
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

export default UsernameModal;
