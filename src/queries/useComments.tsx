import commentsRequest from "@/apiRequests/comments";
import { useQuery } from "@tanstack/react-query";

export const useGetComments = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["get-comments-uers", id],
    queryFn: () => commentsRequest.NextClientToServerGetComments(id),
  });
};
