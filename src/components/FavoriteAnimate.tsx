"use client";
import Lottie from "lottie-react";

import heartAnimate from "./heartAnimate.json";

const FavoriteAnimate = () => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Lottie
        className="bg-transparent"
        animationData={heartAnimate}
        loop={true}
      />
    </div>
  );
};

export default FavoriteAnimate;
