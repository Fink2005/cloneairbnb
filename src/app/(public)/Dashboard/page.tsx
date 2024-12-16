import userApiRequest from "@/apiRequests/user";
import DashboardUser from "@/app/(public)/Dashboard/DashboardUser";
import Loading from "@/app/(public)/Dashboard/loading";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Image from "next/image";
import { parse } from "path";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div className="">
      <DashboardUser />
      <BackgroundBeams className="-z-10" />
    </div>
  );
}
