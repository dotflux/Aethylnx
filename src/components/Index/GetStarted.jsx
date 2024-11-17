import React from "react";
import { Link } from 'react-router-dom'

const GetStarted = () => {
    return (
      <div className="flex px-6 pb-8 sm:px-8">
        <Link to="/signup">
        <button
          aria-describedby="tier-starter"
          className="items-center justify-center w-full px-8 py-4 text-center text-xl text-black duration-200 bg-white border-2 border-white rounded-full hover:bg-transparent hover:border-white hover:text-white focus:outline-none focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-white"
          >Get started</button>
          </Link>
          
      </div>
    );
  };

export default GetStarted;