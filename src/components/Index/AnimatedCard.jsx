import React from "react";
import myLogo from "../../assets/outlined_logo_DarkRuke.png";
import { useMotionValue, useTransform, motion } from "framer-motion";

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
          <h1 className="text-5xl mb-20 font-extrabold text-white drop-shadow-lg">
            Bridging Conversations
          </h1>
          <p className="max-w-[300px] text-white mb-6 font-extrabold">
            Create your unique chat experiences with us!
          </p>
        </motion.div>
      </div>
    );
  };

export default AnimatedCard