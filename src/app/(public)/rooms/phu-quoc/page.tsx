import PhuQuoc from "@/app/(public)/rooms/phu-quoc/PhuQuoc";
import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="bg-[url('/assets/banner/phu-quoc.jpg')] h-96 bg-center bg-cover flex justify-center items-center">
        <p
          className="text-3xl font-semibold  text-accent text-white"
          style={{ textShadow: "2px 2px #FF0000" }}
        >
          Thành phố Phú Quốc
        </p>
      </div>
      <PhuQuoc />
      <BackgroundBeams className="-z-10" />
    </div>
  );
}
