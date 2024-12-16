import HaNoi from "@/app/(public)/rooms/ha-noi/HaNoi";
import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";

export default function page() {
  return (
    <div className="">
      <div className="bg-[url('/assets/banner/ha-noi.jpg')] h-96 bg-center bg-cover flex justify-center items-center">
        <p
          className="text-3xl font-semibold  text-accent text-white"
          style={{ textShadow: "2px 2px #FF0000" }}
        >
          Thủ Đô Hà Nội
        </p>
      </div>
      <HaNoi />
      <BackgroundBeams className="-z-10" />
    </div>
  );
}
