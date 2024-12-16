"use client";
import Lottie from "lottie-react";

import animatePurchase from "./animatePurchase.json";

const LottieAnimation = () => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Lottie animationData={animatePurchase} loop={true} />
    </div>
  );
};

export default LottieAnimation;
