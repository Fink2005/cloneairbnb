import Destinations from "@/app/(public)/Destinations";

import ListRoom from "@/app/(public)/(ListRoom)/ListRoom";
import { Suspense } from "react";
import LoadingSkeleton from "@/app/(public)/LoadingSkeleton";
import Loading from "@/app/(public)/loading";
import MenuDropDown from "@/app/(public)/MenuDropDown";
import Signin from "@/app/(public)/auth/AuthBox";
export default function Home() {
  return (
    <div className="w-full space-y-4">
      <Suspense fallback={<Loading />}>
        <ListRoom />
      </Suspense>
      {/* <Destinations /> */}
    </div>
  );
}
