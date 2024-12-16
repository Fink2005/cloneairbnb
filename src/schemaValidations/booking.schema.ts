import { date, z } from "zod";
import { UserSchema } from "./user.schema";
import { RoomSchema } from "./room.schema";

export const BookingSchema = z.object({
  id: z.number(), // id là số nguyên
  maPhong: z.number(), // maPhong là số nguyên
  ngayDen: z.string().datetime(), // ngày đến ở định dạng ISO datetime string
  ngayDi: z.string().datetime(), // ngày đi ở định dạng ISO datetime string
  soLuongKhach: z.number().int().positive(), // số lượng khách là số nguyên dương
  maNguoiDung: z.number(), // maNguoiDung là số nguyên
});

export type BookingType = z.TypeOf<typeof BookingSchema>;

export const LocationListRes = z.object({
  statusCode: z.number(), // Mã trạng thái HTTP
  content: z.array(BookingSchema),
  dateTime: z.string().datetime(), // ISO 8601 datetime format
});

export type BookingListResType = z.TypeOf<typeof LocationListRes>;

export const CreateBookingBody = z.object({
  id: z.number(),
  maPhong: z.number(), // maPhong là số nguyên
  ngayDen: z.string(), // ngày đến ở định dạng ISO datetime string
  ngayDi: z.string(), // ngày đi ở định dạng ISO datetime string
  soLuongKhach: z.number().int().positive(), // số lượng khách là số nguyên dương
  maNguoiDung: z.number(), // maNguoiDung là số nguyên
});

export type CreateBookingBodyType = z.TypeOf<typeof CreateBookingBody>;

export const CreateBookingDetailBody = z.object({
  id: z.number(),
  maPhong: z.number(), // maPhong là số nguyên
  ngayDen: z.date(), // ngày đến ở định dạng ISO datetime string
  ngayDi: z.date(), // ngày đi ở định dạng ISO datetime string
  soLuongKhach: z.number().int().positive(), // số lượng khách là số nguyên dương
  maNguoiDung: z.number(), // maNguoiDung là số nguyên
});

export type CreateBookingDetailBodyType = z.TypeOf<
  typeof CreateBookingDetailBody
>;

export const CreateBookingBodyRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  content: BookingSchema,
  dateTime: z.string().datetime(),
});

export type CreateBookingBodyResType = z.TypeOf<typeof CreateBookingBodyRes>;

export const GetBookingByIdRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  content: BookingSchema,
  dateTime: z.string().datetime(),
});

export type GetBookingByIdResType = z.TypeOf<typeof GetBookingByIdRes>;

export const DeleteBookingBodyRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  content: z.null(),
  dateTime: z.string().datetime(),
});

export type DeleteBookingBodyResType = z.TypeOf<typeof DeleteBookingBodyRes>;

export const GetBookingByUserBody = z.object({
  statusCode: z.number(),
  content: z.array(BookingSchema),
  dateTime: z.string().datetime(),
});

export type GetBookingByUserResType = z.TypeOf<typeof GetBookingByUserBody>;

export const UserBookingSchema = BookingSchema.extend({
  id: z.number(),
  maPhong: z.number(),
  ngayDen: z.string(),
  ngayDi: z.string(),
  soLuongKhach: z.number(),
  maNguoiDung: z.number(),
  user: UserSchema.nullable(), // Kết hợp UserSchema
  room: RoomSchema.nullable(), // Kết hợp RoomSchema
});

export type GetBookingListByUserResType = z.TypeOf<typeof UserBookingSchema>;

export const ListBookingUserBody = z.object({
  statusCode: z.number(), // Mã trạng thái HTTP
  content: z.array(UserBookingSchema),
  dateTime: z.string().datetime(), // ISO 8601 datetime format
});

export type ListBookingUserBodyType = z.TypeOf<typeof ListBookingUserBody>;
