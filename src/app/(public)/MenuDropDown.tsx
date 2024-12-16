"use client";
import userApiRequest from "@/apiRequests/user";
import Authenticate from "@/app/(public)/auth/Authenticate";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import { useSignoutMutation } from "@/queries/useAuth";
import { useStore } from "@/store/store";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Menu, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function MenuDropDown() {
  const [avatarUser, setAvatarUser] = useState<string | null>(null);
  const { fetchDataStore, getUserData, setFetchDataStore, clearStorageUser } =
    useStore();

  const signout = useSignoutMutation();
  let handleSignout = async () => {
    try {
      await signout.mutateAsync();
      setFetchDataStore();
      clearStorageUser();
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setAvatarUser(getUserData.avatar);
  }, [getUserData, fetchDataStore]);
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-3xl w-[100px] py-6 ">
            <div className=" w-full flex justify-between items-center ">
              <div className="">
                <Menu className="w-10" size={50} />
              </div>
              <div className="w-8 h-8">
                <Image
                  src={
                    avatarUser ? avatarUser : "/assets/Dashboard/anonymous.jpg"
                  }
                  alt="avt"
                  width={100}
                  height={100}
                  className="rounded-full w-full object-cover h-full"
                />
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-white  border-2 border-black p-3 rounded-xl px-5">
          {getUserData?.id ? (
            <div className="space-y-3  text-black">
              <div className=" ">
                <Link className="text-sm" href="/Dashboard">
                  <Button variant="ghost" className="w-full flex justify-start">
                    Dashboard{" "}
                  </Button>
                </Link>
              </div>
              <Button
                variant="ghost"
                className="flex justify-start w-full"
                onClick={handleSignout}
              >
                <p>Đăng xuất</p>
              </Button>
            </div>
          ) : (
            <div className="space-y-3 text-black">
              <Authenticate />
              <div>
                <Button className="w-full flex justify-start" variant="ghost">
                  <p className="">Cho thuê chỗ ở qua Airbnb</p>
                </Button>
              </div>
              <div>
                <Button className="w-full flex justify-start" variant="ghost">
                  Tổ chức trải nghiệm
                </Button>
              </div>
              <div>
                <Button className="w-full flex justify-start" variant="ghost">
                  Trung tâm trợ giúp
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
