"use client";

import { typeContent } from "@/app/(public)/(ListRoom)/ListRoom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomerType, useStore } from "@/store/store";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface DataDetail {
  dataDetail: typeContent;
}

export function CustomerPickerDetails({ dataDetail }: DataDetail) {
  const {
    customers,
    setCustomers,
    increment,
    decrement,
    total,
    customerDetails,
  } = useStore();

  // useEffect(() => {
  //   setTotal();
  // }, [increment, decrement]);
  const dataCustomers = [
    { id: "adults", label: "Người lớn", age: "Từ 13 tuổi trở lên" },
    { id: "children", label: "Trẻ em", age: "Độ tuổi 2-12" },
    { id: "babies", label: "Em bé", age: "Dưới 2 tuổi" },
    {
      id: "pets",
      label: "Thú cưng",
      age: "Bạn sẽ mang theo động vật để phục vụ?",
    },
  ];

  // Render customer details
  const renderCustomer = () => {
    return dataCustomers.map((item, index) => (
      <div
        key={item.id}
        className={`space-y-2 py-5 border-b ${
          index === 3 ? "" : "flex justify-between"
        }`}
      >
        <div>
          <p className="text-md font-semibold">{item.label}</p>
          <p
            className={`text-sm ${
              index === 3 ? "font-semibold underline" : "font-normal"
            } text-gray-500`}
          >
            {item.age}
          </p>
        </div>

        <div className="flex space-x-2 items-center">
          {/* Decrement Button */}
          <Button
            onClick={() => decrement((item.id as keyof CustomerType) ?? 0)}
            variant={
              customers[item.id as keyof CustomerType] === 0
                ? "secondary"
                : "ghost"
            }
            className={`rounded-full border-2 h-10 w-10 ${
              customers[item.id as keyof CustomerType] === 0 ||
              (item.id == "adults" &&
                customers[item.id as keyof CustomerType] === 1)
                ? "cursor-not-allowed opacity-30"
                : ""
            }`}
          >
            <Minus />
          </Button>

          <p className="w-10 text-center text-md">
            {customers[item.id as keyof CustomerType] ?? 0}
          </p>

          <Button
            onClick={() => increment((item.id as keyof CustomerType) ?? 0)}
            variant={
              customers[item.id as keyof CustomerType] === dataDetail?.khach
                ? "secondary"
                : "ghost"
            }
            className={`rounded-full border-2 h-10 w-10 ${(() => {
              if (
                customers[item.id as keyof CustomerType] === 3 &&
                item.id === "pets"
              ) {
                return "cursor-not-allowed opacity-30"; // Disable if there are 3 pets
              } else if (
                customers[item.id as keyof CustomerType] === 4 &&
                item.id === "babies"
              ) {
                return "cursor-not-allowed opacity-30"; // Disable if there are 3 pets
              } else if (item.id == "adults" || item.id == "children") {
                if (
                  total == customerDetails ||
                  customers[item.id as keyof CustomerType] == customerDetails
                ) {
                  return "cursor-not-allowed opacity-30"; // Disable for other conditions
                }
                return "";
              } else {
                return "";
              }
            })()}`}
          >
            <Plus />
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <div className="relative border rounded-lg border-black">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-full flex justify-between text-left group"
          >
            <div>
              <p className="font-semibold text-xs">Khách</p>
              <p className="text-gray-400 font-light">{total}</p>
            </div>
            <ChevronDown className="group-focus:rotate-180 transition duration-500" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[450px] rounded-3xl" align="center">
          <div className="space-y-5 p-5">{renderCustomer()}</div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
