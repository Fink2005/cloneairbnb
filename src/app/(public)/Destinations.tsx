import Image from "next/image";
import React from "react";
interface desType {
  city: string;
  time: string;
  image: string;
}
export default function Destinations() {
  let destinationData: desType[] = [
    {
      city: "Hồ Chí Minh",
      time: "15 phút lái xe",
      image: "/assets/Destinations/HCM.jpg",
    },
    {
      city: "Cần Thơ",
      time: "3 giờ lái xe",
      image: "/assets/Destinations/CanTho.jpg",
    },
    {
      city: "Nha Trang",
      time: "6.5 giờ lái xe",
      image: "/assets/Destinations/NhaTrang.jpg",
    },
    {
      city: "Hà Nội",
      time: "15 phút lái xe",
      image: "/assets/Destinations/HaNoi.jpg",
    },
    {
      city: "Phú Quốc",
      time: "7.5 giờ lái xe",
      image: "/assets/Destinations/PhuQuoc.jpg",
    },
    {
      city: "Đà Nẵng",
      time: "45 phút lái xe",
      image: "/assets/Destinations/DaNang.jpg",
    },
    {
      city: "Đà Lạt",
      time: "30 phút lái xe",
      image: "/assets/Destinations/DaLat.jpg",
    },
    {
      city: "Phan Thiết",
      time: "5 giờ lái xe",
      image: "/assets/Destinations/PhanThiet.jpg",
    },
  ];
  let renderDestination = () => {
    return destinationData.map((item, index) => {
      return (
        <div
          key={index}
          className="flex space-x-2 items-center p-5 rounded-lg hover:scale-110 hover:bg-gray-200 transition cursor-pointer duration-300 border-2"
        >
          <div className="h-16 w-16 rounded-lg overflow-hidden">
            <Image
              width={50}
              height={50}
              className=" h-full w-full object-fill"
              src={item.image}
              alt="destination"
            />
          </div>
          <div>
            <p className="text-lg font-bold">{item.city}</p>
            <p className="text-md text-gray-400">{item.time}</p>
          </div>
        </div>
      );
    });
  };
  return (
    <div className="grid grid-cols-4 gap-5">{/* {renderDestination()} */}1</div>
  );
}
