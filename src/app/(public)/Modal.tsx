import roomApiRequest from "@/apiRequests/room";
import { useGetRoomList } from "@/queries/useRoom";
import React, { useState, useRef, useEffect } from "react";

// Close modal if clicked outside
export default async function Modal() {
  let data = await roomApiRequest.NextClientToServerGetListRoom();
  console.log("dataNeBa", data);
  return <div>hi</div>;
}
