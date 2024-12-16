"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { toast } from '@radix-ui/react-toast'
import { handleErrorApi } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  useGetLocation,
  useUpdateLocationMutation,
  useUploadMediaMutation,
  useGetLocationList,
} from "@/queries/useLocation";
import {
  CreateLocationBody,
  CreateLocationBodyType,
} from "@/schemaValidations/location.schema";
import dayjs from "dayjs";
import {
  CreateBookingBody,
  CreateBookingBodyType,
} from "@/schemaValidations/booking.schema";
import {
  useAddBookingMutation,
  useGetBooking,
  useUpdateBookingMutation,
} from "@/queries/useBooking";
import { useGetRoomList } from "@/queries/useRoom";
import { useGetUserList } from "@/queries/useUser";

export default function EditBooking({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
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

  const useUpdateBooking = useUpdateBookingMutation();
  const { data } = useGetBooking({
    id: id as number,
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (data) {
      const { maPhong, ngayDen, ngayDi, soLuongKhach, maNguoiDung } =
        data.content;
      console.log("data.content", data.content);
      form.reset({
        id: id,
        maPhong,
        ngayDen: dayjs(ngayDen).toISOString(),
        ngayDi: dayjs(ngayDi).toISOString(),
        soLuongKhach,
        maNguoiDung,
      });
    }
  }, [data, form]);

  // useEffect(() => {
  //   if (inputRef.current && open) {
  //     inputRef.current.focus()
  //   }
  // }, [open])

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (values: CreateBookingBodyType) => {
    if (useUpdateBooking.isPending) return;
    if (id) {
      try {
        let body = values;
        body = {
          ...values,
          id: id,
        };
        await useUpdateBooking.mutateAsync(body);
        // reset();
        setOpen(false);
        toast({
          title: "Update thành công",
        });
      } catch (error) {
        handleErrorApi({
          error,
          setError: form.setError,
        });
      }
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
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
          reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật vị trí</DialogTitle>
          <DialogDescription>
            Các trường sau đây là bắ buộc: Tên, ảnh
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-dish-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
          >
            <div className="grid gap-4 py-4">
              {/* User Selection */}
              {/* <FormField
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
                          console.log('User:', value);
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
                            onChange={(e) => { setUserFilter(e.target.value) }}
                            ref={inputRef}
                            className="p-2 mb-2"
                          />
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <SelectItem key={user.id} value={String(user.id)}>
                                <p>{user.name}&emsp;/&emsp;{user.email}</p>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-gray-500 p-2">No user found</div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

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
                          const dateValue = e.target.value;
                          const isoDate = dateValue
                            ? new Date(dateValue).toISOString()
                            : "";
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
                          const dateValue = e.target.value;
                          const isoDate = dateValue
                            ? new Date(dateValue).toISOString()
                            : "";
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
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-dish-form">
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
