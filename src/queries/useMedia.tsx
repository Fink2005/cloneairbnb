import { mediaApiRequest } from "@/apiRequests/media";
import { UploadImageResType } from "@/schemaValidations/media.schema";
import { UploadAvatarResponseType } from "@/schemaValidations/user.schema";
import { useMutation } from "@tanstack/react-query";
import { File } from "buffer";

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: (file: any) => mediaApiRequest.upload(file),
    onSuccess: (data: any) => console.log(data, "ngu roi"),
  });
};
