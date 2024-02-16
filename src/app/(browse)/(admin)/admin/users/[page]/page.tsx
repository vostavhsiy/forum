import React from "react";
import { prisma } from "@/lib/prisma";
import { NextPage } from "next";
import { UserCard } from "@/app/(browse)/(main)/users/[page]/_components/UserCard";
import { Pagination } from "@/components/Pagination";
import { auth } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { getUsers } from "@/services/users.service";

interface Props {
  params: {
    page: string;
  };
  searchParams: {
    search: string;
    size: string;
  };
}

const AdminUsersPage: NextPage<Props> = async ({ params, searchParams }) => {
  const user = await auth();

  const page = params.page ? +params.page - 1 : 0;
  const size = +(searchParams.size || 8);

  const { users, total } = await getUsers(page, searchParams.search, size);

  if (!users.length && page > 0) {
    return redirect(
      `/admin/users/${page}?${searchParams.search ? `search=${searchParams.search}` : ""}`,
    );
  }

  const searchHandler = async (data: FormData) => {
    "use server";
    const search = data.get("search");
    if (!search) return redirect(`/admin/users/1`);
    return redirect(`/admin/users/1?search=${search}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-semibold">Пользователи</h1>
      <form action={searchHandler} className="flex items-center gap-2 w-1/2">
        <Input name={"search"} placeholder={"Поиск"} />
        <Button type={"submit"}>
          <Search />
        </Button>
      </form>
      {!!users.length ? (
        <>
          <div className="flex flex-col gap-5">
            {users.map((u) => {
              const isFollow = !!u.subscribers.find(
                (sub) => sub.subscriberId === user?.id,
              );
              return (
                <UserCard
                  key={u.id}
                  user={u}
                  isAuth={user?.id}
                  isFollow={isFollow}
                  inAdminPanel
                  isAdmin={user?.role === "admin"}
                  authUser={user as any}
                />
              );
            })}
          </div>
          <Pagination
            page={page + 1}
            size={size}
            total={total}
            baseLink={"admin/users"}
          />
        </>
      ) : (
        <h2 className="text-destructive">Пока пусто!</h2>
      )}
    </div>
  );
};

export default AdminUsersPage;
