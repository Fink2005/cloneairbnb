import http from "@/lib/http";
import { CreateLocationBodyResType, CreateLocationBodyType, DeleteLocationBodyResType, GetLocationByIdResType, LocationListResType, LocationType, UploadResType } from "@/schemaValidations/location.schema";


const locationApiRequest = {
  NextClientToServerGetListLocation: () =>
    http.get<LocationListResType>(`/api/vi-tri`),
  NextClientToServerAddLocation: (body: CreateLocationBodyType) => {
    const token = {
      token: `${localStorage.getItem("userToken") || ""}`,
    };
    return http.post<CreateLocationBodyResType>(`/api/vi-tri`, body, {
      headers: token,
    });
  },
  NextClientToServerGetLocation: (id: number) =>
    http.get<GetLocationByIdResType>(`/api/vi-tri/${id}`),
  NextClientToServerUpdateLocation: ({id,...body}:LocationType) => {
    const token = {
      token: `${localStorage.getItem("userToken") || ""}`,
    };
    return http.put<CreateLocationBodyResType>(`/api/vi-tri/${id}`, body, {
      headers: token,
    });
  },
  NextClientToServerDeleteLocation: (id: number) => {
    const token = {
      token: `${localStorage.getItem("userToken") || ""}`,
    };
    return http.delete<DeleteLocationBodyResType>(`/api/vi-tri/${id}`, {
      headers: token,
    });
  },
  NextClientToServerUploadPhoto: (maViTri: number, formFile: FormData) => {
    const token = {
      token: `${localStorage.getItem("userToken") || ""}`,
    };
    return http.post<UploadResType>(
      `/api/vi-tri/upload-hinh-vitri?maViTri=${maViTri}`,
      formFile,
      {
        headers: token,
      }
    );
  },
};

export default locationApiRequest;
