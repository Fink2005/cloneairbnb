import userApiRequest from "@/apiRequests/user"
// import { UserUpdateBodyType } from "@/schemaValidations/user.schema";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {UserUpdateBodyType, CreateUserBodyType, CreateUserBody} from '@/schemaValidations/user.schema';



export const useUserProfile = (id:number, handleFetch: boolean) => {
    return useQuery({
        queryKey: ['user',id],
        queryFn: () => userApiRequest.NextClientToServerGetUser(id),
        enabled: handleFetch && id !== 0
    })
}

// export const useUserUpdateProfile = (id:number,body:UserUpdateBodyType) => {
//     return useMutation({
//         mutationFn: (id,body) => userApiRequest.NextClientToServerUserUpdateProfile(id,body),
//     })
// }

export const useGetUserList = () => {
    return useQuery({
        queryKey: ['user-list'],
        queryFn: userApiRequest.NextClientToServerGetListUser
    })
}
export const useGetUser = ({id,enabled}:{id:number,enabled:boolean}) => {
    return useQuery({
        queryKey: ['get-user',id],
        queryFn: () => userApiRequest.NextClientToServerGetUser(id),
        enabled
    })
}

export const useAddUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body:CreateUserBodyType) => userApiRequest.NextClientToServerAddUser(body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user-list']
            })
        }
    })
}

export const useUpdateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, ...body}: UserUpdateBodyType & {id:number}) => userApiRequest.NextClientToServerUserUpdateProfile(id,body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user-list']
            })
        }
    })
}

export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => userApiRequest.NextClientToServerDeleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user-list']
            })
        }
    })
}





