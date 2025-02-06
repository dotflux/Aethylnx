import React from "react";
import { useEffect, useState } from "react";
import errorIcon from "../../assets/error.svg";
import { useForm } from "react-hook-form";
import Loader from "../Signup/Loader.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const detailsPopups = () => {
    if (location.state?.noPara) {
      toast.error("Unauthorized Access", {
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
    navigate(location.pathname, {
      replace: true,
    });
  };

  useEffect(() => {
    detailsPopups();
  }, []);

  const delay = (d) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, d * 1000);
    });
  };

  const onSubmit = async (data) => {
    try {
      await delay(5);
      const r = await fetch("http://localhost:3000/forget-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await r.json();
      if (!r.ok) {
        result.errors.forEach((error) => {
          setError(error.type, { type: "server", message: error.error });
        });
        return;
      }
      if (r.ok) {
        navigate(
          `/forget-password/otp?email=${encodeURIComponent(data.email)}`,
          { replace: true }
        );
      }
    } catch (err) {
      console.log("Network error:", err);
    }
  };

  return (
    <div>
      <div className="relative">
        <div className="max-w-md mx-auto relative overflow-hidden z-10 bg-gray-800 p-8 rounded-lg shadow-md before:w-24 before:h-24 before:absolute before:bg-blue-700 before:rounded-full before:-z-10 before:blur-2xl after:w-32 after:h-32 after:absolute after:bg-blue-900 after:rounded-full after:-z-10 after:blur-xl after:top-24 after:-right-12">
          <h2 className="text-2xl font-bold text-white mb-6">Reset Password</h2>

          <form
            method="post"
            action=""
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
                {...register("email", {
                  required: { value: true, message: "This field is required" },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Enter your email"
                type="email"
              />
              {errors.email && (
                <div className="flex justify-start items-start">
                  <img src={errorIcon} alt="" />{" "}
                  <h3 className="text-red-600">{errors.email.message}</h3>
                </div>
              )}
            </div>

            <div>{isSubmitting && <Loader />}</div>

            <div className="flex justify-center">
              <button
                className={`bg-gradient-to-r from-purple-600 via-gray-800 to-blue-700 text-white px-4 py-2 font-bold rounded-md hover:opacity-80 w-full mt-4 ${
                  isSubmitting && "opacity-50 cursor-not-allowed"
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassDetails;
