"use client";

import React, { FC, useMemo } from "react";
import { Conversation, Message, User, Notification } from "@prisma/client";
import useOtherUser from "@/hooks/useOtherUser";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { LoaderLink } from "@/components/LoaderLink";

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
    notifications: Array<
      Notification & {
        user: {
          id: string;
          name: string | null;
          email: string | null;
          password: string | null;
          emailVerified: Date | null;
          image: string | null;
          createdAt: Date;
          updatedAt: Date;
          banned: boolean;
          role: string;
        };
      }
    >;
  };
}

const SidebarConversationCard: FC<Props> = ({ conversation }) => {
  const pathname = usePathname();

  const session = useSession();
  const otherUser = useOtherUser(conversation);

  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];

    return messages[messages.length - 1];
  }, [conversation.messages]);

  const news = useMemo(() => {
    return conversation.notifications.filter(
      (not) => not.user.id === session.data?.user.id,
    );
  }, [conversation.notifications]);

  if (!session.data?.user || session.data.user.id === otherUser.id) {
    return null;
  }

  return (
    <LoaderLink
      href={`/messenger/${conversation.id}`}
      className={cn(
        "flex items-center gap-3 p-2 rounded-xl",
        pathname.includes(`/messenger/${conversation.id}`) &&
          "bg-destructive text-white",
      )}
    >
      <Image
        src={otherUser.image || "/user.png"}
        alt={"user"}
        width={500}
        height={500}
        className="w-[40px] h-[40px] object-cover object-center rounded-full border-2"
      />
      <div>
        <h3 className="font-semibold">{otherUser.name}</h3>
        {lastMessage && (
          <h4 className="text-[12px] max-w-full overflow-hidden text-nowrap flex items-center gap-1">
            {lastMessage.sender.id !== otherUser.id && (
              <span className={"font-semibold"}>Вы:</span>
            )}{" "}
            {lastMessage.body}{" "}
            {!!news.length && (
              <span
                className={
                  "w-[15px] h-[15px] flex items-center justify-center rounded-full bg-primary text-background text-[12px]"
                }
              >
                {news.length}
              </span>
            )}
          </h4>
        )}
      </div>
    </LoaderLink>
  );
};

export { SidebarConversationCard };
