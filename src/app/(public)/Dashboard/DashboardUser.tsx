"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CardBody, CardItem, CardContainer } from "@/components/ui/3d-card";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUploadMediaMutation } from "@/queries/useRoom";
import { mediaApiRequest } from "@/apiRequests/media";
import FormUploadImage from "@/app/(public)/Dashboard/FormUploadImage";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useStore } from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SigninForm from "@/app/(public)/auth/SigninForm";
import RentedRooms from "@/app/(public)/Dashboard/RentedRooms";
import FavoriteRooms from "@/app/(public)/Dashboard/FavoriteRooms";
import { useSigninMutation } from "@/queries/useAuth";
import userApiRequest from "@/apiRequests/user";

interface UserProfile {
  avatar: string;
  birthday: string;
  gender: boolean; // Gender, typically `true` for male and `false` for female, or you can use `enum` for more clarity
  email: string;
  id: number; // Unique identifier for the user
  name: string; // User's name
  password: string; // User's password (empty string if not set)
  phone: string;
  role: "USER" | "ADMIN";
}

export default function DashboardUser() {
  let { getUserData, setGetUserData } = useStore();

  const [avatarUser, setAvatarUser] = useState<string | null>(null);
  const [render, setRender] = useState(false);
  const [dataUser, setDataUser] = useState<UserProfile | null>(null);
  const formattedBirthday = dataUser?.birthday
    ? format(dataUser?.birthday, "dd/MM/yyyy")
    : "Date not available";
  useEffect(() => {
    userApiRequest.NextClientToServerGetUser(getUserData.id).then((res) => {
      setDataUser(res.content);
      setAvatarUser(res.content.avatar);
      setGetUserData(res.content);
    });
  }, [render, getUserData]);

  return (
    <div className="h">
      <div className="bg-[url('/assets/Dashboard/travel.jpg')] h-[400px] bg-center bg-cover flex justify-center items-center absolute top-0 w-full left-0 ">
        <p
          className="text-3xl font-semibold text-accent"
          style={{ textShadow: "2px 2px #FF0000" }}
        >
          Dashboard
        </p>
      </div>
      <div className="mb-60"></div>
      <div className="flex relative ">
        <div className="w-1/3      ">
          <div className="sticky top-16">
            <CardContainer className="z-50">
              <CardBody className=" h-full shadow-xl group border-black border-2 relative group/card space-y-4 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] rounded-xl p-6   ">
                <CardItem
                  translateZ={100}
                  translateX={-10}
                  className="w-full mt-4"
                >
                  <p
                    className="text-xl dark:text-white font-semibold text-accent text-center"
                    style={{ textShadow: "2px 2px #FF0000" }}
                  >
                    Thông tin người dùng
                  </p>
                </CardItem>

                <CardItem
                  translateZ={100}
                  translateX={-10}
                  className="w-full mt-4"
                >
                  <div className="flex justify-center border-2 dark:border-white border-black py-3">
                    {avatarUser ? (
                      <Image
                        className="rounded-full w-40 h-40"
                        src={avatarUser}
                        width={200}
                        height={200}
                        alt="avatarUser"
                      />
                    ) : (
                      <Image
                        className="rounded-full w-40 h-40 object-cover"
                        src="/assets/Dashboard/anonymous.jpg"
                        width={200}
                        height={200}
                        alt="avatarUser"
                      />
                    )}
                  </div>{" "}
                </CardItem>

                <div className="flex justify-center ">
                  <Dialog>
                    <CardItem
                      translateZ={200}
                      translateX={40}
                      as={DialogTrigger}
                      className="rounded-xl  underline text-lg font-medium group-hover:text-red-400 group-hover:scale-125 transition   dark:text-white w-full"
                    >
                      <p> Thay đổi ảnh đại diện</p>
                    </CardItem>

                    <DialogContent className="">
                      <DialogHeader>
                        <DialogTitle className=" ">
                          Thay đổi ảnh đại diện
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      <FormUploadImage setRender={setRender} render={render} />
                    </DialogContent>
                  </Dialog>
                </div>
                <CardItem
                  translateZ={100}
                  translateX={30}
                  className="rounded-xl text-xs font-normal dark:text-white w-full"
                >
                  {" "}
                  <div className="space-y-2 border-2 p-4 dark:border-white border-black">
                    <div className="flex justify-between">
                      <p className="text-lg font-semibold">Họ và tên:</p>
                      <CardItem
                        translateZ={200}
                        className="rounded-xl text-xs font-normal dark:text-white "
                      >
                        <p className="text-lg">{dataUser?.name}</p>
                      </CardItem>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-lg font-semibold">Email:</p>
                      <p className="text-lg">{dataUser?.email}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-lg font-semibold">Số điện thoại:</p>
                      <p className="text-lg">{dataUser?.phone}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-lg font-semibold">Sinh nhật:</p>
                      <p className="text-lg">{formattedBirthday}</p>
                    </div>
                  </div>{" "}
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        </div>

        <div className="w-2/3 py-20 px-20">
          <Tabs defaultValue="rented" className="">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rented">Đã thuê</TabsTrigger>
              <TabsTrigger value="favorite">Ưa thích</TabsTrigger>
            </TabsList>
            <TabsContent value="rented">
              <RentedRooms />
            </TabsContent>
            <TabsContent value="favorite">
              <FavoriteRooms />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
