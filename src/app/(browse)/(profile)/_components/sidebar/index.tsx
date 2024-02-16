import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { LoaderLink } from "@/components/LoaderLink";

const Sidebar = async () => {
  //const session = await getServerSession(authConfig);

  return (
    <div className="w-full border-r-2">
      <nav className="flex w-screen lg:w-full overflow-auto lg:flex-col gap-6 p-4 text-sm font-semibold">
        <LoaderLink
          href={"/profile"}
          className={"transition-all hover:text-destructive"}
        >
          Основное
        </LoaderLink>
        <LoaderLink
          href={"/profile/posts"}
          className={"transition-all hover:text-destructive"}
        >
          Посты
        </LoaderLink>
        <LoaderLink
          href={"/profile/favourites"}
          className={"transition-all hover:text-destructive"}
        >
          Понравившееся
        </LoaderLink>
        <LoaderLink
          href={"/profile/edit"}
          className={"transition-all hover:text-destructive"}
        >
          Редактировать
        </LoaderLink>
        <LoaderLink
          href={"/profile/subscribes"}
          className={"transition-all hover:text-destructive"}
        >
          Подписки
        </LoaderLink>
        <LoaderLink
          href={"/profile/subscribers"}
          className={"transition-all hover:text-destructive"}
        >
          Подписчики
        </LoaderLink>
      </nav>
    </div>
  );
};

export { Sidebar };
