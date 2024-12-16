"use client";
import { vietnamLocations } from "@/app/(public)/(ListRoom)/ListRoomCsr";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useStore } from "@/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import FormDialog from "@/app/(public)/FormDialog";
import { toast } from "@/hooks/use-toast";
export default function Rooms({ data2 }: any) {
  let {
    resultSearch,
    setStar,
    setDataLocation,
    getUserData,
    setRemoveFavorite,
    dataApiListRoom,
    setDataApiListRoom,
    setFavorite,
  } = useStore();
  const router = useRouter();

  let handleDetail = (id: number, star: number, tinhThanh: string) => {
    setStar(star);
    setDataLocation(tinhThanh);
    router.push(`/room-detail/id?name=${id}`);
  };
  const formatDateToVietnamese = (date: any) => {
    return format(date, "eeee, dd MMMM yyyy", { locale: vi });
  };
  const formatStar = (star: number) => {
    return star.toFixed(1).replace(".", ",");
  };

  let handleMoney = (money: number): string => {
    let currency = money * 25;
    let formattedCurrency =
      new Intl.NumberFormat("vi-VN", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(currency) + " đ"; // Adding the "đ" symbol at the end
    return formattedCurrency.replace(",", ".");
  };
  const [Open, setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };
  let handleFavorite = (id: number) => {
    if (getUserData.id === 0) {
      setOpen(true);
      toast({
        title: "Bạn cần phải đăng nhập để thực hiện tính năng này",
      });
    } else {
      let findIndex = dataApiListRoom.findIndex((item: any) => item.id == id);
      let find = dataApiListRoom.find((item2: any) => item2.loving == true);
      if (find?.loving == dataApiListRoom[findIndex].loving) {
        dataApiListRoom[findIndex].loving = false;
        setRemoveFavorite(id);
        setDataApiListRoom(dataApiListRoom);
        toast({
          title: "Đã xóa khỏi mục ưa thích",
        });
      } else {
        dataApiListRoom[findIndex].loving = true;
        setDataApiListRoom(dataApiListRoom);

        setFavorite(id);
        toast({
          title: "Đã được thêm vào mục ưa thích",
        });
      }
    }
  };
  const vietnameseDate = formatDateToVietnamese(new Date());
  let renderRooms = () => {
    return resultSearch.map((item: any, index: any) => {
      return (
        <div key={item.id} className="w-[375px] my-6">
          {item.hinhAnh &&
            data2.content.data.map((item2: any) => {
              return (
                <div key={item2.id} className="m-5 group cursor-pointer z-20">
                  {item2.id == item.maViTri && (
                    <CardContainer className="inter-var h-40 w-full   ">
                      <CardBody className="group shadow-lg p-4 border  relative group/card  px-5 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] rounded-xl    ">
                        <div
                          className=""
                          onClick={() => {
                            handleDetail(
                              item.id,
                              vietnamLocations[index]?.star,
                              item2.tinhThanh
                            );
                          }}
                        >
                          <CardItem translateZ="50">
                            <div className="w-[300px] h-[250px]">
                              <Image
                                className="h-full w-full object-left object-cover rounded-xl"
                                src={item.hinhAnh}
                                width={1000}
                                height={1000}
                                alt="ks"
                              />
                            </div>
                          </CardItem>
                          <CardItem translateZ={100} className="w-full">
                            <div className="flex justify-between py-3">
                              <div className="space-y-1">
                                {item2.id == item.maViTri && (
                                  <p className="text-sm font-bold ">
                                    {item2.tinhThanh} / Việt Nam
                                  </p>
                                )}
                                <CardItem>
                                  <p className="text-sm font-light">
                                    {vietnameseDate}
                                  </p>
                                </CardItem>
                                <CardItem translateZ={100}>
                                  <p className="text-sm font-medium">
                                    {handleMoney(item.giaTien)} / Đêm{" "}
                                  </p>
                                </CardItem>
                              </div>
                              <div className="flex items-start">
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm font-medium">
                                    {formatStar(vietnamLocations[index]?.star)}{" "}
                                    {/* Display star with comma */}
                                  </p>
                                  <i className="fa fa-star text-sm transition duration-300 group-hover:text-yellow-300"></i>
                                </div>
                              </div>
                            </div>
                          </CardItem>

                          {vietnamLocations[index]?.star <= 4.5 &&
                            vietnamLocations[index]?.star > 4 && (
                              <CardItem
                                className="absolute top-2 left-2"
                                translateZ={100}
                              >
                                <div className="dark:bg-white bg-white rounded-xl ">
                                  <p className="text-sm font-semibold p-1 px-2 text-black">
                                    {" "}
                                    Được khách yêu thích
                                  </p>
                                </div>
                              </CardItem>
                            )}
                          {vietnamLocations[index]?.star == 5 && (
                            <CardItem
                              className="absolute top-2 left-2"
                              translateZ={100}
                            >
                              <div className="bg-red-400 rounded-xl ">
                                <p className="text-sm font-semibold p-1 px-2">
                                  {" "}
                                  Chủ nhà siêu cấp
                                </p>
                              </div>
                            </CardItem>
                          )}
                        </div>
                        <CardItem
                          className="absolute top-7 right-7 hover:text-2xl"
                          translateZ={100}
                          key={index}
                        >
                          <button
                            key={index}
                            onClick={() => {
                              handleFavorite(item.id);
                            }}
                            className=" active:text-red-400 active:scale-125"
                          >
                            <i
                              className={`fa fa-heart scale-125 ${
                                item.loving ? "text-red-500" : "text-gray-500"
                              }  group-hover:animate-beat duration-300 z-40 bg-clip-text [-webkit-text-stroke:1px_white]  hover:[-webkit-text-stroke:0px] transition-all`}
                            ></i>
                          </button>
                        </CardItem>
                      </CardBody>
                    </CardContainer>
                  )}
                </div>
              );
            })}
        </div>
      );
    });
  };
  return (
    <div>
      <FormDialog Open={Open} handleClose={handleClose} />
      <div className="grid grid-cols-4 ">{renderRooms()}</div>
    </div>
  );
}
