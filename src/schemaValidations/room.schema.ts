import { z } from "zod";
import { UserSchema } from "@/schemaValidations/user.schema";

export const RoomSchema = z.object({
  id: z.number().int(), // Room ID as an integer
  tenPhong: z.string(), // Room name as a string
  khach: z.number().int().min(1), // Number of guests (minimum 1)
  phongNgu: z.number().int().min(1), // Number of bedrooms (minimum 1)
  giuong: z.number().int().min(1), // Number of beds (minimum 1)
  phongTam: z.number().int().min(1), // Number of bathrooms (minimum 1)
  moTa: z.string(), // Description of the room as a string
  giaTien: z.number().min(0), // Price (must be non-negative)
  mayGiat: z.boolean(), // Washing machine availability
  banLa: z.boolean(), // Iron availability
  tivi: z.boolean(), // TV availability
  dieuHoa: z.boolean(), // Air conditioning availability
  wifi: z.boolean(), // Wi-Fi availability
  bep: z.boolean(), // Kitchen availability
  doXe: z.boolean(), // Parking availability
  hoBoi: z.boolean(), // Swimming pool availability
  banUi: z.boolean(), // Balcony availability
  maViTri: z.number().int().min(1), // Location ID (minimum 1)
  hinhAnh: z.string().url().optional(), // Image URL (must be a valid URL)
});

export type RoomType = z.TypeOf<typeof RoomSchema>;

export const RoomListRes = z.object({
  statusCode: z.number(), // Mã trạng thái HTTP
  content: z.array(RoomSchema),
  dateTime: z.string().datetime(), // ISO 8601 datetime format
});

export type RoomListResType = z.TypeOf<typeof RoomListRes>;

export const CreateRoomBody = z.object({
  id: z.number().int().min(0), // Room ID (integer, can be 0 for a new room)
  tenPhong: z.string(), // Room name as a string
  khach: z.number().int().min(0), // Number of guests (non-negative integer)
  phongNgu: z.number().int().min(0), // Number of bedrooms (non-negative integer)
  giuong: z.number().int().min(0), // Number of beds (non-negative integer)
  phongTam: z.number().int().min(0), // Number of bathrooms (non-negative integer)
  moTa: z.string(), // Description of the room
  giaTien: z.number().min(0), // Price (non-negative integer)
  mayGiat: z.boolean(), // Washing machine availability
  banLa: z.boolean(), // Iron availability
  tivi: z.boolean(), // TV availability
  dieuHoa: z.boolean(), // Air conditioning availability
  wifi: z.boolean(), // Wi-Fi availability
  bep: z.boolean(), // Kitchen availability
  doXe: z.boolean(), // Parking availability
  hoBoi: z.boolean(), // Swimming pool availability
  banUi: z.boolean(), // Balcony availability
  maViTri: z.number().int().min(0), // Location ID (non-negative integer)
  hinhAnh: z.string().url().optional(), // Image URL (valid URL string)
});

export type CreateRoomBodyType = z.TypeOf<typeof CreateRoomBody>;

export const CreateRoomBodyRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  content: RoomSchema,
  dateTime: z.string().datetime(),
});

export type CreateRoomBodyResType = z.TypeOf<typeof CreateRoomBodyRes>;

export const GetRoomByIdRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  content: RoomSchema,
  dateTime: z.string().datetime(),
});

export type GetRoomByIdResType = z.TypeOf<typeof GetRoomByIdRes>;

export const GetRoomByLocationBodyRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  content: z.array(RoomSchema),
  dateTime: z.string().datetime(),
});

export type GetRoomByLocationResType = z.TypeOf<
  typeof GetRoomByLocationBodyRes
>;

export const DeleteRoomBodyRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  content: z.null(),
  dateTime: z.string().datetime(),
});

export type DeleteRoomBodyResType = z.TypeOf<typeof DeleteRoomBodyRes>;

export const UploadBodyRes = z.object({
  statusCode: z.number(),
  content: RoomSchema,
  dateTime: z.string().datetime(),
});

export type UploadResType = z.TypeOf<typeof UploadBodyRes>;
