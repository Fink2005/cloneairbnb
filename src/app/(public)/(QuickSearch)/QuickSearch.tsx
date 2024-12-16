import { CustomerPicker } from "@/app/(public)/(QuickSearch)/CustomerPicker";
import { DatePickerWithRange } from "@/app/(public)/(QuickSearch)/DatePickerWithRange";
import { PickDestination } from "@/app/(public)/(QuickSearch)/PickDestination";
import http from "@/lib/http";

interface Data {
  id: number;
  hinhAnh: string;
  quocGia: string;
  tenViTri: string;
  tinhThanh: string;
}
interface dataApi {
  data: Data[];
  keywords: null;
  pageIndex: number;
  pageSize: number;
  totalRow: number;
}
export interface destination {
  content: dataApi;
  dateTime?: string;
}

export default async function QuickSearch() {
  const data: destination = await http.get(
    "/api/vi-tri/phan-trang-tim-kiem?pageIndex=1&pageSize=8"
  );
  return (
    <div
      className={`flex rounded-s-full rounded-e-full border shadow-md overflow-hidden   
     
      h-16`}
    >
      <PickDestination pickDataDestination={data} />
      <DatePickerWithRange />
      <CustomerPicker />
    </div>
  );
}
