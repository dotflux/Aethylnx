import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import errorIcon from "../../assets/error.svg";
import showIcon from "../../assets/show.svg";
import hideIcon from "../../assets/hide.svg";
import { useForm } from "react-hook-form";
import Loader from "../Signup/Loader.jsx";
import SignUpBG from "../Signup/SignUpBG.jsx";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = decodeURIComponent(queryParams.get("email"));
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const verifyToken = async () => {
    if (!email) {
      navigate("/forget-password", { state: { noPara: true } });
    }
    const r = await fetch("http://localhost:3000/verify-res-tk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await r.json();
    if (result.valid && email != result.email) {
      navigate("/forget-password", { state: { noPara: true } });
    }
    if (!r.ok) {
      navigate("/forget-password", { state: { noPara: true } });
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    const visibleChars = localPart.slice(0, 2); // Show first 2 characters
    const maskedChars = "*".repeat(localPart.length - 2); // Replace the rest with asterisks
    return `${visibleChars}${maskedChars}@${domain}`;
  };

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
      const r = await fetch("http://localhost:3000/forget-password/otp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: data.otp,
          email,
          newPass: data.passwordNew,
          rePass: data.passwordRe,
        }),
      });

      const result = await r.json();

      if (r.status === 500) {
        navigate("/forget-password", { state: { noPara: true } });
      }
      if (!r.ok) {
        result.errors.forEach((error) => {
          setError(error.type, { type: "server", message: error.error });
        });
        return;
      }
      if (r.ok) {
        navigate(`/login`, { state: { passChange: true } });
        return;
      }
    } catch (err) {
      console.log("Network error:", err);
    }
  };

  return (
    <div>
      <SignUpBG />

      <div className="relative">
        <h1 className="flex justify-center mt-20 mb-16 text-white text-4xl text-center">
          Enter your New Password & OTP
        </h1>
        <div className="max-w-md mx-auto relative overflow-hidden z-10 bg-gray-800 p-8 rounded-lg shadow-md before:w-24 before:h-24 before:absolute before:bg-blue-700 before:rounded-full before:-z-10 before:blur-2xl after:w-32 after:h-32 after:absolute after:bg-blue-900 after:rounded-full after:-z-10 after:blur-xl after:top-24 after:-right-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Change Password
          </h2>
          <h4 className=" text-white mb-6">
            An email was sent to {maskEmail(email)}
          </h4>

          <form
            method="post"
            action=""
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* New Password */}

            <div className="mb-4 relative">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="passwordNew"
              >
                New Password
              </label>
              <input
                className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
                {...register("passwordNew", {
                  required: { value: true, message: "This field is required" },
                  minLength: {
                    value: 8,
                    message: "The password must be minimum 8 letters",
                  },
                  maxLength: {
                    value: 12,
                    message: "The password exceeds the limit of 12 letters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 letters and Maximum 12 letters"
              />
              <div
                className="absolute inset-y-11 right-2 flex items-center pr-3 cursor-pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <img src={showIcon} alt="" />
                ) : (
                  <img src={hideIcon} alt="" />
                )}
              </div>
              {errors.passwordNew && (
                <div className="flex justify-start items-start">
                  <img src={errorIcon} alt="" />{" "}
                  <h3 className="text-red-600">{errors.passwordNew.message}</h3>
                </div>
              )}
            </div>

            {/* Re-type Password */}

            <div className="mb-4 relative">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="passwordRe"
              >
                Re-type Password
              </label>
              <input
                className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
                {...register("passwordRe", {
                  required: { value: true, message: "This field is required" },
                  minLength: {
                    value: 8,
                    message: "The password must be minimum 8 letters",
                  },
                  maxLength: {
                    value: 12,
                    message: "The password exceeds the limit of 12 letters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 letters and Maximum 12 letters"
              />
              <div
                className="absolute inset-y-11 right-2 flex items-center pr-3 cursor-pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <img src={showIcon} alt="" />
                ) : (
                  <img src={hideIcon} alt="" />
                )}
              </div>
              {errors.passwordRe && (
                <div className="flex justify-start items-start">
                  <img src={errorIcon} alt="" />{" "}
                  <h3 className="text-red-600">{errors.passwordRe.message}</h3>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="otp"
              >
                Otp
              </label>
              <input
                className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
                {...register("otp", {
                  required: { value: true, message: "This field is required" },
                })}
                placeholder="Enter OTP"
                type="text"
              />
              {errors.otp && (
                <div className="flex justify-start items-start">
                  <img src={errorIcon} alt="" />{" "}
                  <h3 className="text-red-600">{errors.otp.message}</h3>
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

export default ForgotPassOtp;
