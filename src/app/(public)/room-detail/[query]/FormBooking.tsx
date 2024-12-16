"use client";
import { typeContent } from "@/app/(public)/(ListRoom)/ListRoom";
import AuthBox from "@/app/(public)/auth/AuthBox";
import SigninForm from "@/app/(public)/auth/SigninForm";
import SignupForm from "@/app/(public)/auth/SignupForm";
import { CustomerPickerDetails } from "@/app/(public)/room-detail/[query]/CustomerPickerDetails";
import { DatePickerWithRangeDetails } from "@/app/(public)/room-detail/[query]/DatePickerWithRangeDetails";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DialogHeader } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useStore } from "@/store/store";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Award,
  CircleAlert,
  PartyPopper,
  Smile,
  Star,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { CreateBookingDetailBodyType } from "@/schemaValidations/booking.schema";
import { useAddBookingDetailMutation } from "@/queries/useBooking";
import Image from "next/image";
interface DataDetail {
  dataDetail: typeContent;
  query: string | null;
  setDifferenceDays: React.Dispatch<React.SetStateAction<number>>;
  countComments: number | null;
  totalMoney: string | undefined;
  handleSuccess: () => void;
}

export default function FormBooking({
  dataDetail,
  query,
  setDifferenceDays,
  countComments,
  totalMoney,
  handleSuccess,
}: DataDetail) {
  let { star, getUserData } = useStore();
  const handleClose = () => {
    setOpen(false);
  };

  const formatStar = (): string => {
    return star.toFixed(1).replace(".", ",");
  };

  let { total } = useStore();
  const [dateSubmit, setDateSubmit] = useState<DateRange | undefined>();
  const [Open, setOpen] = useState(false);
  const [storageUser, setStorageUser] = useState<any>(null);
  let userBooking = useAddBookingDetailMutation();
  let refClick = useRef<null | HTMLButtonElement>(null);
  const [fetchData, setFetchData] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<string>("signin");

  const handleClick = () => {
    setTabValue("signin");
  };

  useEffect(() => {
    if (getUserData.id) {
      let dataOfUser = getUserData;
      setStorageUser(dataOfUser);
    }
  }, [fetchData, getUserData]);
  let handleOpenModal = async () => {
    if (dateSubmit?.from && dateSubmit?.to) {
      if (!storageUser) {
        setOpen(true);
        toast({
          variant: "destructive",
          description: (
            <div className="flex items-center">
              {" "}
              <CircleAlert className="me-2" /> Bạn cần phải đăng nhập.
            </div>
          ),
        });
      }
    } else {
      toast({
        variant: "destructive",
        description: (
          <div className="flex items-center">
            {" "}
            <CircleAlert className="me-2" /> Bạn cần phải chọn cả ngày nhận và
            trả phòng.
          </div>
        ),
      });
    }
  };
  let handlesubmit = async (): Promise<void> => {
    if (dateSubmit?.from && dateSubmit?.to) {
      let dataSubmit: CreateBookingDetailBodyType = {
        id: dataDetail.id ?? 0,
        maPhong: Number(query) ?? 0,
        ngayDen: dateSubmit?.from,
        ngayDi: dateSubmit?.to,
        soLuongKhach: total,
        maNguoiDung: storageUser.id,
      };
      await userBooking.mutateAsync(dataSubmit);
      toast({
        description: (
          <div className="flex items-center">
            {" "}
            <PartyPopper className="me-2" />
            <p className="text-md text-red-400"> Đặt thành công.</p>
          </div>
        ),
      });
    }
  };

  return (
    <div className="">
      <div className="border rounded-xl   ">
        <DatePickerWithRangeDetails
          setDateSubmit={setDateSubmit}
          setDifferenceDays={setDifferenceDays}
        />
        <CustomerPickerDetails dataDetail={dataDetail} />
      </div>

      <div className="  flex items-center justify-center my-4">
        <Modal>
          <ModalTrigger
            storageUser={storageUser}
            className="bg-red-500 text-white flex justify-center group/modal-btn w-full rounded-lg "
            dateSubmit={dateSubmit}
            refClick={refClick}
          >
            <span className="group-hover/modal-btn:translate-x-72 text-center transition duration-500 p-1">
              Đặt phòng
            </span>
            <div
              className=" -translate-x-60 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20"
              onClick={handleOpenModal}
            >
              ✈️
            </div>
          </ModalTrigger>
          <ModalBody>
            <ModalContent>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                  Chuyến đi của bạn ✈️
                </span>{" "}
              </h4>
              <div className="h-[430px] border-2 rounded-lg">
                <div className="flex justify-center items-center border-b-2 space-x-2 p-4  h-1/2">
                  <div className="w-[120px] h-[120px]">
                    <Image
                      className="h-full w-full object-left object-cover rounded-xl"
                      src={dataDetail?.hinhAnh ?? ""}
                      width={1000}
                      height={1000}
                      alt="ks"
                    />
                  </div>
                  <div className=" w-80 rounded-lg  space-y-1 p-1">
                    <span className="  text-lg font-medium">
                      {dataDetail?.tenPhong}
                    </span>{" "}
                    <div className="flex items-center space-x-1">
                      <Star size={13} color="#FFD602" />
                      <p className="text-md font-medium">{formatStar()}</p>
                      <p className="text-sm">({countComments} bình luận)</p>
                      <div className="flex  items-center">
                        {star > 4 && <Award size={13} color="#e26060" />}

                        <p className="text-sm font-medium">
                          {star == 5
                            ? "Chủ nhà siêu cấp"
                            : star < 4
                            ? ""
                            : "Chủ nhà được ưa thích"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full p-5 h-1/2">
                  <div className="  flex  flex-col justify-center space-y-2 w-2/3">
                    <div className="flex items-center space-x-1">
                      <p className="text-lg font-semibold">Ngày:</p>
                      <p className="text-lg font-normal">
                        {dateSubmit?.from && format(dateSubmit?.from, "dd ")} -{" "}
                        {dateSubmit?.to &&
                          format(dateSubmit?.to, "dd MMM yyy", { locale: vi })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <p className="text-lg font-semibold">Khách: </p>
                      <p className="text-lg font-normal">{total}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <p className="text-lg font-semibold">Tổng giá (VNĐ): </p>
                      <p className="text-lg font-normal">{totalMoney}</p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-1/3">
                    <Image
                      src="/assets/airbnb.png"
                      width={120}
                      height={120}
                      alt="logo"
                    />
                  </div>
                </div>
              </div>
            </ModalContent>
            <ModalFooter
              handleSuccess={handleSuccess}
              handlesubmit={handlesubmit}
              className="gap-4"
            ></ModalFooter>
          </ModalBody>
        </Modal>
      </div>
      <Dialog open={Open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-10" />
          <DialogContent className="w-[500px] p-5 border fixed dark:bg-black bg-white black:bg-black shadow-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl z-50 px-3">
            <DialogHeader>
              <DialogTitle className="text-center font-semibold text-lg py-5">
                Đăng nhập hoặc đăng ký
              </DialogTitle>
            </DialogHeader>
            <hr />
            <div className="h-auto">
              <Tabs
                value={tabValue}
                onValueChange={setTabValue}
                className="w-full h-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Đăng Nhập</TabsTrigger>
                  <TabsTrigger value="signup">Đăng ký</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <SigninForm
                    setFetchData={setFetchData}
                    handleClose={handleClose}
                  />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm handleClick={handleClick} />
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
