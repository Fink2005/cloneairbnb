import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-96 w-[1000px]" />
      <Skeleton className="h-4 w-[500px]" />
      <Skeleton className="h-[325px] w-full  rounded-xl" />
    </div>
  );
}
