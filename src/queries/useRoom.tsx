import roomApiRequest from '@/apiRequests/room';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {CreateRoomBodyResType, CreateRoomBodyType, RoomType} from '@/schemaValidations/room.schema';
import userApiRequest from '@/apiRequests/user';
import {UserUpdateBodyType} from '@/schemaValidations/user.schema';

export const useGetRoomList = () => {
    return useQuery({
        queryKey: ['room-list'],
        queryFn: roomApiRequest.NextClientToServerGetListRoom
    })
}

export const useAddRoomMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body:CreateRoomBodyType) => roomApiRequest.NextClinetToServerAddRoom(body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['room-list']
            })
        }
    })
}

export const useUploadMediaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({maPhong, formFile}:{maPhong:number, formFile:FormData}) => roomApiRequest.NextClientToServerUploadPhoto(maPhong,formFile),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['room-list']
            })
        }
    })
}

export const useGetRoom = ({id,enabled}:{id:number,enabled:boolean}) => {
    return useQuery({
        queryKey: ['get-room',id],
        queryFn: () => roomApiRequest.NextClientToServerGetRoom(id),
        enabled
    })
}

export const useUpdateRoomMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body:RoomType) => roomApiRequest.NextClientToServerUpdateRoom(body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['room-list']
            })
        }
    })
}

export const useDeleteRoomMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => roomApiRequest.NextClientToServerDeleteRoom(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['room-list']
            })
        }
    })
}