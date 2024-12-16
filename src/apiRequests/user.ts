import http from "@/lib/http"
import {GetUserResponseType, UserUpdateBodyType, UserUpdateResponseType, CreateUserResponseType, CreateUserBody, CreateUserBodyType, DeleteUserResponseType, UserListResType} from '@/schemaValidations/user.schema';

export const userApiRequest = {
    NextClientToServerGetUser: (id:number) => http.get<GetUserResponseType>(`/api/users/${id}`),
    NextClientToServerUserUpdateProfile: (id:number, body: UserUpdateBodyType) => http.put<UserUpdateResponseType>(`/api/users/${id}`,body),
    NextClientToServerGetListUser: () => http.get<UserListResType>(`/api/users`),
    NextClientToServerAddUser: (body:CreateUserBodyType) => http.post<CreateUserResponseType>(`/api/users`,body),
    NextClientToServerDeleteUser: (id:number) => http.delete<DeleteUserResponseType>(`/api/users?id=${id}`),
}

export default userApiRequest