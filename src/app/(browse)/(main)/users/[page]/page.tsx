import { NextPage } from "next";
import { prisma } from "@/lib/prisma";
import { UserCard } from "@/app/(browse)/(main)/users/[page]/_components/UserCard";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { Pagination } from "@/components/Pagination";
import { auth } from "@/actions/auth.actions";
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

const UsersPage: NextPage<Props> = async ({ params, searchParams }) => {
  const authUser = await auth();
  const page = params.page ? +params.page - 1 : 0;
  const size = +(searchParams.size || 8);

  const { users, total } = await getUsers(page, searchParams.search, size);

  if (!users) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-5 ">
      <h1 className="text-lg font-semibold">Пользователи</h1>
      {!!users.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {users.map((user) => {
            const isFollow = !!user.subscribers.find(
              (u) => u.subscriberId === authUser?.id,
            );
            return (
              <UserCard
                key={user.id}
                user={user}
                isAuth={authUser?.id}
                isFollow={isFollow}
                authUser={authUser as any}
              />
            );
          })}
        </div>
      ) : (
        <h2 className="text-destructive">Пока пусто!</h2>
      )}
      <Pagination
        page={page + 1}
        size={size}
        total={total}
        baseLink={"/users"}
      />
    </div>
  );
};

export default UsersPage;
