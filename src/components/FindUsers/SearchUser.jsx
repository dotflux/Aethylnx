import React, { useState } from "react";
import searchIcon from "../../assets/search.svg";
import errorIcon from "../../assets/error.svg";
import UserBox from "./UserBox";

const SearchUser = () => {
  const [searchQuery, setQuery] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [searchedInfo, setInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      const response = await fetch(`http://localhost:3000/finduser`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery: searchQuery }),
      });

      const result = await response.json();
      if (result.valid && response.ok) {
        setInfo(result.searchResults);
        setQuery("");
      } else {
        console.log(result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setSubmitting(false);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="w-full max-w-2xl bg-slate-900 rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-white text-2xl font-semibold mb-4">Search Users</h2>
        <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-lg">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search for users..."
            className="bg-transparent w-full text-white placeholder-slate-400 outline-none"
            maxLength={10}
            onChange={(e) => setQuery(e.target.value)}
          />
          <img
            src={searchIcon}
            alt="search"
            className={`hover:cursor-pointer ${isSubmitting && "opacity-50"}`}
            type="submit"
            onClick={handleSearch}
            disabled={isSubmitting}
          />
        </div>
        <div className="mt-4">
          {/* User info boxes will appear here when searched */}
          {searchedInfo ? (
            <UserBox userInfo={searchedInfo} setError={setError} />
          ) : error ? (
            <div className="flex row justify-start items-start">
              <img src={errorIcon} alt="error" />
              <p className="text-red-600 text-sm mt-1 ml-1">{error}</p>
            </div>
          ) : (
            <p className="text-slate-500 italic">
              Enter Full Username To Search
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
