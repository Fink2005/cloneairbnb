import roomApiRequest from "@/apiRequests/room";
import Rooms from "@/app/(public)/rooms/Rooms";
import http from "@/lib/http";
import { Suspense } from "react";

interface typeContent {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maViTri: number;
  hinhAnh?: string;
}

export interface ListRoomProps {
  content: typeContent[];
  dateTime: string;
}

export default async function Page() {
  const data2: any = await http.get(
    "/api/vi-tri/phan-trang-tim-kiem?pageIndex=1&pageSize=8"
  );
  return (
    <>
      <Rooms data2={data2} />
    </>
  );
}
