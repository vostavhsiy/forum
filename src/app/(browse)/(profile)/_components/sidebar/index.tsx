import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";

const Sidebar = async () => {
  return (
    <div className="w-full border-r-2">
      <nav className="flex h-screen w-screen lg:w-full overflow-auto lg:flex-col gap-6 p-4 pt-20 text-sm font-semibold">
        <Link
          href={"/profile"}
          className={"transition-all hover:text-destructive"}
        >
          Основное
        </Link>
        <Link
          href={"/profile/posts"}
          className={"transition-all hover:text-destructive"}
        >
          Посты
        </Link>
        <Link
          href={"/profile/favourites"}
          className={"transition-all hover:text-destructive"}
        >
          Понравившееся
        </Link>
        <Link
          href={"/profile/edit"}
          className={"transition-all hover:text-destructive"}
        >
          Редактировать
        </Link>
        <Link
          href={"/profile/subscribes"}
          className={"transition-all hover:text-destructive"}
        >
          Подписки
        </Link>
        <Link
          href={"/profile/subscribers"}
          className={"transition-all hover:text-destructive"}
        >
          Подписчики
        </Link>
      </nav>
    </div>
  );
};

export { Sidebar };
