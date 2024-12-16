import { SigninBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json()) as SigninBodyType;
  const cookieStore = await cookies();
  try {
    const  payload  = await authApiRequest.NextServerToServerSignin(body);
    console.log('payload', payload);
    const { token } = payload.content;
    cookieStore.set("userToken", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Có lỗi xảy ra",
        },
        {
          status: 500,
        }
      );
    }
  }
}
