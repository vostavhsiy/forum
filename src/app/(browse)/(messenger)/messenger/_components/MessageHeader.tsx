"use client";

import { Conversation, Message, User } from "@prisma/client";
import React, { FC } from "react";
import useOtherUser from "@/hooks/useOtherUser";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { LoaderLink } from "@/components/LoaderLink";
import { ImageWithFallback } from "@/components/FallbackImage";

interface Props {
  conversation: Conversation & {
    users: User[];
    messages: Array<
      Message & {
        sender: {
          id: string;
          name: string | null;
          email: string | null;
          password: string | null;
          emailVerified: Date | null;
          image: string | null;
          createdAt: Date;
          updatedAt: Date;
          role: string | null;
        };
        seen: {
          id: string;
          name: string | null;
          email: string | null;
          password: string | null;
          emailVerified: Date | null;
          image: string | null;
          createdAt: Date;
          updatedAt: Date;
          role: string | null;
        }[];
      }
    >;
  };
}

const MessagesHeader: FC<Props> = ({ conversation }) => {
  const session = useSession();
  const user = useOtherUser(conversation);

  if (!session.data?.user || session.data.user.id === user.id) {
    return <div className={"h-full border-b-2"}></div>;
  }

  return (
    <div className="w-full h-full flex items-center border-b-2 pb-2">
      <LoaderLink href={`/user/${user.id}`} className="flex items-center gap-6">
        <ImageWithFallback
          key={user.id}
          src={user.image || "/user.png"}
          alt={"user"}
          width={500}
          height={500}
          className="w-[50px] h-[50px] object-cover object-center rounded-full cursor-pointer"
        />
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">{user.name}</h3>
          <h4 className="text-sm">{user.email}</h4>
        </div>
      </LoaderLink>
    </div>
  );
};

export { MessagesHeader };
