import { z } from "zod";

// Signup Request Body
export const SignupBody = z
  .object({
    id: z.number().optional(),
    name: z
      .string()
      .min(1, "Tên không được bỏ trống")
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Tên chỉ được chứa chữ cái và khoảng trắng", // Message in Vietnamese
      }),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(1, "Mật khẩu không được bỏ trống")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu không được vượt quá 50 ký tự"),
    phone: z
      .string()
      .min(1, "Số điện thoại không được bỏ trống")
      .min(10, "Số điện thoại phải có đủ 10 số")
      .max(10, "Số điện thoại chỉ được chứa 10 chữ số"),
    birthday: z.custom((val) => val !== null, {
      message: "Không được bỏ trống",
    }),
    gender: z.custom((val) => val !== null, {
      message: "Không được bỏ trống",
    }),
    role: z.enum(["USER", "ADMIN"]).optional(),
  })
  .strict();

export type SignupBodyType = z.infer<typeof SignupBody>;

// Signup Response Body
export const SignupResponse = z
  .object({
    statusCode: z.number(),
    content: z.object({
      id: z.number().optional(),
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6).max(100).optional(),
      phone: z.string().optional(),
      birthday: z.string().optional(),
      avatar: z.string().nullable(),
      gender: z.boolean().optional(),
      role: z.enum(["USER", "ADMIN"]),
    }),
    dateTime: z.string().datetime().optional(), // Ensures it matches an ISO 8601 datetime format
  })
  .strict();

export type SignupResponseType = z.infer<typeof SignupResponse>;

// Signin Request Body
export const SigninBody = z
  .object({
    // email: z.string().email(),
    // password: z.string().min(6).max(100)
    email: z
      .string()
      .email("Email không hợp lệ")
      .min(1, "Email không được bỏ trống"),
    password: z
      .string()
      .min(1, "Mật khẩu không được bỏ trống")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu không được vượt quá 50 ký tự"),
  })
  .strict();

export type SigninBodyType = z.infer<typeof SigninBody>;

// Signin Response Body
export const SigninResponse = z
  .object({
    statusCode: z.number(),
    content: z.object({
      user: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().email(),
        password: z.string().optional(), // Optional as it might be blank
        phone: z.string().optional(),
        birthday: z.string().optional(),
        avatar: z.string().optional(),
        gender: z.boolean(),
        role: z.enum(["USER", "ADMIN"]),
      }),
      token: z.string(),
    }),
    dateTime: z.string().datetime(),
  })
  .strict();

export type SigninResponseType = z.infer<typeof SigninResponse>;
