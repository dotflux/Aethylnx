import { useState, useEffect, useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./components/Index/Index";

function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      element:<Index/>
    },
  ])
  return (
    <>
      
    <RouterProvider router={router}/>
    </>
  );
}

export default App;
