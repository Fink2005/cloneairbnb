import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "@/hooks/use-toast";
import { UseFormSetError } from "react-hook-form";
import jwt from "jsonwebtoken";
import { TokenPayload } from "@/types/jwt.types";
// import {RoomStatus, OrderStatus, TableStatus} from '../../../../NextJs-Super-Template-main/src/constants/type';
// import envConfig from '../../';
// import {format} from 'date-fns';
// import jwt from 'jsonwebtoken';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

// export const decodeJWT = <Payload = any>(token: string) => {
//   return jwt.decode(token) as Payload

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  // console.log(error.payload);
  error?.payload?.errors?.forEach((item: any) => {
    setError?.(item.field, {
      type: "server",
      message: item.message,
    });
  });

  // Handle generic errors
  if (!error?.payload?.errors) {
    console.log("err", error.payload);
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }

  // if (error instanceof EntityError && setError) {
  //   error.payload.errors.forEach((item) => {
  //     console.log(item);
  //     setError(item.field, {
  //       type: 'server',
  //       message: item.message
  //     })
  //   })
  // } else {
  //   toast({
  //     title: 'Lỗi',
  //     description: error?.payload?.message ?? 'Lỗi không xác định',
  //     variant: 'destructive',
  //     duration: duration ?? 5000
  //   })
  // }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};

// export const getVietnameseRoomStatus = (status: (typeof RoomStatus)[keyof typeof RoomStatus]) => {
//   switch (status) {
//     case RoomStatus.Available:
//       return 'Có sẵn'
//     case RoomStatus.Unavailable:
//       return 'Không có sẵn'
//     default:
//       return 'Ẩn'
//   }
// }

// export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
//   switch (status) {
//     case OrderStatus.Delivered:
//       return 'Đã phục vụ'
//     case OrderStatus.Paid:
//       return 'Đã thanh toán'
//     case OrderStatus.Pending:
//       return 'Chờ xử lý'
//     case OrderStatus.Processing:
//       return 'Đang nấu'
//     default:
//       return 'Từ chối'
//   }
// }

// export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
//   switch (status) {
//     case TableStatus.Available:
//       return 'Có sẵn'
//     case TableStatus.Reserved:
//       return 'Đã đặt'
//     default:
//       return 'Ẩn'
//   }
// }

// export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
//   return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
// }

const isBrowser = typeof window !== "undefined";

//user
export const getUserFromLocalStorage = () => {
  return isBrowser ? JSON.parse(localStorage.getItem("user") || "null") : null;
};

export const setUserToLocalStorage = (value: object) => {
  isBrowser && localStorage.setItem("user", JSON.stringify(value));
};

export const removeUserFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("user");
};

//userToken
export const getUserTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("userToken") : null;
};

export const setUserTokenToLocalStorage = (value: string) => {
  isBrowser && localStorage.setItem("userToken", value);
};

export const removeUserTokenFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("userToken");
};

//userProfile
export const getUserProfileFromLocalStorage = () => {
  return isBrowser
    ? JSON.parse(localStorage.getItem("userProfile") || "null")
    : null;
};

export const setUserProfileToLocalStorage = (value: object) => {
  isBrowser && localStorage.setItem("userProfile", JSON.stringify(value));
};

export const removeUserProfileFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("userProfile");
};
