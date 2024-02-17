import {
  getRecommendedPosts,
  getRecommendedUsers,
} from "@/actions/blog.actions";
import Link from "next/link";
import Image from "next/image";
import { PostCard } from "@/app/(browse)/(main)/_components/sidebar/PostCard";
import { getConversations } from "@/actions/chat.actions";
import { prisma } from "@/lib/prisma";
import { auth } from "@/actions/auth.actions";
import { SidebarUserCard } from "@/app/(browse)/(messenger)/messenger/_components/SidebarUserCard";
import { SidebarConversationCard } from "@/app/(browse)/(messenger)/messenger/_components/SidebarConversationCard";
import { getRecommendedUsersForChat } from "@/services/users.service";

const Sidebar = async () => {
  const conversations = await getConversations();
  const users = await getRecommendedUsersForChat();

  return (
    <div
      style={{
        height: "calc(100vh - 60px)",
      }}
      className="w-full border-r-2 flex flex-col py-2 px-4 items-start gap-10 pt-5 overflow-auto"
    >
      <div className="w-full h-[80px] overflow-x-auto overflow-y-hidden flex items-center gap-5 p-2 rounded-xl bg-secondary">
        {users?.map((u) => {
          return <SidebarUserCard user={u} key={u.id} />;
        })}
      </div>
      <div className="w-full flex flex-col gap-4 h-full overflow-hidden overflow-y-auto">
        {conversations.map((conversation) => {
          return (
            <SidebarConversationCard
              conversation={conversation}
              key={conversation.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export { Sidebar };
