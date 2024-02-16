"use client";

import React, { useRef, useState } from "react";
import { SearchInput } from "@/components/Header/SearchInput";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import Link from "next/link";
import { nav } from "@/components/Header/nav";
import { Notification } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoaderLink } from "@/components/LoaderLink";

const MobileMenu = ({
  isAuth,
  messageNots,
}: {
  isAuth?: boolean;
  messageNots?: Notification[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex lg:hidden items-center gap-2">
      <Button
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        {open ? <X /> : <Menu />}
      </Button>
      <nav
        className={cn(
          "fixed z-40 bg-background w-full h-full flex flex-col items-center gap-8 pt-8 justify-start transition-all duration-500 -left-full top-[60px]",
          open && "left-0",
        )}
      >
        {nav.map(({ label, link, auth }) => {
          if (auth && !isAuth) return null;
          return (
            <LoaderLink
              key={link}
              href={link}
              className="relative text-lg font-semibold transition-all hover:text-destructive"
            >
              <span
                onClick={() => {
                  setOpen(false);
                }}
              >
                {label}
              </span>
              {link === "/messenger" && !!messageNots?.length && (
                <span
                  className={
                    "absolute top-0 right-0 -translate-y-2/3 translate-x-1/2 text-[12px]"
                  }
                >
                  {messageNots.length}
                </span>
              )}
            </LoaderLink>
          );
        })}
        <div className="flex items-center justify-center gap-2">
          <SearchInput />
          <ThemeToggleButton />
        </div>
      </nav>
    </div>
  );
};

export { MobileMenu };
