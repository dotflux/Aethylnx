import { useState, useEffect, useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./components/Index/Index";
import Signup from "./components/Signup/Signup";
import SignupOtp from "./components/Signup/SignupOtp.jsx";

function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      element:<Index/>
    },
    {
      path:"/signup",
      element:<Signup/>
    },
    {
      path:"/signup/otp",
      element:<SignupOtp/>
    }
  ])
  return (
    <>
      
    <RouterProvider router={router}/>
    </>
  );
}

export default App;
