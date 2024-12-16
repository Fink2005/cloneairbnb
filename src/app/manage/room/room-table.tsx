"use client";

import { DotsHorizontalIcon, CaretSortIcon } from "@radix-ui/react-icons";
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
// import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
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
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { formatCurrency, handleErrorApi } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/auto-pagination";
import EditRoom from "@/app/manage/room/edit-room";
import AddRoom from "@/app/manage/room/add-room";
import {
  CreateRoomBody,
  CreateRoomBodyResType,
  RoomListResType,
  CreateRoomBodyType,
} from "@/schemaValidations/room.schema";
import {
  useAddRoomMutation,
  useDeleteRoomMutation,
  useGetRoomList,
  useUploadMediaMutation,
} from "@/queries/useRoom";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { useDeleteBookingMutation } from "@/queries/useBooking";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  WashingMachine,
  Shirt,
  Tv,
  AirVent,
  Wifi,
  CookingPot,
  Car,
  Waves,
  Wind,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X } from "lucide-react";
import { useGetLocationList } from "@/queries/useLocation";
import { LocationListResType } from "@/schemaValidations/location.schema";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type RoomItem = RoomListResType["content"][0];
type LocationItem = LocationListResType["content"][0];

const RoomTableContext = createContext<{
  setRoomIdEdit: (value: number) => void;
  roomIdEdit: number | undefined;
  roomDelete: RoomItem | null;

  setRoomDelete: (value: RoomItem | null) => void;
  rowSelectionIdArray: number[];
  setRowSelectionIdArray: (value: number[]) => void;
  setIsDialogOpen: (value: boolean) => void;
  tagList: { value: string; label: string; icon: React.ReactNode }[];
  setTagList: (
    value: { value: string; label: string; icon: React.ReactNode }[]
  ) => void;
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  locationList: LocationItem[];
  setLocationList: React.Dispatch<React.SetStateAction<LocationItem[]>>;
}>({
  setRoomIdEdit: (value: number | undefined) => {},
  roomIdEdit: undefined,
  roomDelete: null,
  setRoomDelete: (value: RoomItem | null) => {},
  rowSelectionIdArray: [],
  setRowSelectionIdArray: (value: number[]) => {},
  setIsDialogOpen: () => {},
  tagList: [],
  setTagList: () => {},
  selectedValues: [],
  setSelectedValues: () => {},
  locationList: [],
  setLocationList: () => {},
});

interface RowData {
  original: {
    id: number;
  };
}

const HeaderCheckbox = ({ table }: { table: any }) => {
  // const [rowSelectionIdArray, setRowSelectionIdArray] = useState<number[]>([]);
  const { rowSelectionIdArray, setRowSelectionIdArray } =
    useContext(RoomTableContext);

  const handleSelectAllChange = (value: boolean) => {
    const newSelection = value
      ? table.getRowModel().rows.map((row: RowData) => row.original.id)
      : [];

    table.toggleAllRowsSelected(!!value);
    setRowSelectionIdArray(newSelection);
  };
  // console.log("rowSelectionIdArray:", rowSelectionIdArray);

  return (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      onCheckedChange={handleSelectAllChange}
      aria-label="Select All"
    />
  );
};

const CellCheckbox = ({ row }: { row: any }) => {
  const { rowSelectionIdArray, setRowSelectionIdArray, tagList, setTagList } =
    useContext(RoomTableContext);
  // const [rowSelectionIdArray, setRowSelectionIdArray] = useState<number[]>([]);
  const handleCheckedChange = (value: boolean) => {
    row.toggleSelected(!!value);

    const updatedSelection = value
      ? [...rowSelectionIdArray, row.original.id]
      : rowSelectionIdArray.filter((id: number) => id !== row.original.id);

    setRowSelectionIdArray(updatedSelection);
  };
  // console.log("rowSelectionIdArray:", rowSelectionIdArray);1

  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={handleCheckedChange}
      aria-label={`Select Booking ${row.original.id}`}
    />
  );
};

