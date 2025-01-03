import React from "react";
import BG from "./BG";
import TopBar from "./TopBar";
import Middle from "./Middle";
import { useEffect, useState } from "react";

const Index = () => {
  const [condition, setCondition] = useState(false);

  const verifyToken = async () => {
    const response = await fetch("http://localhost:3000/verify-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok && !result.valid) {
      setCondition(true);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div>
      <BG />
      <TopBar condition={condition} />

      <div className="text-center font-passion1B">
        <span className="my-16 inline-flex animate-text-gradient bg-gradient-to-r from-[#f5f5f7] via-[#78777d] to-[#d8def5] bg-[200%_auto] bg-clip-text text-8xl text-transparent">
          Aethylnx
        </span>
      </div>

      <Middle />
    </div>
  );
};

export default Index;
