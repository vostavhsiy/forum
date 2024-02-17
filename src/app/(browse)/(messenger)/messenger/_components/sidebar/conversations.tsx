"use client";

import React, { FC, useState } from "react";
import { Conversation, User } from "@prisma/client";
import { SidebarConversationCard } from "@/app/(browse)/(messenger)/messenger/_components/SidebarConversationCard";
import { Input } from "@/components/ui/input";

interface Props {
  conversations: Array<Conversation & { users: User[] }>;
}

const Conversations: FC<Props> = ({ conversations }) => {
  const [search, setSearch] = useState("");

  return (
    <div className="h-full flex flex-col gap-2">
      <Input
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        placeholder="Поиск по имени"
        className={"w-full h-[20px]"}
      />
      <div className="w-full flex flex-col gap-4 h-full overflow-hidden overflow-y-auto">
        {conversations
          .filter((conversation) =>
            conversation.users.some(
              (user) =>
                user.name?.includes(search) || user.email?.includes(search),
            ),
          )
          .map((conversation) => {
            return (
              <SidebarConversationCard
                conversation={conversation as any}
                key={conversation.id}
              />
            );
          })}
      </div>
    </div>
  );
};

export { Conversations };
