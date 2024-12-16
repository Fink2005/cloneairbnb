import http from "@/lib/http";
import {
  BookingListResType,
  CreateBookingBodyType,
  CreateBookingBodyResType,
  GetBookingByIdResType,
  BookingType,
  DeleteBookingBodyResType,
  GetBookingByUserResType,
  CreateBookingDetailBodyType,
} from "@/schemaValidations/booking.schema";
import {
  CreateLocationBodyResType,
  DeleteLocationBodyResType,
  GetLocationByIdResType,
  LocationType,
  UploadResType,
} from "@/schemaValidations/location.schema";

const bookingApiRequest = {
  NextClientToServerGetListBooking: () =>
    http.get<BookingListResType>(`/api/dat-phong`),
  NextClientToServerAddBooking: (body: CreateBookingBodyType) =>
    http.post<CreateBookingBodyResType>(`/api/dat-phong`, body),
  NextClientToServerAddBookingDetail: (body: CreateBookingDetailBodyType) =>
    http.post<CreateBookingBodyResType>(`/api/dat-phong`, body),
  NextClientToServerGetBooking: (id: number) =>
    http.get<GetBookingByIdResType>(`/api/dat-phong/${id}`),
  NextClientToServerUpdateBooking: ({ id, ...body }: BookingType) =>
    http.put<CreateBookingBodyResType>(`/api/dat-phong/${id}`, body),
  NextClientToServerDeleteBooking: (id: number) =>
    http.delete<DeleteBookingBodyResType>(`/api/dat-phong/${id}`),
  NextClientToServerGetBookingByUser: (id: number) =>
    http.get<GetBookingByUserResType>(
      `/api/dat-phong/lay-theo-nguoi-dung/${id}`
    ),
};

export default bookingApiRequest;
