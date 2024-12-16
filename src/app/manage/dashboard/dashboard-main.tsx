"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueLineChart } from "@/app/manage/dashboard/revenue-line-chart";
import { DishBarChart } from "@/app/manage/dashboard/dish-bar-chart";
// import { formatCurrency } from '@/lib/utils'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  endOfDay,
  format,
  startOfDay,
  isWithinInterval,
  eachDayOfInterval,
} from "date-fns";
import { useState } from "react";
import { useGetBookingList } from "@/queries/useBooking";
import { useGetUserList } from "@/queries/useUser";
import { useGetRoomList } from "@/queries/useRoom";
// import { ChartConfig } from '@/components/ui/chart';

const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

type Room = {
  id: number;
  tenPhong: string;
};

type BookingItem = {
  room: Room;
};

type RoomBookingCount = {
  [roomId: number]: {
    count: number;
    room: Room;
  };
};

const colors = [
  "var(--color-chrome)",
  "var(--color-safari)",
  "var(--color-firefox)",
  "var(--color-edge)",
  "var(--color-other)",
];

// const chartConfig = {
//   visitors: {
//     label: 'Visitors'
//   },
//   chrome: {
//     label: 'Chrome',
//     color: 'hsl(var(--chart-1))'
//   },
//   safari: {
//     label: 'Safari',
//     color: 'hsl(var(--chart-2))'
//   },
//   firefox: {
//     label: 'Firefox',
//     color: 'hsl(var(--chart-3))'
//   },
//   edge: {
//     label: 'Edge',
//     color: 'hsl(var(--chart-4))'
//   },
//   other: {
//     label: 'Other',
//     color: 'hsl(var(--chart-5))'
//   }
// } satisfies ChartConfig

export default function DashboardMain() {
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  const bookingListQuery = useGetBookingList();
  const bookingList = bookingListQuery.data?.content ?? [];

  const userListQuery = useGetUserList();
  const userList = userListQuery.data?.content ?? [];

  const roomListQuery = useGetRoomList();
  const roomList = roomListQuery.data?.content ?? [];

  const mergedBookingData = bookingList.map((booking: any) => {
    const user = userList.find((user: any) => user.id === booking.maNguoiDung);
    const room = roomList.find((room: any) => room.id === booking.maPhong);

    return {
      ...booking,
      user: user || null, // Thông tin người dùng hoặc null nếu không tìm thấy
      room: room || null, // Thông tin phòng hoặc null nếu không tìm thấy
    };
  });

  const validBookingData = mergedBookingData.filter(
    (booking: any) => booking.user !== null && booking.room !== null
  );
  // console.log("🚀 ~ DashboardMain ~ validBookingData:", validBookingData)

  const updatedDataArray = validBookingData.map((item: any) => {
    const ngayDen = new Date(item.ngayDen);
    const ngayDi = new Date(item.ngayDi);
    const soNgay =
      (ngayDi.getTime() - ngayDen.getTime()) / (1000 * 60 * 60 * 24);
    const giaTien = item.room?.giaTien || 0;
    const thanhTien = soNgay * giaTien;

    // Trả về object với doanh thu được thêm vào
    return {
      ...item,
      thanhTien: thanhTien,
    };
  });
  // console.log("🚀 ~ updatedDataArray ~ updatedDataArray:", updatedDataArray)

  // Lọc các booking theo khoảng thời gian
  const filteredData = updatedDataArray.filter((item: any) => {
    const ngayDen = new Date(item.ngayDen);
    const ngayDi = new Date(item.ngayDi);

    // Kiểm tra nếu booking nằm trong khoảng thời gian
    return (
      isWithinInterval(ngayDen, { start: fromDate, end: toDate }) ||
      isWithinInterval(ngayDi, { start: fromDate, end: toDate })
    );
  });

  // Tính tổng doanh thu
  // const totalRevenue = filteredData.reduce((sum, item) => sum + item.thanhTien, 0);

  const totalBookings = filteredData.length;

  // Tạo danh sách ngày từ `fromDate` đến `toDate`
  const dateRange = eachDayOfInterval({ start: fromDate, end: toDate });

  const chartData = dateRange.map((date) => {
    const currentDay = date.setHours(0, 0, 0, 0);

    const dailyRevenue = updatedDataArray.reduce((total: any, booking: any) => {
      const ngayDen = new Date(booking.ngayDen).setHours(0, 0, 0, 0);
      const ngayDi = new Date(booking.ngayDi).setHours(0, 0, 0, 0);

      if (isWithinInterval(currentDay, { start: ngayDen, end: ngayDi })) {
        // Tính doanh thu của booking trong ngày hiện tại
        return total + booking.thanhTien; // Lấy tổng doanh thu của booking (thanhTien)
      }
      return total;
    }, 0);

    return { date: format(currentDay, "dd/MM/yyyy"), revenue: dailyRevenue };
  });

  const totalRevenue = chartData.reduce(
    (total, dayData) => total + dayData.revenue,
    0
  );

  const roomBookingCount = updatedDataArray.reduce((acc: any, item: any) => {
    if (!item.room) return acc; // Bỏ qua nếu room là null

    const roomId = item.room.id;
    acc[roomId] = acc[roomId] || { count: 0, room: item.room };
    acc[roomId].count++;
    return acc;
  }, {} as Record<number, { count: number; room: (typeof updatedDataArray)[0]["room"] }>);

  const sortedRooms = Object.values(roomBookingCount)
    .map(({ count, room }: any, index) => {
      if (!room) return null; // Kiểm tra room null hoặc undefined

      return {
        name: room.tenPhong,
        successOrders: count,
        fill: colors[index % colors.length], // Lấy màu từ mảng colors
      };
    })
    .filter((item) => item !== null) // Lọc các giá trị null
    .sort((a: any, b: any) => b.successOrders - a.successOrders); // Sắp xếp theo số lượt đặt phòng

  const top10Rooms = sortedRooms.slice(0, 10);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <span className="mr-2">Từ</span>
          <Input
            type="datetime-local"
            placeholder="Từ ngày"
            className="text-sm"
            value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
            onChange={(event) => setFromDate(new Date(event.target.value))}
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2">Đến</span>
          <Input
            type="datetime-local"
            placeholder="Đến ngày"
            value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
            onChange={(event) => setToDate(new Date(event.target.value))}
          />
        </div>
        <Button className="" variant={"outline"} onClick={resetDateFilter}>
          Reset
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString() + " $"}
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Khách</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
            <p className='text-xs text-muted-foreground'>Gọi món</p>
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">Đã thanh toán</p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Bàn đang phục vụ</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
          </CardContent>
        </Card> */}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueLineChart chartData={chartData} />
        </div>
        <div className="lg:col-span-3">
          <DishBarChart chartData={top10Rooms} />
        </div>
      </div>
    </div>
  );
}
