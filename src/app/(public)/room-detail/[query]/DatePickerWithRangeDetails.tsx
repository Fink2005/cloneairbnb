"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { DateBefore, DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { vi } from "date-fns/locale";
import { useStore } from "@/store/store";

export function DatePickerWithRangeDetails({
  className,
  setDateSubmit,
  setDifferenceDays,
}: React.HTMLAttributes<HTMLDivElement> | any) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  let { NextStep, setDataCalendar, dataCalendar } = useStore();
  const [active, setActive] = React.useState(false);
  const [click, setClick] = React.useState<string | null>(null);
  const matcher: DateBefore = { before: new Date() };
  let handleDate = (date: DateRange | undefined) => {
    if (date?.from && date?.to) {
      let checkin = new Date(date.from);
      let checkout = new Date(date.to);
      const differenceInTime = checkout.getTime() - checkin.getTime();
      const differenceIndays = differenceInTime / (1000 * 3600 * 24);
      setDifferenceDays(differenceIndays);
    }

    setDate(date);

    setDateSubmit(date);
  };
  React.useEffect(() => {
    if (dataCalendar?.from && dataCalendar?.to) {
      setDate(dataCalendar);
      setDateSubmit(dataCalendar);
    }
  }, [dataCalendar, setDateSubmit]);
  function useOutsideAlerter(ref: any, ref2: any) {
    React.useEffect(() => {
      function handleClickOutside(event: any) {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          ref2.current &&
          !ref2.current.contains(event.target)
        ) {
          setActive(false);
          setClick(null);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, ref2]);
  }

  let handleClick = (id: string) => {
    if (id === click) {
      setActive(false);
      setClick(null);
    } else {
      setActive(true);
      setClick(id);
    }
  };
  const wrapperRef = React.useRef(null);
  const wrapperRef2 = React.useRef(null);
  useOutsideAlerter(wrapperRef, wrapperRef2);
  return (
    <div
      className={cn(
        `cursor-pointer 
s        flex   items-center`,
        className
      )}
    >
      <Popover open={active}>
        <PopoverTrigger asChild>
          <div className="w-full h-full flex group  " ref={wrapperRef}>
            <div className={`w-1/2 border-r    h-full`}>
              <Button
                onClick={() => {
                  handleClick("button1");
                }}
                id="date1"
                variant={"ghost"}
                className={cn(
                  `    
            
            
             text-left w-full h-full  `
                )}
              >
                {dataCalendar?.from ? (
                  <div className="w-full flex-col items-center flex">
                    <div className="w-full">
                      <p className="font-semibold text-xs">Nhận phòng</p>
                      <p className="text-md">
                        {date?.from
                          ? format(date.from, "dd MMM", { locale: vi })
                          : format(dataCalendar.from, "dd MMM", { locale: vi })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex-col items-center flex">
                    <div className="w-full">
                      <p className="font-semibold text-xs">Nhận phòng</p>
                      <p className="text-gray-400 font-light text-md">
                        {date?.from
                          ? format(date.from, "dd MMM", { locale: vi })
                          : "Thêm ngày"}
                      </p>
                    </div>
                  </div>
                )}
              </Button>
            </div>
            <div className="w-1/2 h-full">
              {" "}
              <Button
                onClick={() => {
                  handleClick("button2");
                }}
                variant={"ghost"}
                id="date2"
                className={cn(
                  `group w-full h-full text-left   

   `
                )}
              >
                {dataCalendar?.to ? (
                  <div className="w-full  flex-col items-center flex">
                    <div className="w-full">
                      {" "}
                      <p className="font-semibold text-xs">Trả phòng</p>
                      <div className="text-md">
                        {date?.to
                          ? format(date.to, "dd MMM", { locale: vi })
                          : format(dataCalendar.to, "dd MMM", { locale: vi })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex-col items-center flex">
                    <div className="w-full">
                      <p className="font-semibold text-xs">Trả phòng</p>
                      <p className="text-gray-400 font-light text-md">
                        {date?.to
                          ? format(date.to, "dd MMM", { locale: vi })
                          : "Thêm ngày"}
                      </p>
                    </div>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className=" rounded-2xl w-auto"
          align="center"
          side="bottom"
          ref={wrapperRef2}
        >
          <div className="flex justify-center">
            <Calendar
              id="DatePicker"
              locale={vi}
              disabled={matcher}
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDate}
              numberOfMonths={2}
              captionLayout="dropdown"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
