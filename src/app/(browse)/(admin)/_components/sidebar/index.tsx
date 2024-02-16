import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { LoaderLink } from "@/components/LoaderLink";

const Sidebar = async () => {
  const session = await getServerSession(authConfig);

  return (
    <div className="w-full border-r-2">
      <nav className="flex flex-col gap-6 p-4 text-sm font-semibold">
        <LoaderLink
          href={"/admin/reports/1"}
          className={"transition-all hover:text-destructive"}
        >
          Жалобы
        </LoaderLink>
        <LoaderLink
          href={"/admin/posts/1"}
          className={"transition-all hover:text-destructive"}
        >
          Посты
        </LoaderLink>
        <LoaderLink
          href={"/admin/users/1"}
          className={"transition-all hover:text-destructive"}
        >
          Пользователи
        </LoaderLink>
        <LoaderLink
          href={"/admin/tags/1"}
          className={"transition-all hover:text-destructive"}
        >
          Теги
        </LoaderLink>
      </nav>
    </div>
  );
};

export { Sidebar };
