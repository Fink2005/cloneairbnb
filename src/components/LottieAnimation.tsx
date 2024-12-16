"use client";
import Lottie from "lottie-react";

import animationData from "./animationData.json";

const LottieAnimation = () => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default LottieAnimation;
