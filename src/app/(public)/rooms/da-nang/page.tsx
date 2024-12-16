import DaNang from "@/app/(public)/rooms/da-nang/DaNang";
import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="bg-[url('/assets/banner/da-nang.jpg')] h-96 bg-center bg-cover flex justify-center items-center">
        <p
          className="text-3xl font-semibold  text-accent text-white"
          style={{ textShadow: "2px 2px #FF0000" }}
        >
          Thành phố Đà Nẵng
        </p>
      </div>
      <DaNang />
      <BackgroundBeams className="-z-10" />
    </div>
  );
}
