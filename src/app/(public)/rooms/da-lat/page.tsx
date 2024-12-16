import DaLat from "@/app/(public)/rooms/da-lat/DaLat";
import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";

export default function page() {
  return (
    <div className="">
      <div className="bg-[url('/assets/banner/da-lat.jpg')] h-96 bg-center bg-cover flex justify-center items-center">
        <p
          className="text-3xl font-semibold  text-accent text-white"
          style={{ textShadow: "2px 2px #FF0000" }}
        >
          Thành phố Đà Lạt
        </p>
      </div>
      <DaLat />
      <BackgroundBeams className="-z-10" />
    </div>
  );
}
