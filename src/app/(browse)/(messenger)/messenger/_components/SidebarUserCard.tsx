"use client";

import React, { FC, useTransition } from "react";
import Image from "next/image";
import { User } from "@prisma/client";
import { createConversation } from "@/actions/chat.actions";
import { useRouter } from "next/navigation";

interface Props {
  user: User;
}

const SidebarUserCard: FC<Props> = ({ user }) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const clickHandler = () => {
    if (!isPending) {
      startTransition(() => {
        createConversation({ userId: user.id }).then((value) => {
          if (value.ok) {
            router.push(`/messenger/${value.id}`);
          }
        });
      });
    }
  };

  return (
    <Image
      key={user.id}
      src={user.image || "/user.png"}
      alt={"user"}
      width={500}
      height={500}
      className="w-[40px] h-[40px] object-cover object-center rounded-full cursor-pointer"
      onClick={clickHandler}
    />
  );
};

export { SidebarUserCard };
