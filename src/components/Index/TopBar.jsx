import React from "react";
import { Link } from "react-router-dom";
import discordLogo from "../../assets/discord.svg";
import githubLogo from "../../assets/github.svg";
import XLogo from "../../assets/x.svg";
import myLogo from "../../assets/white_logo_DarkRuke.png";

const ButtonAnimatedGradient = ({ condition }) => {
  return (
    <div>
      <Link to={condition ? "/login" : "/home"}>
        <button className="transition-background inline-flex h-12 items-center justify-center rounded-md border border-gray-800 bg-gradient-to-r from-gray-100 via-[#c7d2fe] to-[#8678f9] bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-gray-950 duration-500 hover:bg-[100%_200%] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
          {condition ? "Login" : "Open App"}
        </button>
      </Link>
    </div>
  );
};

const TopBar = ({ condition }) => {
  return (
    <div className="flex justify-between items-center p-4">
      {/* Logo */}
      <Link to="/">
        <img src={myLogo} alt="logo" className="h-24 w-24" />
      </Link>

      {/* Social Icons */}
      <div className="hidden md:flex space-x-16 items-center">
        {" "}
        {/* Hide on small screens */}
        <img src={discordLogo} alt="discord" className="h-12 w-12" />
        <img src={githubLogo} alt="github" className="h-12 w-12" />
        <img src={XLogo} alt="x" className="h-12 w-12" />
      </div>

      {/* Button */}
      <ButtonAnimatedGradient condition={condition} />

      {/* Responsive Social Icons for smaller devices */}
      <div className="flex md:hidden space-x-4 items-center">
        <img src={discordLogo} alt="discord" className="h-8 w-8" />
        <img src={githubLogo} alt="github" className="h-8 w-8" />
        <img src={XLogo} alt="x" className="h-8 w-8" />
      </div>
    </div>
  );
};

export default TopBar;
