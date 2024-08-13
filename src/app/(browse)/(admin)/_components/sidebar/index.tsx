import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";

const Sidebar = async () => {
  const session = await getServerSession(authConfig);

  return (
    <div className="w-full border-r-2">
      <nav className="h-screen flex flex-col gap-6 p-4 pt-20 text-sm font-semibold">
        <Link
          href={"/admin/reports/1"}
          className={"transition-all hover:text-destructive"}
        >
          Жалобы
        </Link>
        <Link
          href={"/admin/posts/1"}
          className={"transition-all hover:text-destructive"}
        >
          Посты
        </Link>
        <Link
          href={"/admin/users/1"}
          className={"transition-all hover:text-destructive"}
        >
          Пользователи
        </Link>
        <Link
          href={"/admin/tags/1"}
          className={"transition-all hover:text-destructive"}
        >
          Теги
        </Link>
      </nav>
    </div>
  );
};

export { Sidebar };
