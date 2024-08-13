"use client";

import React, { FC, useTransition } from "react";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { follow, unfollow } from "@/actions/users.actions";
import { socket } from "@/components/Notifications";
import { toast } from "sonner";
import { UserMinus, UserPlus } from "lucide-react";

interface Props {
  user: User;
  isFollow?: boolean;
  isAuth?: string;
  authUser?: User;
}

const FollowButton: FC<Props> = ({ user, isAuth, isFollow, authUser }) => {
  const [isPending, startTransition] = useTransition();

  const submitHandler = () => {
    if (!isAuth) return;

    if (isFollow) {
      startTransition(() => {
        unfollow(user.id).then((res) => {
          if (res.ok) {
            socket.send({
              data: `Вы отписались от ${user.name}!`,
              type: "specific",
              ids: [isAuth],
            });
            if (authUser) {
              socket.send({
                data: `${authUser.name} отписался от вас!`,
                type: "specific",
                ids: [user.id],
              });
            }
          } else {
            toast.error(res.error);
          }
        });
      });
    } else {
      startTransition(() => {
        follow(user.id).then((res) => {
          if (res.ok) {
            socket.send({
              data: `Вы подписались на ${user.name}!`,
              type: "specific",
              ids: [isAuth],
            });
            if (authUser) {
              socket.send({
                data: `${authUser.name} подписался на вас!`,
                type: "specific",
                ids: [user.id],
              });
            }
          } else {
            toast.error(res.error);
          }
        });
      });
    }
  };

  return (
    <Button
      size={"icon"}
      disabled={isPending || user.banned}
      onClick={submitHandler}
    >
      {/*{!isFollow ? "Подписаться" : "Отписаться"}*/}
      {!isFollow ? <UserPlus /> : <UserMinus />}
    </Button>
  );
};

export { FollowButton };
