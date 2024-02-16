import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CreatePostForm } from "@/app/(browse)/(profile)/profile/_components/CreatePostForm";
import { PostCard } from "@/app/(browse)/(profile)/profile/_components/PostCard";
import Link from "next/link";
import { FollowButton } from "@/components/FollowButton";
import { getUserById } from "@/services/users.service";
import { auth } from "@/actions/auth.actions";
import { LoaderLink } from "@/components/LoaderLink";

export default async function ProfilePage() {
  const session = await getServerSession(authConfig);
  if (!session) {
    return redirect("/blog");
  }
  const user = await getUserById(session.user.id);
  if (!user) redirect("/blog");
  const tags = await prisma.tag.findMany();

  return (
    <div className="flex flex-col gap-10 mb-[100px]">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <Image
          src={user.image || "/user.png"}
          alt={"user"}
          width={500}
          height={500}
          className="w-[200px] h-[200px] object-center object-cover rounded-2xl"
        />
        <div className="flex flex-col items-center lg:items-start gap-4">
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <h3 className="text-xl text-zinc-600">{user.email}</h3>
          <CreatePostForm tags={tags} />
        </div>
      </div>
      <div className="w-full flex flex-col lg:flex-row items-start gap-10">
        <div className="flex flex-col gap-5  w-full lg:w-1/2 p-4 bg-primary-foreground rounded-2xl">
          <LoaderLink
            href={"/profile/subscribes"}
            className="font-semibold text-lg hover:underline flex items-center gap-2"
          >
            <span>Подписки</span>
            {!!user.subscribes.length && (
              <span className="text-sm font-medium text-zinc-600">
                {user.subscribes.length}
              </span>
            )}
          </LoaderLink>
          {!!user.subscribes.length ? (
            <div className="flex flex-col gap-3">
              {user.subscribes.slice(0, 3).map(({ subscribed: sub }) => {
                return (
                  <div
                    key={sub.id}
                    className="flex justify-between items-center"
                  >
                    <LoaderLink
                      href={`/user/${sub.id}`}
                      className="flex items-center gap-5"
                    >
                      <Image
                        src={sub.image || "/user.png"}
                        alt={"user"}
                        width={500}
                        height={500}
                        className="w-[60px] h-[60px] object-cover object-center rounded-full border-2"
                      />
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-semibold">{sub.name}</h3>
                        <h3 className="text-sm text-zinc-600">{sub.email}</h3>
                      </div>
                    </LoaderLink>
                    <FollowButton
                      user={sub}
                      isFollow={true}
                      isAuth={user.id}
                      authUser={user}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <LoaderLink
              href={"/users/1"}
              className={"text-destructive hover:underline"}
            >
              Найти интересных авторов
            </LoaderLink>
          )}
        </div>
        <div className="flex flex-col gap-5 w-full lg:w-1/2 p-4 bg-primary-foreground rounded-2xl">
          <LoaderLink
            href={"/profile/subscribers"}
            className="font-semibold text-lg hover:underline flex items-center gap-2"
          >
            <span>Подписчики</span>
            {!!user.subscribers.length && (
              <span className="text-sm font-medium text-zinc-600">
                {user.subscribers.length}
              </span>
            )}
          </LoaderLink>
          {!!user.subscribers.length ? (
            <div className="flex flex-col gap-3">
              {user.subscribers.slice(0, 3).map(({ subscriber: sub }) => {
                return (
                  <div
                    key={sub.id}
                    className="flex justify-between items-center"
                  >
                    <LoaderLink
                      href={`/user/${sub.id}`}
                      className="flex items-center gap-5"
                    >
                      <Image
                        src={sub.image || "/user.png"}
                        alt={"user"}
                        width={500}
                        height={500}
                        className="w-[60px] h-[60px] object-cover object-center rounded-full border-2"
                      />
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-semibold">{sub.name}</h3>
                        <h3 className="text-sm text-zinc-600">{sub.email}</h3>
                      </div>
                    </LoaderLink>
                  </div>
                );
              })}
            </div>
          ) : (
            <h2 className={"text-destructive"}>Пока пусто!</h2>
          )}
        </div>
      </div>
    </div>
  );
}