export const columns: ColumnDef<RoomItem>[] = [
  {
    id: "select",
    header: ({ table }) => <HeaderCheckbox table={table} />,
    cell: ({ row }) => <CellCheckbox row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "hinhAnh",
    header: "Ảnh",
    cell: ({ row }) => (
      <div>
        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
          <AvatarImage src={row.getValue("hinhAnh")} />
          <AvatarFallback className="rounded-none">
            {row.original.hinhAnh}
          </AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "tenPhong",
    header: "Tên",
    cell: function RoomAction({ row }) {
      const roomData = row.original; // Accessing the row data
      // console.log("🚀 ~ RoomAction ~ roomData:", roomData)

      const { selectedValues } = useContext(RoomTableContext);

      const tagList: { value: string; label: string; icon: React.ReactNode }[] =
        [];

      if (roomData.mayGiat) {
        tagList.push({
          value: "mayGiat",
          label: "Máy giặt",
          icon: <WashingMachine size={16} />,
        });
      }
      if (roomData.banLa) {
        tagList.push({
          value: "banLa",
          label: "Bàn là",
          icon: <Shirt size={16} />,
        });
      }
      if (roomData.tivi) {
        tagList.push({ value: "tivi", label: "Tivi", icon: <Tv size={16} /> });
      }
      if (roomData.dieuHoa) {
        tagList.push({
          value: "dieuHoa",
          label: "Điều hòa",
          icon: <AirVent size={16} />,
        });
      }
      if (roomData.wifi) {
        tagList.push({
          value: "wifi",
          label: "Wifi",
          icon: <Wifi size={16} />,
        });
      }
      if (roomData.bep) {
        tagList.push({
          value: "bep",
          label: "Bếp",
          icon: <CookingPot size={16} />,
        });
      }
      if (roomData.doXe) {
        tagList.push({
          value: "doXe",
          label: "Đỗ xe",
          icon: <Car size={16} />,
        });
      }
      if (roomData.hoBoi) {
        tagList.push({
          value: "hoBoi",
          label: "Hồ bơi",
          icon: <Waves size={16} />,
        });
      }
      if (roomData.banUi) {
        tagList.push({
          value: "banUi",
          label: "Bàn ủi",
          icon: <Wind size={16} />,
        });
      }

      // const location = locationList.find((loc) => loc.id === roomData.maViTri);
      // const locationName = location ? location.tenViTri : 'Vị trí không có';

      return (
        <div className="flex flex-col justify-center items-center">
          <div className="capitalize text-left w-full">
            {row.getValue("tenPhong")}
          </div>
          {/* <div className="mt-1 text-left w-full text-sm text-gray-500 flex justify-start items-center"><MapPin size={14} /><span className='ml-1'>{locationName}</span></div> */}
          <div className="mt-2 ml-2 flex flex-wrap gap-2 text-left w-full">
            {tagList.map((tag, index) => {
              return (
                <div key={index} className="flex items-center gap-1">
                  <span
                    className={`tag px-2 py-1 rounded text-sm flex items-center gap-1 
              ${
                selectedValues.includes(tag.value)
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "bg-[hsl(var(--secondary))] text-gray-700"
              }`}
                  >
                    {tag.icon}
                    <span>{tag.label}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "location",
    header: function HeaderLoction({ column }) {
      // const roomData = column.original;
      // const locationListQuery = useGetLocationList();
      // const locationList = locationListQuery.data?.content ?? [];
      // const location = locationList.find((loc) => loc.id === roomData.maViTri);
      // const locationName = location ? location.tenViTri : 'Vị trí không có';

      return (
        <div className="flex flex-col">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Location
            <CaretSortIcon className="ml-2 h-4 w-2" />
          </Button>
          {/* <select
            value={(column.getFilterValue() as string) ?? ''}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className="mt-1 border border-gray-300 rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="true">Nam</option>
            <option value="false">Nữ</option>
          </select> */}
        </div>
      );
    },
    cell: function LocationAction({ row }) {
      const roomData = row.original;
      const locationListQuery = useGetLocationList();
      const locationList = locationListQuery.data?.content ?? [];
      const location = locationList.find(
        (loc: any) => loc.id === roomData.maViTri
      );
      const locationName = location ? location.tenViTri : "Vị trí không có";

      return (
        <div className="mt-1 text-left w-full text-sm text-gray-500 flex justify-start items-center">
          <MapPin size={14} />
          <span className="ml-1">{locationName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phongNgu",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Số phòng ngủ
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("phongNgu")}</div>
    ),
  },
  {
    accessorKey: "khach",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Số khách
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("khach")}</div>
    ),
  },
  {
    accessorKey: "giaTien",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gía tiền
          <CaretSortIcon className="ml-2 h-4 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("giaTien")}$</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setRoomIdEdit, setRoomDelete } = useContext(RoomTableContext);
      const openEditRoom = () => {
        setRoomIdEdit(row.original.id);
      };

      const openDeleteDish = () => {
        setRoomDelete(row.original);
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
            <DropdownMenuItem onClick={openEditRoom}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteDish}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteDish({
  roomDelete,
  setRoomDelete,
}: {
  roomDelete: RoomItem | null;
  setRoomDelete: (value: RoomItem | null) => void;
}) {
  // console.log("🚀 ~ roomDelete id:", roomDelete);

  const { mutateAsync } = useDeleteRoomMutation();
  const deleteRoom = async () => {
    if (roomDelete) {
      try {
        const result = await mutateAsync(roomDelete.id);
        setRoomDelete(null);
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
      open={Boolean(roomDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setRoomDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa phòng?</AlertDialogTitle>
          <AlertDialogDescription>
            Phòng{" "}
            <span className="bg text-primary-foreground rounded px-1">
              {roomDelete?.tenPhong}
            </span>{" "}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteRoom}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface AlertDialogDeleteAllProps {
  rowSelectionIdArray: number[];
  setRowSelectionIdArray: (value: number[]) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}

const AlertDialogDeleteAllBookings: React.FC<AlertDialogDeleteAllProps> = ({
  rowSelectionIdArray,
  setRowSelectionIdArray,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const { mutateAsync } = useDeleteRoomMutation();

  const deleteBookingAll = async (
    rowSelectionIdArray: number[],
    setRowSelectionIdArray: (value: number[]) => void
  ) => {
    if (rowSelectionIdArray.length === 0) {
      toast({ title: "Please select at least one booking to delete" });
      return;
    }

    try {
      // Loop through selected booking IDs and delete
      await Promise.all(
        rowSelectionIdArray.map(async (id) => {
          await mutateAsync(id);
        })
      );
      toast({ title: "Xoá chọn thành công" });

      // Reset selected rows state
      setRowSelectionIdArray([]);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Bookings?</AlertDialogTitle>
            <AlertDialogDescription>
              Booking{" "}
              <span className="rounded px-1">
                {rowSelectionIdArray.join(", ")}
              </span>{" "}
              sẽ bị xóa vĩnh viễn
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteBookingAll(rowSelectionIdArray, setRowSelectionIdArray)
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Số lượng item trên 1 trang
const PAGE_SIZE = 10;

export default function DishTable() {
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const [roomIdEdit, setRoomIdEdit] = useState<number | undefined>();
  const [roomDelete, setRoomDelete] = useState<RoomItem | null>(null);

  const roomListQuery = useGetRoomList();
  // console.log("roomListQuery", roomListQuery);
  const data = roomListQuery.data?.content ?? [];
  // console.log("data", data);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE, //default page size
  });

  const [rowSelectionIdArray, setRowSelectionIdArray] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //select tag

  const [tagList, setTagList] = useState<
    { value: string; label: string; icon: React.ReactNode }[]
  >([
    {
      value: "mayGiat",
      label: "Máy giặt",
      icon: <WashingMachine size={16} />,
    },
    {
      value: "banLa",
      label: "Bàn là",
      icon: <Shirt size={16} />,
    },
    {
      value: "tivi",
      label: "Tivi",
      icon: <Tv size={16} />,
    },
    {
      value: "dieuHoa",
      label: "Điều hòa",
      icon: <AirVent size={16} />,
    },
    {
      value: "wifi",
      label: "Wifi",
      icon: <Wifi size={16} />,
    },
    {
      value: "bep",
      label: "Bếp",
      icon: <CookingPot size={16} />,
    },
    {
      value: "doXe",
      label: "Đỗ xe",
      icon: <Car size={16} />,
    },
    {
      value: "hoBoi",
      label: "Hồ bơi",
      icon: <Waves size={16} />,
    },
    {
      value: "banUi",
      label: "Bàn ủi",
      icon: <Wind size={16} />,
    },
  ]);

  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const handleTagRemove = (value: string) => {
    setSelectedValues(selectedValues.filter((item) => item !== value));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (e.target.checked) {
      setSelectedValues((prev) => [...prev, value]); // Thêm vào selectedValues
    } else {
      setSelectedValues((prev) => prev.filter((item) => item !== value)); // Loại bỏ khỏi selectedValues
    }
  };

  const [selectedLocationValues, setSelectedLocationValues] = React.useState<
    number[]
  >([]);

  const filteredData = React.useMemo(() => {
    return data.filter((room: any) => {
      // Location filter (if any)
      const locationMatches =
        selectedLocationValues.length === 0 || // If no location filter is applied, match everything
        selectedLocationValues.some((loc) => room.maViTri === loc); // Check if the room's maViTri matches any selected location

      // Tag filter (if any)
      const tagsMatch =
        selectedValues.length === 0 || // If no tag filter is applied, match everything
        selectedValues.every((selectedTag) => {
          switch (selectedTag) {
            case "mayGiat":
              return room.mayGiat;
            case "banLa":
              return room.banLa;
            case "tivi":
              return room.tivi;
            case "dieuHoa":
              return room.dieuHoa;
            case "wifi":
              return room.wifi;
            case "bep":
              return room.bep;
            case "doXe":
              return room.doXe;
            case "hoBoi":
              return room.hoBoi;
            case "banUi":
              return room.banUi;
            default:
              return false;
          }
        });

      // Return the row if both location and tags match
      return locationMatches && tagsMatch;
    });
  }, [data, selectedLocationValues, selectedValues]);

  //location
  const [locationList, setLocationList] = React.useState<LocationItem[]>([]);
  const [openLocationSelect, setOpenLocationSelect] = React.useState(false);

  const [locationSearchTerm, setLocationSearchTerm] =
    React.useState<string>("");
  const locationListQuery = useGetLocationList();
  const locationListRes = locationListQuery.data?.content ?? [];

  React.useEffect(() => {
    // Only update locationList if the data has changed
    if (locationListRes.length > 0) {
      setLocationList(locationListRes);
    }
  }, [locationListRes, locationList]);

  // const handleLocationCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
  //   if (e.target.checked) {
  //     setSelectedValues((prev) => [...prev, value]); // Thêm vào selectedValues
  //   } else {
  //     setSelectedValues((prev) => prev.filter((item) => item !== value)); // Loại bỏ khỏi selectedValues
  //   }
  // };

  const handleLocationCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: number
  ) => {
    if (e.target.checked) {
      // Add the location ID (number) to the selected list when checked
      setSelectedLocationValues((prev) => [...prev, value]);
    } else {
      // Remove the location ID (number) when unchecked
      setSelectedLocationValues((prev) =>
        prev.filter((item) => item !== value)
      );
    }
  };

  // const tagDropdownRef = useRef<HTMLDivElement | null>(null);
  // const locationDropdownRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     // Kiểm tra nếu click ra ngoài tagDropdownRef và locationDropdownRef
  //     if (
  //       tagDropdownRef.current &&
  //       !tagDropdownRef.current.contains(event.target as Node) &&  // click ra ngoài dropdown tag
  //       locationDropdownRef.current &&
  //       !locationDropdownRef.current.contains(event.target as Node)  // click ra ngoài dropdown location
  //     ) {
  //       setOpen(false);  // Đóng dropdown tag
  //       setOpenLocationSelect(false);  // Đóng dropdown location
  //     }
  //   };

  //   // Thêm event listener khi component được mount
  //   document.addEventListener('click', handleClickOutside);

  //   return () => {
  //     // Dọn dẹp event listener khi component bị unmount
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, []);

  const table = useReactTable({
    data: filteredData,
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
    <RoomTableContext.Provider
      value={{
        roomIdEdit,
        setRoomIdEdit,
        roomDelete,
        setRoomDelete,
        rowSelectionIdArray,
        setRowSelectionIdArray,
        setIsDialogOpen,
        tagList,
        setTagList,
        selectedValues,
        setSelectedValues,
        locationList,
        setLocationList,
      }}
    >
      <div className="w-full">
        <EditRoom id={roomIdEdit} setId={setRoomIdEdit} />
        <AlertDialogDeleteDish
          roomDelete={roomDelete}
          setRoomDelete={setRoomDelete}
        />
        <AlertDialogDeleteAllBookings
          rowSelectionIdArray={rowSelectionIdArray}
          setRowSelectionIdArray={setRowSelectionIdArray}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
        <div className="h-[50px] w-full">
          {/* Display selected tags below the input */}
          <div className="top-full flex flex-wrap w-full">
            {selectedValues.map((value) => {
              const tag = tagList.find((f) => f.value === value);
              return (
                <span
                  key={value}
                  className="tag px-2 py-1 rounded text-sm flex items-center gap-2 ml-1 
                  bg-[hsl(var(--primary))] text-white"
                >
                  {tag?.icon} {/* Render icon */}
                  {tag?.label} {/* Render label */}
                  <X
                    className="ml-1 h-4 w-4 cursor-pointer"
                    onClick={() => handleTagRemove(value)}
                  />
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between py-4">
          {" "}
          {/* Using flex-col to stack input and tags vertically */}
          <div className="w-1/2 ">
            <div className="flex justify-between items-start">
              <div className="w-1/2 pr-2 ">
                <Input
                  placeholder="Lọc tên"
                  value={
                    (table.getColumn("tenPhong")?.getFilterValue() as string) ??
                    ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("tenPhong")
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-full mb-2"
                />
              </div>

              <div className="w-1/2 flex justify-between items-center text-center">
                <div className="w-1/2 pl-2 ">
                  {/* Button to toggle dropdown */}
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full mb-2"
                    onClick={() => setOpen(!open)}
                  >
                    {selectedValues.length === 0
                      ? "Select tag"
                      : `${selectedValues.length} selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  {/* Dropdown content */}
                  {open && (
                    <div
                      // ref={tagDropdownRef}
                      className="mt-2 p-2 border rounded-md w-full max-w-[200px] absolute z-10 bg-white shadow-md"
                    >
                      <Command>
                        <CommandInput placeholder="Search tag..." />
                        <CommandList>
                          <CommandEmpty>No tag.</CommandEmpty>
                          <CommandGroup>
                            {tagList.map((tagItem) => (
                              <CommandItem
                                key={tagItem.value}
                                value={tagItem.value}
                              >
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  checked={selectedValues.includes(
                                    tagItem.value
                                  )}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, tagItem.value)
                                  }
                                />
                                {tagItem.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </div>
                <div className="w-1/2 pl-2 ">
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openLocationSelect}
                    className="w-full mb-2"
                    onClick={() => setOpenLocationSelect(!openLocationSelect)}
                  >
                    {selectedLocationValues.length === 0
                      ? "Location"
                      : `${selectedLocationValues.length} selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  {/* Dropdown content */}
                  {/* {openLocationSelect && (
                    <div className="mt-2 p-2 border rounded-md w-full max-w-[200px] absolute z-10 bg-white shadow-md">
                      <Command>
                        <CommandInput placeholder="Search tag..." />
                        <CommandList>
                          <CommandEmpty>No tag.</CommandEmpty>
                          <CommandGroup>
                            {locationList.map((locationItem) => (
                              <CommandItem
                                key={locationItem.id}
                                value={locationItem.tenViTri}
                              >
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  checked={selectedLocationValues.includes(locationItem.tenViTri)}
                                  onChange={(e) => handleLocationCheckboxChange(e, locationItem.tenViTri)}
                                />
                                {locationItem.tenViTri}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )} */}
                  {openLocationSelect && (
                    <div
                      // ref={locationDropdownRef}
                      className="mt-2 p-2 border rounded-md w-full max-w-[200px] absolute z-10 bg-white shadow-md"
                    >
                      {/* Search input for filtering location */}
                      <input
                        type="text"
                        placeholder="Search location..."
                        className="w-full p-2 border rounded-md mb-2"
                        value={locationSearchTerm}
                        onChange={(e) => setLocationSearchTerm(e.target.value)}
                      />
                      <div className="max-h-60 overflow-y-auto">
                        {locationList
                          .filter((locationItem) =>
                            locationItem.tenViTri
                              .toLowerCase()
                              .includes(locationSearchTerm.toLowerCase())
                          )
                          .map((locationItem) => (
                            <div
                              key={locationItem.id}
                              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {/* Checkbox for each location */}
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={selectedLocationValues.includes(
                                  locationItem.id
                                )}
                                onChange={(e) =>
                                  handleLocationCheckboxChange(
                                    e,
                                    locationItem.id
                                  )
                                }
                              />
                              <span>{locationItem.tenViTri}</span>{" "}
                              {/* Location name */}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex-col">
            {/* Other layout part */}
            <div className="w-full flex justify-end">
              <div className="ml-auto flex items-center gap-2">
                <Button
                  className="btn btn-danger"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={rowSelectionIdArray.length === 0}
                >
                  Delete All
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-auto">
                      Columns <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
                <AddRoom />
              </div>
            </div>
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
            <strong>{data.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/room"
            />
          </div>
        </div>
      </div>
    </RoomTableContext.Provider>
  );
}
