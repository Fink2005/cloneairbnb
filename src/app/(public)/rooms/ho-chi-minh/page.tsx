import HoChiMinh from "@/app/(public)/rooms/ho-chi-minh/HoChiMinh";
import CustomCursor from "@/components/CustomCursor";
import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";

export default function page() {
  return (
    <div className="relative">
      <div className="bg-[url('/assets/banner/hcm.jpg')] h-96 bg-bottom bg-cover flex justify-center items-center ">
        <p
          className="text-3xl font-semibold  text-accent text-white "
          style={{ textShadow: "2px 2px #FF0000" }}
        >
          Thành phố Hồ Chí Minh
        </p>
      </div>
      <HoChiMinh />
      <BackgroundBeams className="-z-10" />
    </div>
  );
}
