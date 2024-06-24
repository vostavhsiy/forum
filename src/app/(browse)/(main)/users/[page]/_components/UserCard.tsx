"use client";

import { User } from "@prisma/client";
import { FC, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "@/components/FollowButton";
import { Button } from "@/components/ui/button";
import { banUser, changeRole, unbanUser } from "@/actions/users.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createConversation } from "@/actions/chat.actions";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { LoaderLink } from "@/components/LoaderLink";
import { ImageWithFallback } from "@/components/FallbackImage";

interface Props {
  user: User;
  isFollow?: boolean;
  isAuth?: string;
  inAdminPanel?: boolean;
  isAdmin?: boolean;
  authUser?: User;
}

const UserCard: FC<Props> = ({
  user,
  isAuth,
  isFollow,
  isAdmin,
  inAdminPanel,
  authUser,
}) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const changeRoleHandler = () => {
    if (!inAdminPanel) return;
    startTransition(() => {
      changeRole(user.id, user.role === "editor" ? "user" : "editor").then(
        (res) => {
          if (res?.ok) {
            toast.success("Права изменены");
          } else {
            toast.error(res.error);
          }
        },
      );
    });
  };

  const changeBanHandler = () => {
    if (!inAdminPanel) return;
    if (user.banned) {
      startTransition(() => {
        unbanUser(user.id).then((res) => {
          if (res.ok) {
            toast.success(`${user.name} разбанен!`);
          } else {
            toast.error(res.error);
          }
        });
      });
    } else {
      startTransition(() => {
        banUser(user.id).then((res) => {
          if (res.ok) {
            toast.success(`${user.name} забанен!`);
          } else {
            toast.error(res.error);
          }
        });
      });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2",
        inAdminPanel && "flex-row justify-between",
      )}
    >
      <div className="flex items-center gap-4">
        <ImageWithFallback
          src={user.image || "/user.png"}
          alt={"user"}
          width={500}
          height={500}
          className="w-[100px] h-[100px] object-center object-cover rounded-full"
        />
        {inAdminPanel && (
          <LoaderLink
            className="flex flex-col gap-1"
            href={isAuth === user.id ? "/profile" : `/user/${user.id}`}
          >
            <h3 className="font-semibold">{user.name}</h3>
            <h4 className="text-sm">{user.email}</h4>
          </LoaderLink>
        )}
      </div>

      <div
        className={cn(
          "w-full flex flex-col items-center gap-3",
          inAdminPanel && "flex-row w-auto",
        )}
      >
        {!inAdminPanel && (
          <LoaderLink
            className="flex flex-col gap-1 items-center"
            href={isAuth === user.id ? "/profile" : `/user/${user.id}`}
          >
            <h3 className="font-semibold">{user.name}</h3>
            <h4 className="text-sm">{user.email}</h4>
          </LoaderLink>
        )}
        <div className="flex items-center gap-3">
          {isAuth && (
            <FollowButton
              user={user}
              isFollow={isFollow}
              isAuth={isAuth}
              authUser={authUser}
            />
          )}
          {isAuth && !user.banned && (
            <Button
              onClick={() => {
                startTransition(() => {
                  createConversation({ userId: user.id }).then((res) => {
                    if (res.ok) {
                      router.push(`/messenger/${res.id}`);
                    } else {
                      toast.error("Нельзя вести диалог с этим пользователем!");
                    }
                  });
                });
              }}
            >
              <MessageCircle />
            </Button>
          )}
        </div>

        {inAdminPanel && user.role !== "admin" && (
          <Button
            onClick={changeRoleHandler}
            disabled={isPending || user.banned}
          >
            {user.role === "editor" ? "Лишить прав" : "Дать права"}
          </Button>
        )}
        {inAdminPanel && isAdmin && user.role !== "admin" && (
          <Button disabled={isPending} onClick={changeBanHandler}>
            {user.banned ? "Разбанить" : "Забанить"}
          </Button>
        )}
      </div>
    </div>
  );
};

export { UserCard };
