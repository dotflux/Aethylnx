import React from "react";
import { useEffect, useState } from "react";
import showIcon from "../../assets/show.svg";
import hideIcon from "../../assets/hide.svg";
import errorIcon from "../../assets/error.svg";
import { useForm } from "react-hook-form";
import Loader from "./Loader";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
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
    navigate(location.pathname, { replace: true });
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
      const r = await fetch("http://localhost:3000/signup", {
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
        navigate(`/signup/otp?email=${data.email}`, {
          state: { emailSent: true },
        });
      }
    } catch (err) {
      console.log("Network error:", err);
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto relative overflow-hidden z-10 bg-gray-800 p-8 rounded-lg shadow-md before:w-24 before:h-24 before:absolute before:bg-blue-700 before:rounded-full before:-z-10 before:blur-2xl after:w-32 after:h-32 after:absolute after:bg-blue-900 after:rounded-full after:-z-10 after:blur-xl after:top-24 after:-right-12">
        <h2 className="text-2xl font-bold text-white mb-6">Register Now</h2>

        <form
          method="post"
          action=""
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-300"
              htmlFor="username"
            >
              Username
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
              placeholder="Minimum 5 letters and Maximum 10 letters"
              type="text"
            />
            {errors.username && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />{" "}
                <h3 className="text-red-600">{errors.username.message}</h3>
              </div>
            )}
          </div>

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
              placeholder="example@gmail.com"
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
            {errors.password && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />{" "}
                <h3 className="text-red-600">{errors.password.message}</h3>
              </div>
            )}
          </div>
          <div>{isSubmitting && <Loader />}</div>
          <div className="flex justify-start z-10 relative space-x-2 mb-4">
            <h3 className="text-white">Already have an account?</h3>{" "}
            <Link to="/login" className="text-blue-300">
              Login Now
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
              Register
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Details;
