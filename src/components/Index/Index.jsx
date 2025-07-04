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
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <BG />
      <div className="relative z-10 animate-fade-in">
        <TopBar condition={condition} />
        <div className="text-center font-passion1B select-none">
          <span className="my-16 inline-flex animate-text-gradient bg-gradient-to-r from-[#f5f5f7] via-[#78777d] to-[#d8def5] bg-[200%_auto] bg-clip-text text-8xl text-transparent drop-shadow-xl">
            Aethylnx
          </span>
        </div>
        <Middle />
      </div>
    </div>
  );
};

export default Index;

// Add this to your global CSS (e.g., App.css or index.css):
// .animate-fade-in { animation: fadeIn 1.2s cubic-bezier(0.4,0,0.2,1) both; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
