import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Details from './Details';
import SignUpBG from './SignUpBG';

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

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div>
      <SignUpBG />
      {/* Container for the heading only */}
      <div className="relative flex justify-center mt-20">
        <div
          className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 
                     text-white text-4xl font-bold px-[165px] py-12 
                     shadow-xl rounded-lg border border-blue-500"
        >
          Sign Up
        </div>
      </div>
  
      {/* Free-standing Details component */}
      <Details />
    </div>
  );
};

export default Signup;