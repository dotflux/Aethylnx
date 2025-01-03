import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Details from "./Details";
import SignUpBG from "./SignUpBG";

const Signup = () => {
  const navigate = useNavigate();

  const verifyToken = async () => {
    const response = await fetch("http://localhost:3000/verifytk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await response.json();
    if (response.ok && result.valid) {
      navigate(`/signup/otp?email=${encodeURIComponent(result.email)}`);
    }
  };

  const verifyLogged = async () => {
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
    verifyLogged();
  }, []);

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div>
      <h1 className="text-white text-center text-4xl z-10 my-10 mb-13 relative">
        Signup
      </h1>
      <SignUpBG />
      <Details />
    </div>
  );
};

export default Signup;
