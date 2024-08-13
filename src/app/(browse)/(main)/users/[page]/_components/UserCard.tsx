"use client";

import { Prisma, User } from "@prisma/client";
import { FC, useRef, useState, useTransition } from "react";
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

import { ImageWithFallback } from "@/components/FallbackImage";

import styles from "../styles.module.scss";
import { ends } from "@/lib/word-ends";

interface Props {
  user: Prisma.UserGetPayload<{
    include: {
      subscribers: true;
      subscribes: true;
    };
  }>;
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

  const mouseOutHandler = () => {};

  return (
    <div
      className={cn(
        "relative flex items-center gap-4",
        inAdminPanel && "flex-row justify-between",
      )}
    >
      <div className={cn("flex items-center gap-4", styles.image)}>
        <ImageWithFallback
          src={user.image || "/user.png"}
          alt={"user"}
          width={500}
          height={500}
          className={cn(
            "w-[50px] aspect-square object-center object-cover rounded-lg",
          )}
        />
        {!inAdminPanel && (
          <div
            className={cn(
              "absolute z-[1] -top-2 -left-2 p-2 rounded bg-primary text-background",
              styles.card,
            )}
          >
            <div className={cn("flex items-start gap-4")}>
              <div className="flex items-center gap-4">
                <Link
                  href={isAuth === user.id ? "/profile" : `/user/${user.id}`}
                >
                  <ImageWithFallback
                    src={user.image || "/user.png"}
                    alt={"user"}
                    width={500}
                    height={500}
                    className={cn(
                      "w-[60px] aspect-square object-center object-cover rounded-lg",
                      styles.image,
                    )}
                  />
                </Link>
              </div>

              <div className={cn("flex flex-col gap-3")}>
                <Link
                  className="flex flex-col gap-1"
                  href={isAuth === user.id ? "/profile" : `/user/${user.id}`}
                >
                  <h3 className="text-sm font-semibold max-w-[175px] overflow-hidden">
                    {user.name}
                  </h3>
                  <h4 className="text-[12px] max-w-[175px] overflow-hidden">
                    {user.subscribes.length}{" "}
                    {ends(user.subscribes.length, [
                      "подписка",
                      "подписки",
                      "подписок",
                    ])}
                  </h4>
                  <h4 className="text-[12px] max-w-[175px] overflow-hidden">
                    {user.subscribers.length}{" "}
                    {ends(user.subscribers.length, [
                      "подписчик",
                      "подписчика",
                      "подписчиков",
                    ])}
                  </h4>
                </Link>
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
                      size={"icon"}
                      onClick={() => {
                        startTransition(() => {
                          createConversation({ userId: user.id }).then(
                            (res) => {
                              if (res.ok) {
                                router.push(`/messenger/${res.id}`);
                              } else {
                                toast.error(
                                  "Нельзя вести диалог с этим пользователем!",
                                );
                              }
                            },
                          );
                        });
                      }}
                    >
                      <MessageCircle />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {inAdminPanel && (
          <Link
            className="flex flex-col gap-1"
            href={isAuth === user.id ? "/profile" : `/user/${user.id}`}
          >
            <h3 className="font-semibold">{user.name}</h3>
            <h4 className="text-sm">{user.email}</h4>
          </Link>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col items-center gap-3",
          inAdminPanel && "flex-row w-auto",
        )}
      >
        {!inAdminPanel && (
          <Link
            className="flex flex-col gap-1"
            href={isAuth === user.id ? "/profile" : `/user/${user.id}`}
          >
            <h3 className="text-sm font-semibold max-w-[175px] overflow-hidden">
              {user.name}
            </h3>
            <h4 className="text-[12px] max-w-[175px] overflow-hidden">
              {user.email}
            </h4>
          </Link>
        )}

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
