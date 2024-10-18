import React from 'react';

const LogoHover = ({ logo, info, title }) => {
  return (
    <div className="relative inline-block group mx-4"> {/* Add horizontal margin */}
      {/* Icon (Logo) */}
      <div className="w-12 h-12 flex items-center justify-center">
        <img src={logo} alt="logo" className="w-full h-full" />
      </div>

      {/* Info Box (Below the Icon) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 bg-white text-black text-sm p-4 rounded-md shadow-lg transition-opacity duration-300 ease-in-out w-52 z-10">
        <div className="text-base font-bold mb-2">{title}</div>
        <p className="leading-relaxed">
          {info}
        </p>
      </div>
    </div>
  );
};

export default LogoHover;