import React from "react";
import styled from "styled-components";

const PageLoader = () => {
  return (
    <StyledWrapper>
      <div className="hacker-loader">
        <div className="loader-text">
          <span data-text="Loading..." className="text-glitch">
            Loading...
          </span>
        </div>
        <div className="loader-bar">
          <div className="bar-fill" />
          <div className="bar-glitch" />
        </div>
        <div className="particles">
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .hacker-loader {
    position: relative;
    z-index: 1000;
    width: 24em;
    height: 6em;
    background-color: #0a0a0a;
    border: 0.2em solid #00ff00;
    border-radius: 0.5em;
    padding: 1em;
    overflow: hidden;
    box-shadow: 0 0 1em rgba(0, 255, 0, 0.3);
  }

  .loader-text {
    text-align: center;
    margin-bottom: 1em;
  }

  .text-glitch {
    color: #00ff00;
    font-family: monospace;
    font-size: 1.5em;
    position: relative;
    display: inline-block;
  }

  .text-glitch::before,
  .text-glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0a0a0a;
    clip: rect(0, 0, 0, 0);
  }

  .text-glitch::before {
    left: -0.1em;
    text-shadow: 0.1em 0 #ff00ff;
    animation: glitch-effect 3s infinite linear alternate-reverse;
  }

  .text-glitch::after {
    left: 0.1em;
    text-shadow: -0.1em 0 #00ffff;
    animation: glitch-effect 2s infinite linear alternate-reverse;
  }

  .loader-bar {
    width: 100%;
    height: 0.5em;
    background-color: #003300;
    border-radius: 0.25em;
    position: relative;
    overflow: hidden;
  }

  .bar-fill {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: #00ff00;
    animation: bar-fill-animation 2s infinite ease-in-out;
  }

  .bar-glitch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(0, 255, 0, 0.2),
      transparent
    );
    background-size: 200% 200%;
    animation: bar-glitch-animation 2s infinite linear;
  }

  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    width: 0.2em;
    height: 0.2em;
    background-color: #00ff00;
    border-radius: 50%;
    opacity: 0;
    animation: particle-animation 2s infinite linear;
  }

  .particle:nth-child(1) {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  .particle:nth-child(2) {
    top: 30%;
    left: 60%;
    animation-delay: 0.5s;
  }

  .particle:nth-child(3) {
    top: 70%;
    left: 30%;
    animation-delay: 1s;
  }

  .particle:nth-child(4) {
    top: 90%;
    left: 90%;
    animation-delay: 1.5s;
  }

  .particle:nth-child(5) {
    top: 50%;
    left: 50%;
    animation-delay: 2s;
  }

  @keyframes glitch-effect {
    0% {
      clip: rect(42px, 9999px, 44px, 0);
    }
    5% {
      clip: rect(12px, 9999px, 59px, 0);
    }
    10% {
      clip: rect(48px, 9999px, 29px, 0);
    }
    15.0% {
      clip: rect(42px, 9999px, 73px, 0);
    }
    20% {
      clip: rect(63px, 9999px, 27px, 0);
    }
    25% {
      clip: rect(34px, 9999px, 55px, 0);
    }
    30.0% {
      clip: rect(86px, 9999px, 73px, 0);
    }
    35% {
      clip: rect(20px, 9999px, 20px, 0);
    }
    40% {
      clip: rect(26px, 9999px, 60px, 0);
    }
    45% {
      clip: rect(25px, 9999px, 66px, 0);
    }
    50% {
      clip: rect(57px, 9999px, 98px, 0);
    }
    55.0% {
      clip: rect(5px, 9999px, 46px, 0);
    }
    60.0% {
      clip: rect(82px, 9999px, 31px, 0);
    }
    65% {
      clip: rect(54px, 9999px, 27px, 0);
    }
    70% {
      clip: rect(28px, 9999px, 99px, 0);
    }
    75% {
      clip: rect(45px, 9999px, 69px, 0);
    }
    80% {
      clip: rect(23px, 9999px, 85px, 0);
    }
    85.0% {
      clip: rect(54px, 9999px, 84px, 0);
    }
    90% {
      clip: rect(45px, 9999px, 47px, 0);
    }
    95% {
      clip: rect(37px, 9999px, 20px, 0);
    }
    100% {
      clip: rect(4px, 9999px, 91px, 0);
    }
  }

  @keyframes bar-fill-animation {
    0%,
    100% {
      width: 0;
    }
    50% {
      width: 100%;
    }
  }

  @keyframes bar-glitch-animation {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes particle-animation {
    0% {
      opacity: 0;
      transform: translate(0, 0);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(2em, 2em);
    }
  }
`;

export default PageLoader;
