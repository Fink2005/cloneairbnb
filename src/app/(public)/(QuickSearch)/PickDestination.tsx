"use client";
import { destination } from "@/app/(public)/(QuickSearch)/QuickSearch";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStore } from "@/store/store";
import { Clock9 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface dataDestination {
  pickDataDestination: destination;
}

interface destinationProps {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export function PickDestination({ pickDataDestination }: dataDestination) {
  let { dataStoreDestination2 } = useStore();
  const [DataDestination, setDataDestination] = useState<
    destinationProps[] | null
  >(null);
  useEffect(() => {
    let vietNam = {
      id: 0,
      tenViTri: "vn",
      tinhThanh: "Khắp Việt Nam",
      quocGia: "Viet nam",
      hinhAnh: "/assets/Destinations/Vietnam.jpg",
    };
    let clonePickDataDestination: any = [
      vietNam,
      ...pickDataDestination.content.data,
    ];
    setDataDestination(clonePickDataDestination);
    console.log("clone ne", clonePickDataDestination);
  }, []);
  const [history, setHistory] = useState<string[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const { setNextStep, setDataStoreDestination, setDataStoreDestination2 } =
    useStore();
  let handleDestination = (id: number, tinhThanh: string): void => {
    setLocation(tinhThanh);
    setDataStoreDestination(id);
    setDataStoreDestination2(tinhThanh);
  };
  let handleHistory = (name: string) => {
    let cloneHistory = [...history];
    let findIndex = cloneHistory.filter((itemNe: string) => itemNe == name);
    if (findIndex.length == 0) {
      cloneHistory.push(name);
      setLocation(name);
    }
    setHistory(cloneHistory);
    setNextStep(1);
  };
  let renderHistory = () => {
    let cloneHistory = [...history];
    cloneHistory.reverse();
    return cloneHistory.map((itemHistory, index) => {
      return (
        <Button key={index} variant={"ghost"} className="w-full ">
          <div className="flex w-full items-center space-x-2 text-lg ">
            <span className="">
              {" "}
              <Clock9 />
            </span>
            <p className=""> {itemHistory}</p>
          </div>
        </Button>
      );
    });
  };
  let renderDestination = () => {
    return DataDestination?.map((item) => {
      return (
        <div
          key={item.id}
          className="flex justify-center cursor-pointer hover:scale-110 transition duration-300"
          onClick={() => {
            handleHistory(item.tinhThanh);
          }}
        >
          <div className="space-y-1">
            <div
              className="w-28 h-28 rounded-md overflow-hidden border-2 dark:border-white border-black"
              onClick={() => {
                handleDestination(item.id, item.tinhThanh);
              }}
            >
              <Image
                src={item.hinhAnh}
                width={100}
                height={100}
                className="w-full h-full"
                alt="destination"
              />
            </div>
            <p className="text-sm font-semibold text-center">
              {" "}
              {item.tinhThanh}
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            onClick={() => {
              setNextStep(-1);
            }}
            variant="ghost"
            className="w-[280px] h-full text-left flex justify-start "
          >
            <div className="ps-3 ">
              <p className="font-semibold text-xs">Địa điểm</p>
              <p
                className={` ${
                  dataStoreDestination2
                    ? "font-semibold"
                    : "font-light  text-gray-400"
                }`}
              >
                {dataStoreDestination2
                  ? dataStoreDestination2
                  : "Tìm kiếm điểm đến"}
              </p>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`${
            history.length > 0 ? "w-[800px]" : "w-auto"
          }  rounded-3xl flex`}
          align="start"
        >
          {history.length > 0 && (
            <div className="w-1/2">
              <p className="text-md font-medium">Tìm kiếm gần đây</p>
              <div className="mt-3 transition duration-300">
                {renderHistory()}
              </div>
            </div>
          )}
          <div className={`${history.length > 0 ? "w-1/2" : "w-full"}`}>
            <p className="text-md font-medium">Tìm kiếm địa điểm</p>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {renderDestination()}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
