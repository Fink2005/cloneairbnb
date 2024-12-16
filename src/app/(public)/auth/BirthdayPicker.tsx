"use client";

import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { vi } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BirthdayPicker({ field }: any) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [active, setActive] = React.useState(false);

  const startYear = getYear(new Date()) - 100;
  const endYear = getYear(new Date());

  const months: string[] = [
    "Tháng Một",
    "Tháng Hai",
    "Tháng Ba",
    "Tháng Tư",
    "Tháng Năm",
    "Tháng Sáu",
    "Tháng Bảy",
    "Tháng Tám",
    "Tháng Chín",
    "Tháng Mười",
    "Tháng Mười Một",
    "Tháng Mười Hai",
  ];

  // Handle the date selection
  const handleSelect = (selectedData: Date | undefined) => {
    if (selectedData) {
      setDate(selectedData);
      setActive(true);
      field.onChange(selectedData); // Pass selected date back to react-hook-form
    }
  };

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date!, months.indexOf(month));
    setDate(newDate);
    field.onChange(newDate); // Update react-hook-form with new month value
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(date!, parseInt(year));
    setDate(newDate);
    field.onChange(newDate); // Update react-hook-form with new year value
  };

  const NewYears = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );
  const years = NewYears.toReversed();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-star bg-transparent text-left font-normal flex justify-start"
          )}
        >
          <CalendarIcon />
          {active ? (
            format(date!, "dd/MM/yyyy", { locale: vi })
          ) : (
            <span>Chọn sinh nhật</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <div className="flex justify-between px-4 pt-4">
          <Select
            onValueChange={handleMonthChange}
            value={active ? months[getMonth(date!)] : ""} // Ensure month is a string value (month name)
          >
            <SelectTrigger className="w-[140px] p-2">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month: string) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleYearChange}
            value={active ? getYear(date!).toString() : ""} // Ensure year is a string value
          >
            <SelectTrigger className="w-[140px] p-2">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year: number) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          required
          locale={vi}
          mode="single"
          selected={date}
          month={date}
          onMonthChange={setDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
