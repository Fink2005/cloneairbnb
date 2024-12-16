import http from "@/lib/http";
import {
  CreateRoomBodyType,
  RoomListResType,
  CreateRoomBodyResType,
  RoomType,
  DeleteRoomBodyResType,
  GetRoomByIdResType,
  GetRoomByLocationResType,
  UploadResType,
} from "@/schemaValidations/room.schema";

const roomApiRequest = {
  NextClientToServerGetListRoom: () =>
    http.get<RoomListResType>(`/api/phong-thue`),
  NextClinetToServerAddRoom: (body: CreateRoomBodyType) => {
    const token = {
      token: `${localStorage.getItem("userToken") || ""}`,
    };
    return http.post<CreateRoomBodyResType>(`/api/phong-thue`, body, {
      headers: token,
    });
  },
  NextClientToServerGetRoom: (id: number) =>
    http.get<GetRoomByIdResType>(`/api/phong-thue/${id}`),
  NextClientToServerGetRoomByLocation: (maViTri: number) =>
    http.get<GetRoomByLocationResType>(
      `/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${maViTri}`
    ),
  NextClientToServerUpdateRoom: ({id,...body}:RoomType) => {
    const token = {
      token: `${localStorage.getItem("userToken") || ""}`,
    };
    return http.put<CreateRoomBodyResType>(`/api/phong-thue/${id}`, body, {
      headers: token,
    });
  },
  NextClientToServerDeleteRoom: (id: number) => {
    const token = {
      token: `${localStorage.getItem("userToken") || ""}`,
    };
    return http.delete<DeleteRoomBodyResType>(`/api/phong-thue/${id}`, {
      headers: token,
    });
  },
  NextClientToServerUploadPhoto: (maPhong: number, formFile: FormData) => {
    const token = {
      token: `${localStorage.getItem("userToken") || ""}`,
    };
    return http.post<UploadResType>(
      `/api/phong-thue/upload-hinh-phong?maPhong=${maPhong}`,
      formFile,
      {
        headers: token,
      }
    );
  },
};

export default roomApiRequest;
