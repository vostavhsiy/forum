import React from "react";
import { SearchInput } from "@/components/Header/SearchInput";
import { Notification } from "@prisma/client";
import { MobileMenu } from "@/components/Header/MobileMenu";
import { LoaderLink } from "@/components/LoaderLink";
import { cn } from "@/lib/utils";
import styles from "./header.module.scss";

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
      <nav className="relative hidden lg:flex items-center gap-2">
        {nav.map(({ label, link, auth }) => {
          if (auth && !isAuth) return null;
          return (
            <div
              key={link}
              className={cn("px-4 transition-all", styles.link_wrapper)}
            >
              <LoaderLink
                href={link}
                className={cn("relative text-sm font-semibold ", styles.link)}
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
            </div>
          );
        })}
        <SearchInput />
      </nav>
      <MobileMenu isAuth={isAuth} messageNots={messageNots} />
    </>
  );
};
