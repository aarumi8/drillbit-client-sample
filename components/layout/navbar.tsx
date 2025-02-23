"use client";
import React from "react";
import { ChevronsDown } from "lucide-react";
import { ToggleTheme } from "./toogle-theme";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center">
        <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
        Drillbit Find
      </Link>

      <div className="flex">
        <ToggleTheme />
      </div>
    </header>
  );
};