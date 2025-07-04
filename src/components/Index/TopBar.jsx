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
        <button className="transition-background inline-flex h-12 items-center justify-center rounded-md border border-[#8678f9]/60 bg-gradient-to-r from-[#2d2250]/80 via-[#8678f9]/80 to-[#3a3a6d]/80 bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-white shadow-xl backdrop-blur-md backdrop-saturate-150 duration-500 hover:bg-[100%_200%] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#8678f9] focus:ring-offset-2 focus:ring-offset-gray-900">
          {condition ? "Login" : "Open App"}
        </button>
      </Link>
    </div>
  );
};

const TopBar = ({ condition }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-black/30 backdrop-blur-md shadow-lg rounded-b-2xl border-b border-[#8678f9]/20">
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
