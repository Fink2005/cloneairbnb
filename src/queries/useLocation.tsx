import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import locationApiRequest from '@/apiRequests/location';
import { CreateLocationBodyType, LocationType } from '@/schemaValidations/location.schema';

export const useGetLocationList = () => {
    return useQuery({
        queryKey: ['location-list'],
        queryFn: locationApiRequest.NextClientToServerGetListLocation
    })
}

export const useAddLocationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body:CreateLocationBodyType) => locationApiRequest.NextClientToServerAddLocation(body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['location-list']
            })
        }
    })
}

export const useUploadMediaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({maViTri, formFile}:{maViTri:number, formFile:FormData}) => locationApiRequest.NextClientToServerUploadPhoto(maViTri,formFile),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['location-list']
            })
        }
    })
}

export const useGetLocation = ({id,enabled}:{id:number,enabled:boolean}) => {
    return useQuery({
        queryKey: ['get-location',id],
        queryFn: () => locationApiRequest.NextClientToServerGetLocation(id),
        enabled
    })
}

export const useUpdateLocationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body:LocationType) => locationApiRequest.NextClientToServerUpdateLocation(body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['location-list']
            })
        }
    })
}

export const useDeleteLocationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => locationApiRequest.NextClientToServerDeleteLocation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['location-list']
            })
        }
    })
}