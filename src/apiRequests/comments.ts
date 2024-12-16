import http from "@/lib/http";
import {
  commentsSchema,
  feedbackSchema,
} from "@/schemaValidations/comments.schema";
interface commentsProps {
  content: commentsSchema[];
}
const commentsRequest = {
  NextClientToServerGetComments: (id: any) =>
    http.get<commentsProps>(`/api/binh-luan/lay-binh-luan-theo-phong/${id}`),
};
export default commentsRequest;
