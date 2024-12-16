"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createContext, useContext, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { handleErrorApi } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/auto-pagination";
import EditBooking from "@/app/user/booking/edit-booking";

import { toast } from "@/hooks/use-toast";
import { ListBookingUserBodyType } from "@/schemaValidations/booking.schema";
import {
  useDeleteBookingMutation,
  useGetBookingList,
} from "@/queries/useBooking";
import AddBooking from "./add-booking";
import dayjs from "dayjs";
import { useGetUserList } from "@/queries/useUser";
import { useGetRoomList } from "@/queries/useRoom";
import { RoleType } from "@/types/jwt.types";

type ListBookingUser = ListBookingUserBodyType["content"][0];

const BookingTableContext = createContext<{
  setBookingIdEdit: (value: number) => void;
  BookingIdEdit: number | undefined;
  BookingDelete: ListBookingUser | null;
  setBookingDelete: (value: ListBookingUser | null) => void;
}>({
  setBookingIdEdit: (value: number | undefined) => {},
  BookingIdEdit: undefined,
  BookingDelete: null,
  setBookingDelete: (value: ListBookingUser | null) => {},
});

export const columns: ColumnDef<ListBookingUser>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "hinhAnh",
    header: "Room",
    cell: ({ row }) => {
      const room = row.original.room;
      return (
        <div>
          <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
            <AvatarImage src={room?.hinhAnh} />
            <AvatarFallback className="rounded-none">
              {room?.hinhAnh}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "ngayDen",
    header: "Check in",
    cell: ({ row }) => (
      <div className="capitalize">
        {dayjs(row.getValue<string>("ngayDen"), "DD-MM-YYYY").format(
          "DD-MM-YYYY"
        )}
      </div>
    ),
  },
  {
    accessorKey: "ngayDi",
    header: "Check out",
    cell: ({ row }) => (
      <div className="capitalize">
        {dayjs(row.getValue<string>("ngayDi"), "DD-MM-YYYY").format(
          "DD-MM-YYYY"
        )}
      </div>
    ),
  },
  {
    accessorKey: "soLuongKhach",
    header: "Số lượng khách",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("soLuongKhach")}</div>
    ),
  },
  {
    accessorKey: "user",
    header: "Tên khách",
    cell: ({ row }) => {
      const user = row.original.user;
      return <div className="capitalize">{user?.name || "N/A"}</div>;
    },
    filterFn: (row, columnId, value) => {
      const user = row.original.user;
      if (user) {
        // const nameMatch = user.name?.toLowerCase().includes(value.toLowerCase()) ?? false;
        // const phoneMatch = user.phone?.toLowerCase().includes(value.toLowerCase()) ?? false;
        const nameMatch = String(user?.name || "")
          .toLowerCase()
          .includes(value.toLowerCase());
        const emailMatch = String(user?.email || "")
          .toLowerCase()
          .includes(value.toLowerCase());
        // const phoneMatch = String(user.phone || "").toLowerCase().includes(value.toLowerCase());
        return nameMatch || emailMatch;
      }
      return false; // Return false if no user data exists
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setBookingIdEdit, setBookingDelete } =
        useContext(BookingTableContext);
      const openEditBooking = () => {
        setBookingIdEdit(row.original.id);
      };

      const opendeleteBooking = () => {
        setBookingDelete(row.original);
      };
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditBooking}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={opendeleteBooking}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteBooking({
  BookingDelete,
  setBookingDelete,
}: {
  BookingDelete: ListBookingUser | null;
  setBookingDelete: (value: ListBookingUser | null) => void;
}) {
  // console.log("🚀 ~ BookingDelete id:", BookingDelete);

  const { mutateAsync } = useDeleteBookingMutation();
  const deleteBooking = async () => {
    if (BookingDelete) {
      try {
        const result = await mutateAsync(BookingDelete.id);
        setBookingDelete(null);
        toast({
          title: result.message,
        });
      } catch (error) {
        handleErrorApi({
          error,
        });
      }
    }
  };
  return (
    <AlertDialog
      open={Boolean(BookingDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setBookingDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Booking{" "}
            <span className="bg text-primary-foreground rounded px-1">
              {BookingDelete?.id}
            </span>{" "}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteBooking}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function BookingTable() {
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const [BookingIdEdit, setBookingIdEdit] = useState<number | undefined>();
  const [BookingDelete, setBookingDelete] = useState<ListBookingUser | null>(
    null
  );

  const bookingListQuery = useGetBookingList();
  const bookingList = bookingListQuery.data?.content ?? [];

  const userListQuery = useGetUserList();
  const userList = userListQuery.data?.content ?? [];

  const roomListQuery = useGetRoomList();
  const roomList = roomListQuery.data?.content ?? [];

  const [userid, setUserId] = useState<Number | null>(0);
  console.log("🚀 ~ BookingTable ~ userid:", userid);
  useEffect(() => {
    const local = localStorage.getItem("userProfile");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setUserId(parsed.id);
      } catch (error) {
        console.error("Failed to parse userProfile from localStorage:", error);
      }
    }
  }, []);

  const mergedBookingData = bookingList
    .filter((booking: any) => booking.maNguoiDung === userid) // Only include bookings for the current user
    .map((booking: any) => {
      const user = userList.find((user: any) => user.id === userid);
      const room = roomList.find((room: any) => room.id === booking.maPhong);

      return {
        ...booking,
        user: user || null, // User data if found, or null
        room: room || null, // Room data if found, or null
      };
    });

  // Filter valid bookings to avoid displaying incomplete data
  const validBookingData = mergedBookingData.filter(
    (booking: any) => booking.user !== null && booking.room !== null
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE, //default page size
  });

  const table = useReactTable({
    data: validBookingData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  return (
    <BookingTableContext.Provider
      value={{
        BookingIdEdit,
        setBookingIdEdit,
        BookingDelete,
        setBookingDelete,
      }}
    >
      <div className="w-full">
        <EditBooking id={BookingIdEdit} setId={setBookingIdEdit} />
        <AlertDialogDeleteBooking
          BookingDelete={BookingDelete}
          setBookingDelete={setBookingDelete}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder="Lọc theo tên khách hoặc số điện thoại"
            value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
            onChange={(e) => {
              const filterValue = e.target.value.trim();
              const col = table.getColumn("user");
              col?.setFilterValue(filterValue);
            }}
            className="max-w-sm"
          />

          <div className="ml-auto flex items-center gap-2">
            <AddBooking />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-xs text-muted-foreground py-4 flex-1 ">
            Hiển thị{" "}
            <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
            <strong>{validBookingData.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/booking"
            />
          </div>
        </div>
      </div>
    </BookingTableContext.Provider>
  );
}
