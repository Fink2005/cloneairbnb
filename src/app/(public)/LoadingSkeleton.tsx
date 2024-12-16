"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoadingSkeleton() {
  let router = useRouter;
  console.log("router ne", router);
  let renderSkeleton = () => {
    let array = new Array(20).fill(null);

    return array.map((_, index) => {
      return (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[250px] w-[350px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[350px]" />
            <Skeleton className="h-6 w-[300px]" />
          </div>
        </div>
      );
    });
  };

  return <div className="grid grid-cols-4 gap-5">{renderSkeleton()}</div>;
}
