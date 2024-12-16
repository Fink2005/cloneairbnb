import { cookies } from "next/headers";
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
    const cookiesStore = await cookies();
    const tokenCybersoft = cookiesStore.get('userToken')?.value;
    cookiesStore.delete('userToken');

    if(!tokenCybersoft){
        return Response.json({
            message: "Không nhận được tokenCybersoft từ cookies của browser gửi lên"
        },{
            status: 200
        })
    }
    return Response.json({
        message: "Sign out thành công"
    },{
        status: 200
    })

}
