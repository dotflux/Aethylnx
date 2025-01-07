import { useState, useEffect, useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./components/Index/Index";
import Signup from "./components/Signup/Signup";
import SignupOtp from "./components/Signup/SignupOtp.jsx";
import Login from "./components/Login/Login.jsx";
import ForgotPass from "./components/ForgotPass/ForgotPass.jsx";
import ForgotPassOtp from "./components/ForgotPass/ForgotPassOtp.jsx";
import Home from "./components/HomePage/Home.jsx";
import Profile from "./components/ProfilePage/Profile.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/signup/otp",
      element: <SignupOtp />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forget-password",
      element: <ForgotPass />,
    },
    {
      path: "/forget-password/otp",
      element: <ForgotPassOtp />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
