import React from "react";
import { useEffect, useState } from "react";
import showIcon from "../../assets/show.svg";
import hideIcon from "../../assets/hide.svg";
import errorIcon from "../../assets/error.svg";
import { useForm } from "react-hook-form";
import Loader from "../Signup/Loader.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const LoginDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const emailValue = watch("email");
  const passValue = watch("password");
  const loginPopups = () => {
    if (location.state?.registerFinish) {
      toast.success("Registration Successful", {
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
    if (location.state?.passChange) {
      toast.success("Changed Password Successfully", {
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
    loginPopups();
  }, []);

  useEffect(() => {
    if (emailValue || passValue) {
      clearErrors("generic");
    }
  }, [emailValue, passValue]);

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
      const r = await fetch("http://localhost:3000/login", {
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
        navigate("/home");
      }
    } catch (err) {
      console.log("Network error:", err);
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto relative overflow-hidden z-10 bg-gray-800 p-8 rounded-lg shadow-md before:w-24 before:h-24 before:absolute before:bg-blue-700 before:rounded-full before:-z-10 before:blur-2xl after:w-32 after:h-32 after:absolute after:bg-blue-900 after:rounded-full after:-z-10 after:blur-xl after:top-24 after:-right-12">
        <h2 className="text-2xl font-bold text-white mb-6">Login Now</h2>

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

          <div className="mb-4 relative">
            <label
              className="block text-sm font-medium text-gray-300"
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
            {errors.password && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />{" "}
                <h3 className="text-red-600">{errors.password.message}</h3>
              </div>
            )}
          </div>
          <div>{isSubmitting && <Loader />}</div>
          <div>
            {errors.generic && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />{" "}
                <h3 className="text-red-600">{errors.generic.message}</h3>
              </div>
            )}
          </div>
          <div className="flex justify-start z-10 relative space-x-2 mb-4">
            <Link to="/forget-password" className="text-blue-300">
              Forgot Password?
            </Link>
          </div>

          <div className="flex justify-start z-10 relative space-x-2 mb-4">
            <h3 className="text-white">Don't have an account?</h3>{" "}
            <Link to="/signup" className="text-blue-300">
              Register Now
            </Link>
          </div>
          <div className="flex justify-center">
            <button
              className={`bg-gradient-to-r from-purple-600 via-gray-800 to-blue-700 text-white px-4 py-2 font-bold rounded-md hover:opacity-80 w-full ${
                isSubmitting && "opacity-50 cursor-not-allowed"
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginDetails;
