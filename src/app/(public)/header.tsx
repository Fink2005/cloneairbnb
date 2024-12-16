import QuickSearch from "@/app/(public)/(QuickSearch)/QuickSearch";
import Logo from "@/app/(public)/Logo";
import MenuDropDown from "@/app/(public)/MenuDropDown";
import DarkModeToggle from "@/components/dark-mode-toggle";
import React from "react";

export default function Header() {
  return (
    <header
      className={`sticky top-0 flex justify-between items-center p-4  bg-white dark:bg-black z-20  shadow-lg px-10`}
    >
      <Logo />

      <div className="focus:bg-black ">
        <QuickSearch />
      </div>

      <div className="flex items-center space-x-3">
        <MenuDropDown />
        <DarkModeToggle />
      </div>
    </header>
  );
}
