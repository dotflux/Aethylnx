import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PageLoader from "./PageLoader";

const PageLoad = () => {
  const astronautRef = useRef(null); // Reference to astronaut div
  const [position, setPosition] = useState({ x: 200, y: 200, dx: 2, dy: 2 }); // Initial position and speed

  // Function to move astronaut and bounce on screen edges
  const moveAstronaut = () => {
    setPosition((prev) => {
      let newX = prev.x + prev.dx;
      let newY = prev.y + prev.dy;

      // Bounce off the left/right borders
      if (newX <= 0 || newX >= window.innerWidth - 250) {
        prev.dx = -prev.dx;
      }

      // Bounce off the top/bottom borders
      if (newY <= 0 || newY >= window.innerHeight - 300) {
        prev.dy = -prev.dy;
      }

      return { x: newX, y: newY, dx: prev.dx, dy: prev.dy };
    });
  };

  useEffect(() => {
    // Use requestAnimationFrame for smooth animation
    const interval = setInterval(() => {
      moveAstronaut();
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledWrapper>
      <div>
        <div className="box-of-star1">
          <div className="star star-position1" />
          <div className="star star-position2" />
          <div className="star star-position3" />
          <div className="star star-position4" />
          <div className="star star-position5" />
          <div className="star star-position6" />
          <div className="star star-position7" />
        </div>
        <div className="box-of-star2">
          <div className="star star-position1" />
          <div className="star star-position2" />
          <div className="star star-position3" />
          <div className="star star-position4" />
          <div className="star star-position5" />
          <div className="star star-position6" />
          <div className="star star-position7" />
        </div>
        <div className="box-of-star3">
          <div className="star star-position1" />
          <div className="star star-position2" />
          <div className="star star-position3" />
          <div className="star star-position4" />
          <div className="star star-position5" />
          <div className="star star-position6" />
          <div className="star star-position7" />
        </div>
        <div className="box-of-star4">
          <div className="star star-position1" />
          <div className="star star-position2" />
          <div className="star star-position3" />
          <div className="star star-position4" />
          <div className="star star-position5" />
          <div className="star star-position6" />
          <div className="star star-position7" />
        </div>
        <div className="flex justify-center items-center mt-96 lg:mt-56 xl:mt-56">
          <PageLoader />
        </div>
        <div
          ref={astronautRef}
          className="astronaut"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
          }}
        >
          <div className="head" />
          <div className="arm arm-left" />
          <div className="arm arm-right" />
          <div className="body">
            <div className="panel" />
          </div>
          <div className="leg leg-left" />
          <div className="leg leg-right" />
          <div className="schoolbag" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  background-color: black;
  overflow: hidden;
  position: relative;
  height: 100vh; /* Full screen height */
  width: 100vw; /* Full screen width */

  @keyframes snow {
    0% {
      opacity: 0;
      transform: translateY(0px);
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 1;
      transform: translateY(650px);
    }
  }

  @keyframes astronaut {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .box-of-star1,
  .box-of-star2,
  .box-of-star3,
  .box-of-star4 {
    width: 100%;
    position: absolute;
    z-index: 10;
    left: 0;
    top: 0;
    transform: translateY(0px);
    height: 700px;
  }

  .box-of-star1 {
    animation: snow 5s linear infinite;
  }

  .box-of-star2 {
    animation: snow 5s -1.64s linear infinite;
  }

  .box-of-star3 {
    animation: snow 5s -2.3s linear infinite;
  }

  .box-of-star4 {
    animation: snow 5s -3.3s linear infinite;
  }

  .star {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: #00ff00; /* Change color to green */
    position: absolute;
    z-index: 10;
    opacity: 0.7;
  }

  .star:before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: green; /* Change star color to green */
    position: fixed;
    z-index: 1000;
    top: 80px;
    left: 70px;
    opacity: 0.7;
  }

  .star:after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: green; /* Change star color to green */
    position: absolute;
    z-index: 10;
    top: 8px;
    left: 170px;
    opacity: 0.9;
  }

  .star-position1 {
    top: 30px;
    left: 20px;
  }

  .star-position2 {
    top: 110px;
    left: 250px;
  }

  .star-position3 {
    top: 60px;
    left: 570px;
  }

  .star-position4 {
    top: 120px;
    left: 900px;
  }

  .star-position5 {
    top: 20px;
    left: 1120px;
  }

  .star-position6 {
    top: 90px;
    left: 1280px;
  }

  .star-position7 {
    top: 30px;
    left: 1480px;
  }

  .astronaut {
    width: 180px;
    height: 220px;
    position: absolute;
    z-index: 9;
    top: calc(50% - 110px);
    left: calc(50% - 90px);
    animation: astronaut 5s linear infinite;
  }

  .schoolbag {
    width: 70px;
    height: 100px;
    position: absolute;
    z-index: 1;
    top: calc(50% - 50px);
    left: calc(50% - 35px);
    background-color: #94b7ca;
    border-radius: 35px 35px 0 0 / 20px 20px 0 0;
  }

  .head {
    width: 120px;
    height: 110px;
    position: absolute;
    z-index: 3;
    background: -webkit-linear-gradient(
      left,
      #e3e8eb 0%,
      #e3e8eb 50%,
      #fbfdfa 50%,
      #fbfdfa 100%
    );
    border-radius: 50%;
    top: 10px;
    left: calc(50% - 60px);
  }

  .head:after {
    content: "";
    width: 70px;
    height: 60px;
    position: absolute;
    top: calc(50% - 30px);
    left: calc(50% - 35px);
    background: -webkit-linear-gradient(
      top,
      #15aece 0%,
      #15aece 50%,
      #0391bf 50%,
      #0391bf 100%
    );
    border-radius: 15px;
  }

  .head:before {
    content: "";
    width: 8px;
    height: 18px;
    position: absolute;
    top: calc(50% - 9px);
    left: -3px;
    background-color: #618095;
    border-radius: 4px;
    box-shadow: 100px 0px 0px #618095;
  }

  .body {
    width: 60px;
    height: 70px;
    position: absolute;
    z-index: 2;
    background-color: #fffbff;
    border-radius: 30px / 18px;
    top: 90px;
    left: calc(50% - 30px);
    background: -webkit-linear-gradient(
      left,
      #e3e8eb 0%,
      #e3e8eb 50%,
      #fbfdfa 50%,
      #fbfdfa 100%
    );
  }

  .panel {
    width: 45px;
    height: 25px;
    position: absolute;
    top: 15px;
    left: calc(50% - 22.5px);
    background-color: #b7cceb;
  }

  .panel:before {
    content: "";
    width: 22px;
    height: 3px;
    position: absolute;
    top: 7px;
    left: 5px;
    background-color: #fbfdfa;
    box-shadow: 0px 6px 0px #fbfdfa, 0px 12px 0px #fbfdfa;
  }

  .panel:after {
    content: "";
    width: 6px;
    height: 6px;
    position: absolute;
    top: 7px;
    right: 5px;
    background-color: #fbfdfa;
    border-radius: 50%;
    box-shadow: 0px 10px 0px 2px #fbfdfa;
  }

  .arm {
    width: 50px;
    height: 20px;
    position: absolute;
    top: 100px;
    z-index: 2;
  }

  .arm-left {
    left: 15px;
    background-color: #e3e8eb;
    border-radius: 0 0 0 30px;
  }

  .arm-right {
    right: 15px;
    background-color: #fbfdfa;
    border-radius: 0 0 30px 0;
  }

  .arm-left:before,
  .arm-right:before {
    content: "";
    width: 20px;
    height: 50px;
    position: absolute;
    top: -30px;
  }

  .arm-left:before {
    border-radius: 40px 40px 0px 100px / 40px 40px 0 90px;
    left: 0;
    background-color: #e3e8eb;
  }

  .arm-right:before {
    border-radius: 40px 40px 100px 0 / 40px 40px 90px 0;
    right: 0;
    background-color: #fbfdfa;
  }

  .arm-left:after,
  .arm-right:after {
    content: "";
    width: 20px;
    height: 7px;
    position: absolute;
    top: -18px;
  }

  .arm-left:after {
    background-color: #6e91a4;
    left: 0;
  }

  .arm-right:after {
    right: 0;
    background-color: #b6d2e0;
  }

  .leg {
    width: 20px;
    height: 30px;
    position: absolute;
    z-index: 2;
    bottom: 50px;
  }

  .leg-left {
    left: 60px;
    background-color: #e3e8eb;
    transform: rotate(12deg);
  }

  .leg-right {
    right: 57px;
    background-color: #fbfdfa;
    transform: rotate(-12deg);
  }

  .leg-left:before,
  .leg-right:before {
    content: "";
    width: 40px;
    height: 18px;
    position: absolute;
    bottom: -20px;
  }

  .leg-left:before {
    left: -15px;
    background-color: #e3e8eb;
    border-radius: 22px 0 0 0;
    border-bottom: 7px solid #6d96ac;
  }

  .leg-right:before {
    right: -15px;
    background-color: #fbfdfa;
    border-radius: 0 22px 0 0;
    border-bottom: 7px solid #b0cfe4;
  }
`;

export default PageLoad;
