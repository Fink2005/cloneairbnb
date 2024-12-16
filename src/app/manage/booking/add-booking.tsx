"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  CreateBookingBody,
  CreateBookingBodyType,
} from "@/schemaValidations/booking.schema";
import { useAddBookingMutation } from "@/queries/useBooking";
import { useGetRoomList } from "@/queries/useRoom";
import { useGetUserList } from "@/queries/useUser";
import { useGetLocationList } from "@/queries/useLocation";
import dayjs from "dayjs";

export default function AddBooking() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addBookingMutation = useAddBookingMutation();
  const userListQuery = useGetUserList();
  const roomListQuery = useGetRoomList();

  const userList = userListQuery.data?.content || [];
  const roomList = roomListQuery.data?.content || [];

  const form = useForm<CreateBookingBodyType>({
    resolver: zodResolver(CreateBookingBody),
    defaultValues: {
      id: 0,
      maPhong: 0,
      ngayDen: "",
      ngayDi: "",
      soLuongKhach: 1,
      maNguoiDung: 0,
    },
  });

  const resetForm = () => {
    form.reset();
  };

  useEffect(() => {
    if (inputRef.current && open) {
      inputRef.current.focus();
    }
  }, [open]);

  const onSubmit = async (values: CreateBookingBodyType) => {
    if (addBookingMutation.isPending) return;
    try {
      await addBookingMutation.mutateAsync(values);
      toast({ title: "Thêm thành công" });
      resetForm();
      setOpen(false);
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  // User filter state
  const [userFilter, setUserFilter] = useState("");
  const filteredUsers = userList.filter((user: any) =>
    user.name.toLowerCase().includes(userFilter.toLowerCase())
  );

  // Room filter state
  const [roomFilter, setRoomFilter] = useState("");
  const filteredRooms = roomList.filter((room: any) =>
    room.tenPhong.toLowerCase().includes(roomFilter.toLowerCase())
  );

  const locationListQuery = useGetLocationList();
  const locationList = locationListQuery.data?.content ?? [];

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="">Thêm booking</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Thêm booking</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid auto-rows-max items-start gap-4"
          >
            <div className="grid gap-4 py-4">
              {/* User Selection */}
              <FormField
                control={form.control}
                name="maNguoiDung"
                render={({ field }) => (
                  <FormItem>
                    <Label>User</Label>
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          console.log("User:", value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Search and select user" />
                        </SelectTrigger>
                        <SelectContent>
                          <Input
                            type="text"
                            placeholder="Search for user"
                            value={userFilter}
                            onChange={(e) => {
                              setUserFilter(e.target.value);
                            }}
                            ref={inputRef}
                            className="p-2 mb-2"
                          />
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user: any) => (
                              <SelectItem key={user.id} value={String(user.id)}>
                                <p>
                                  {user.name}&emsp;/&emsp;{user.email}
                                </p>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-gray-500 p-2">
                              No user found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Room Selection */}
              <FormField
                control={form.control}
                name="maPhong"
                render={({ field }) => (
                  <FormItem>
                    <Label>Room</Label>
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          console.log("Room:", value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Search and select room" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Room Search Input */}
                          <Input
                            type="text"
                            placeholder="Search for room"
                            value={roomFilter}
                            className="p-2 mb-2"
                            onChange={(e) => setRoomFilter(e.target.value)}
                            ref={inputRef}
                          />
                          {/* Render filtered room options */}
                          {filteredRooms.length > 0 ? (
                            filteredRooms.map((room: any) => {
                              const location = locationList.find(
                                (loc: any) => loc.id === room.maViTri
                              );
                              const locationName = location
                                ? location.tenViTri
                                : "Vị trí không có";
                              return (
                                <SelectItem
                                  className="w-full"
                                  key={room.id}
                                  value={String(room.id)}
                                >
                                  <div className="flex items-center justify-end w-full">
                                    <div>
                                      {locationName}&emsp;/&emsp;{room.tenPhong}
                                    </div>
                                    <div className="ml-2">
                                      <img
                                        style={{ float: "right" }}
                                        src={room.hinhAnh || undefined}
                                        alt={room.tenPhong}
                                        className="w-8 h-8 object-cover rounded-md"
                                      />
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            })
                          ) : (
                            <div className="text-gray-500 p-2">
                              No room found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Other form fields */}
              <FormField
                control={form.control}
                name="ngayDen"
                render={({ field }) => (
                  <FormItem>
                    <Label>Check-in Date</Label>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        placeholder="Check in"
                        value={
                          field.value
                            ? dayjs(field.value).format("YYYY-MM-DD")
                            : ""
                        }
                        onChange={(e) => {
                          const isoDate = new Date(
                            e.target.value
                          ).toISOString();
                          field.onChange(isoDate);
                          console.log("Checkin:", isoDate);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ngayDi"
                render={({ field }) => (
                  <FormItem>
                    <Label>Check-out Date</Label>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        placeholder="Check out"
                        value={
                          field.value
                            ? dayjs(field.value).format("YYYY-MM-DD")
                            : ""
                        }
                        onChange={(e) => {
                          const isoDate = new Date(
                            e.target.value
                          ).toISOString();
                          field.onChange(isoDate);
                          console.log("Checkout:", isoDate);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="soLuongKhach"
                render={({ field }) => (
                  <FormItem>
                    <Label>Number of Guests</Label>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value)); // Cập nhật giá trị trong form
                          // Bạn có thể thực hiện các logic bổ sung nếu cần
                          console.log("number", Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Thêm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
