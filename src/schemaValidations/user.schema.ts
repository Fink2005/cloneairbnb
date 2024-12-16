import { z } from "zod";
import { Role } from "../constants/type";

// Get User Request Body
export const GetUserBody = z
  .object({
    id: z.number(), // Chỉ cần số id
  })
  .strict();

export type GetUserBodyType = z.infer<typeof GetUserBody>;
// Get User Response Body
export const GetUserResponse = z
  .object({
    statusCode: z.number(), // Mã trạng thái HTTP
    content: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string().email(),
      password: z.string().optional(),
      phone: z.string().optional(),
      birthday: z.string().optional(),
      avatar: z.string().url().optional(),
      gender: z.boolean(),
      role: z.enum([Role.User, Role.Admin]),
    }),
    dateTime: z.string().datetime(), // ISO 8601 datetime format
  })
  .strict();

export type GetUserResponseType = z.infer<typeof GetUserResponse>;

export const UserUpdateBody = z
  .object({
    // id: z.number().min(1), // id là số nguyên và phải lớn hơn hoặc bằng 1
    name: z.string(), // Tên phải là chuỗi và có độ dài tối thiểu 1 ký tự, tối đa 256 ký tự
    email: z.string(), // Email phải có định dạng hợp lệ
    phone: z.string(), // Số điện thoại với độ dài từ 10 đến 15 ký tự
    birthday: z.string(), // Ngày sinh, có thể không có (optional)
    gender: z.boolean(), // Giới tính là boolean
    role: z.enum([Role.User, Role.Admin]),
    avatar: z.string().url().optional(),
  })
  .strict();

export type UserUpdateBodyType = z.TypeOf<typeof UserUpdateBody>;

export const UserUpdateResponse = z
  .object({
    statusCode: z.number().int(), // Mã trạng thái HTTP
    content: z.object({
      id: z.number(), // ID người dùng
      name: z.string(), // Tên người dùng
      email: z.string(), // Email người dùng
      password: z.string(), // Mật khẩu người dùng (có thể có trong response, tùy yêu cầu API)
      phone: z.string(), // Số điện thoại người dùng
      birthday: z.string(), // Ngày sinh người dùng
      avatar: z.string().url().optional(),
      gender: z.boolean(), // Giới tính người dùng
      role: z.string(), // Vai trò người dùng
    }),
    dateTime: z.string(), // Thời gian cập nhật (thường là ISO string)
  })
  .strict();

export type UserUpdateResponseType = z.TypeOf<typeof UserUpdateResponse>;

export const UploadAvatarResponse = z
  .object({
    statusCode: z.number().int(), // Mã trạng thái HTTP
    content: z.object({
      id: z.number(), // ID người dùng
      name: z.string(), // Tên người dùng
      email: z.string(), // Email người dùng
      password: z.string(), // Mật khẩu người dùng (có thể có trong response, tùy yêu cầu API)
      phone: z.string(), // Số điện thoại người dùng
      birthday: z.string(), // Ngày sinh người dùng
      avatar: z.string().url().optional(),
      gender: z.boolean(), // Giới tính người dùng
      role: z.enum([Role.User, Role.Admin]),
    }),
    dateTime: z.string(), // Thời gian cập nhật dưới dạng chuỗi ISO
  })
  .strict();

export type UploadAvatarResponseType = z.TypeOf<typeof UploadAvatarResponse>;

// // Khai báo kiểu dữ liệu cho body gửi lên server khi upload avatar
// export const UploadAvatarBody = z.object({
//   avatar: z.instanceof(File).refine(file =>  file.size > 0, {
//     message: 'Vui lòng chọn ảnh.',
//   }), // Đảm bảo avatar là một file và có kích thước > 0
// });

// export type UploadAvatarBodyType = z.TypeOf<typeof UploadAvatarBody>;

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  phone: z.string().optional(),
  birthday: z.string().optional(),
  avatar: z.string().url().optional(),
  gender: z.boolean(),
  role: z.enum([Role.User, Role.Admin]),
});

export type UserType = z.TypeOf<typeof UserSchema>;

export const UsertListRes = z.object({  
    statusCode: z.number(), // Mã trạng thái HTTP
    content: z.array(UserSchema),
    dateTime: z.string().datetime(), // ISO 8601 datetime format
});

export type UserListResType = z.TypeOf<typeof UsertListRes>;



export const CreateUserBody = z
  .object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    password: z.string().optional(),
    phone: z.string().optional(),
    birthday: z.string().optional(),
    gender: z.boolean(),
    role: z.enum([Role.User, Role.Admin]),
  })
export type CreateUserBodyType = z.TypeOf<typeof CreateUserBody>

//CreateUserResponseType sử dụng GetUserResponseType

export type CreateUserResponseType = z.infer<typeof GetUserResponse>;

export const DeleteUserResponse = z
  .object({
    statusCode: z.number().int(), // statusCode phải là số nguyên
    message: z.string(), // message là một chuỗi
    content: z.null(), // content là null
    dateTime: z.string(), // dateTime là chuỗi, có thể là ISO string
  })
  .strict(); // Chặn thêm bất kỳ thuộc tính nào không xác định

// Type của response
export type DeleteUserResponseType = z.TypeOf<typeof DeleteUserResponse>;

