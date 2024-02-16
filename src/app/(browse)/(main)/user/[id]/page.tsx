import { NextPage } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FollowButton } from "@/components/FollowButton";
import { Post } from "@/app/(browse)/(main)/blog/_components/post";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/actions/auth.actions";
import { getUserById } from "@/services/users.service";
import { Button } from "@/components/ui/button";
import { createConversation } from "@/actions/chat.actions";
import { MessageCircle } from "lucide-react";
import { MessageButton } from "@/app/(browse)/(main)/user/[id]/_components/MessageButton";
import { ends } from "@/lib/word-ends";

interface Props {
  params: {
    id: string;
  };
}

const UserPage: NextPage<Props> = async ({ params }) => {
  const authUser = await auth();

  const user = await getUserById(params.id);

  if (!user) {
    return redirect("/users/1");
  }

  if (user.id === authUser?.id) {
    return redirect("/profile");
  }

  return (
    <div className="flex flex-col gap-5 mb-[100px]">
      <div className="flex items-center gap-5 lg:gap-10">
        <Image
          src={user.image || "/user.png"}
          alt={"user"}
          width={500}
          height={500}
          className="w-[130px] h-[130px] lg:w-[200px] lg:h-[200px] object-center object-cover rounded-2xl"
        />
        <div className="flex flex-col items-start gap-2 lg:gap-4">
          <h2 className="text-lg lg:text-2xl font-semibold">{user.name}</h2>
          <h3 className="text-base lg:text-xl text-zinc-600">{user.email}</h3>
          <div className="flex items-center gap-3">
            {authUser && (
              <FollowButton
                user={user}
                isFollow={
                  !!user.subscribers.find(
                    ({ subscriberId }) => subscriberId === authUser?.id,
                  )
                }
                isAuth={authUser?.id}
                authUser={authUser as any}
              />
            )}
            {authUser && <MessageButton userId={user.id} />}
          </div>
        </div>
      </div>
      <div className="font-semibold">
        <span>
          {user.subscribers.length}{" "}
          {ends(user.subscribers.length, [
            "подписчик",
            "подписчика",
            "подписчиков",
          ])}
        </span>
        <Separator className="my-4" />
        <span>
          {user.subscribes.length}{" "}
          {ends(user.subscribers.length, ["подписка", "подписки", "подписок"])}
        </span>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <h1 className="text-lg font-semibold">Посты</h1>
        {!!user.posts.length ? (
          <div className="flex flex-col gap-6">
            {user.posts.map((post) => {
              return (
                <Post
                  key={post.id}
                  post={post}
                  auth={authUser?.id}
                  favourite={
                    !!authUser?.favourites.find((fav) => fav.id === post.id)
                  }
                />
              );
            })}
          </div>
        ) : (
          <h2 className={"text-destructive"}>Пока пусто</h2>
        )}
      </div>
    </div>
  );
};

export default UserPage;
