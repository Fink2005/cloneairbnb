import { z } from "zod";

export const LocationSchema = z.object({
  id: z.number().int().min(0), // ID, số nguyên không âm
  tenViTri: z.string(), // Tên vị trí, kiểu chuỗi
  tinhThanh: z.string(), // Tỉnh/thành phố, kiểu chuỗi
  quocGia: z.string(), // Quốc gia, kiểu chuỗi
  hinhAnh: z.string().url(), //
});

export type LocationType = z.TypeOf<typeof LocationSchema>;

export const LocationListRes = z.object({
  statusCode: z.number(), // Mã trạng thái HTTP
  content: z.array(LocationSchema),
  dateTime: z.string().datetime(), // ISO 8601 datetime format
});

export type LocationListResType = z.TypeOf<typeof LocationListRes>;

export const CreateLocationBody = z.object({
  id: z.number().int().min(0), // ID, số nguyên không âm
  tenViTri: z.string(), // Tên vị trí, kiểu chuỗi
  tinhThanh: z.string(), // Tỉnh/thành phố, kiểu chuỗi
  quocGia: z.string(), // Quốc gia, kiểu chuỗi
  hinhAnh: z.string().url(), /// Image URL (valid URL string)
});

export type CreateLocationBodyType = z.TypeOf<typeof CreateLocationBody>;

export const CreateLocationBodyRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  content: LocationSchema,
  dateTime: z.string().datetime(),
});

export type CreateLocationBodyResType = z.TypeOf<typeof CreateLocationBodyRes>;

export const GetLocationByIdRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  content: LocationSchema,
  dateTime: z.string().datetime(),
});

export type GetLocationByIdResType = z.TypeOf<typeof GetLocationByIdRes>;

export const DeleteLocationBodyRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  content: z.null(),
  dateTime: z.string().datetime(),
});

export type DeleteLocationBodyResType = z.TypeOf<typeof DeleteLocationBodyRes>;

export const UploadBodyRes = z.object({
  statusCode: z.number(),
  content: LocationSchema,
  dateTime: z.string().datetime(),
});

export type UploadResType = z.TypeOf<typeof UploadBodyRes>;
