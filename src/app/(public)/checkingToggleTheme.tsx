"use client";
import ListRoom from "@/app/(public)/(ListRoom)/ListRoom";
import { Calendar } from "@/components/ui/calendar";
import { useTheme } from "next-themes";
import React from "react";

export default function CheckingToggleTheme() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { theme } = useTheme();
  return <div></div>;
}
