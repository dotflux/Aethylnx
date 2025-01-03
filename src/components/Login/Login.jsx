import React from "react";
import LoginDetails from "./LoginDetails";
import SignUpBG from "../Signup/SignUpBG";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

  const verifyToken = async () => {
    const response = await fetch("http://localhost:3000/verify-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await response.json();
    if (response.ok && result.valid) {
      navigate("/home");
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);
  return (
    <div>
      <h1 className="text-white text-center text-4xl z-10 my-10 mb-13 relative">
        Login
      </h1>
      <SignUpBG />
      <div>
        <LoginDetails />
      </div>
    </div>
  );
};

export default Login;
