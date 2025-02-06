import React, { useEffect } from "react";
import SearchUser from "./SearchUser";

const FindUsers = () => {
  const verifyToken = async () => {
    const response = await fetch("http://localhost:3000/verify-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok || !result.valid) {
      navigate("/login");
    }
  };

  useEffect(() => {
    verifyToken();
  }, []); // Run only once on mount

  return (
    <div>
      <SearchUser />
    </div>
  );
};

export default FindUsers;
