import React, { useEffect } from "react";
import SignUpBG from "../Signup/SignUpBG";
import ForgetPassDetails from "./ForgetPassDetails";
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {
  const navigate = useNavigate();

  const verifyToken = async () => {
    const response = await fetch("http://localhost:3000/verify-res-tk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await response.json();
    if (response.ok && result.valid) {
      navigate(
        `/forget-password/otp?email=${encodeURIComponent(result.email)}`,
        { replace: true }
      );
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);
  return (
    <div>
      <h1 className="text-white text-center text-4xl z-10 my-16 mb-20 relative">
        Reset Password
      </h1>
      <SignUpBG />
      <div>
        <ForgetPassDetails />
      </div>
    </div>
  );
};

export default ForgotPass;
