import React from "react";
import Link from "next/link";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { SearchInput } from "@/components/Header/SearchInput";
import { Notification } from "@prisma/client";
import { MobileMenu } from "@/components/Header/MobileMenu";
import { LoaderLink } from "@/components/LoaderLink";

export const nav = [
  {
    label: "Блог",
    link: "/blog",
  },
  {
    label: "Пользователи",
    link: "/users/1",
  },
  {
    label: "Мессенджер",
    link: "/messenger",
    auth: true,
  },
  {
    label: "Теги",
    link: "/tags/1",
  },
];

export const Nav = ({
  isAuth,
  messageNots,
}: {
  isAuth?: boolean;
  messageNots?: Notification[];
}) => {
  return (
    <>
      <nav className="relative hidden lg:flex items-center gap-10 ">
        <SearchInput />
        <ThemeToggleButton />
        {nav.map(({ label, link, auth }) => {
          if (auth && !isAuth) return null;
          return (
            <LoaderLink
              key={link}
              href={link}
              className="relative text-sm font-semibold transition-all hover:text-destructive"
            >
              {label}
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
      </nav>
      <MobileMenu isAuth={isAuth} messageNots={messageNots} />
    </>
  );
};
