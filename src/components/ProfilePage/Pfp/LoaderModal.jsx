import React from "react";
import Loader from "../../Signup/Loader";

const LoaderModal = () => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-slate-950 p-6 rounded-lg w-full sm:w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/3 shadow-lg">
        <h1 className="text-white">Uploading Image...</h1>
        <Loader />
      </div>
    </div>
  );
};

export default LoaderModal;
