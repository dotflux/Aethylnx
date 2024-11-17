import React from "react";
import LogoHover from "./LogoHover";
import chatIcon from "../../assets/chat.svg";
import userIcon from "../../assets/user.svg";
import shieldIcon from "../../assets/shield.svg";
import lockIcon from "../../assets/lock.svg";
import groupIcon from "../../assets/usergroup.svg";
import GetStarted from "./GetStarted";
import AnimatedCard from "./AnimatedCard";

const Middle = () => {
  return (
    <div className="mx-auto text-center py-12 px-4">
      {/* Flex container for h1, p, and GetStarted, and AnimatedCard */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mx-4">
        
        {/* Text section */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-5xl text-white leading-tight mb-4 font-passion1B">
            WHERE CONVERSATIONS CONNECT
          </h1>
          <p className="text-2xl text-gray-300 leading-relaxed mb-6 font-passion1R">
            Aethylnx makes chatting more personal, fun, and connected. Whether
            you're gaming with friends, catching up with family, or building a
            community, we've got you covered. Customize your space, keep it
            secure, and enjoy high-performance connection - because
            communication should be seamless.
          </p>
          <p className="text-2xl text-gray-300 leading-relaxed mb-6 font-passion1R">
            Experience the freedom to connect without barriers. Aethylnx offers
            a streamlined chat environment tailored for your needs, empowering
            you to communicate effortlessly.
          </p>

          {/* GetStarted Button */}
          <div className="w-full flex justify-start -mx-10 font-bold">
            <GetStarted className="w-full" /> {/* Stretch button */}
          </div>
        </div>

        {/* Animated Card section */}
        <div className="md:w-1/2 flex justify-center items-start">
          <div className="bg-gradient-to-br from-gray-400 to-gray-700 bg-opacity-20 rounded-[30px] border-[2px] border-white shadow-2xl">
            <AnimatedCard />
          </div>
        </div>
      </div>

      {/* Feature Icons */}
      <div className="clear-both mt-12 flex justify-center items-center">
        <LogoHover
          logo={chatIcon}
          info="Communicate in real-time with friends, communities, and family. Fast and seamless experience."
          title="Instant Conversations"
        />
        <LogoHover
          logo={userIcon}
          info="Make your profile truly yours with themes, colors, and avatars."
          title="Personalized Profiles"
        />
        <LogoHover
          logo={groupIcon}
          info="Create and manage group chats for events or collaborations."
          title="Group Chats"
        />
        <LogoHover
          logo={shieldIcon}
          info="Keep your messages safe with our platform's security measures."
          title="Secure Connections"
        />
        <LogoHover
          logo={lockIcon}
          info="Enjoy peace of mind with end-to-end encryption for all your chats."
          title="End-To-End Encryption"
        />
      </div>
    </div>
  );
};

export default Middle;
