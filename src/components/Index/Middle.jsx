import React from "react";
import myLogo from "../../assets/outlined_logo_DarkRuke.png";
import { useMotionValue, useTransform, motion } from "framer-motion";
import LogoHover from "./LogoHover";
import chatIcon from "../../assets/chat.svg";
import userIcon from "../../assets/user.svg";
import shieldIcon from "../../assets/shield.svg";
import lockIcon from "../../assets/lock.svg";
import groupIcon from "../../assets/usergroup.svg";
import GetStarted from "./GetStarted";


const AnimatedCard = () => {
  // Initial position values
  const x = useMotionValue(-59);
  const y = useMotionValue(10);

  // Transformations based on motion values
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const handleDragEnd = () => {
    x.set(-59,true)
    y.set(10,true)
    
};

  return (
    <div style={{ perspective: 2000 }} className="">
      {/* card */}
      <motion.div
        style={{ x, y, rotateX, rotateY, z: 100 }}
        drag
        dragElastic={0.18}
        dragConstraints={{ top: 10 - 50, left: -59 - 50, right: -59 + 50, bottom: 10 + 50 }}
        whileTap={{ cursor: "grabbing" }}
        onDragEnd={handleDragEnd} // Call function to reset position
        className="w-[426px] min-h-[400px] bg-white rounded-[30px] border-[4px] border-white px-[40px] py-[24px] cursor-grab relative shadow-lg backdrop-blur-md bg-opacity-20"
      >
        <div className="mb-12">
          <img
            src={myLogo}
            alt=""
            className="h-24 w-24 absolute top-0 left-0"
          />
        </div>
        <h1 className="text-5xl mb-6 font-extrabold text-white drop-shadow-lg">
          Bridging Conversations
        </h1>
        <p className="max-w-[300px] text-white mb-6">
          Create your unique chat experiences with us!
        </p>
      </motion.div>
    </div>
  );
};



const Middle = () => {
  return (
    <div className="mx-auto text-center py-12 px-4">
      {/* Flex container for h1, p, and GetStarted, and AnimatedCard */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mx-4">
        
        {/* Text section */}
        <div className="md:w-1/2 text-left font-gilroyH">
          <h1 className="text-5xl text-white font-bold leading-tight mb-4">
            Where Conversations Connect
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Aethylnx makes chatting more personal, fun, and connected. Whether
            you're gaming with friends, catching up with family, or building a
            community, we've got you covered. Customize your space, keep it
            secure, and enjoy high-performance connection â because
            communication should be seamless.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Experience the freedom to connect without barriers. Aethylnx offers
            a streamlined chat environment tailored for your needs, empowering
            you to communicate effortlessly.
          </p>

          {/* GetStarted Button */}
          <div className="w-full flex justify-start -mx-10">
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
