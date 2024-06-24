import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FollowButton } from "@/components/FollowButton";
import { getUserWithSubscribers } from "@/services/users.service";
import { LoaderLink } from "@/components/LoaderLink";
import React from "react";
import { ImageWithFallback } from "@/components/FallbackImage";

const ProfileSubscribersPage = async () => {
  const session = await getServerSession(authConfig);
  if (!session) {
    redirect("/blog");
  }
  const user = await getUserWithSubscribers(session.user.id);
  if (!user) {
    redirect("/blog");
  }

  return (
    <div className="flex flex-col gap-4 p-5 mb-[100px]">
      <h1 className="text-lg font-semibold">Подписчики</h1>
      {!!user.subscribers.length ? (
        <div className="flex flex-col gap-6">
          {user.subscribers.map(({ subscriber: sub }) => {
            return (
              <div key={sub.id} className="flex justify-between items-center">
                <LoaderLink
                  href={`/user/${sub.id}`}
                  className="flex items-center gap-5"
                >
                  <ImageWithFallback
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
        <h2 className="text-destructive">Пока пусто!</h2>
      )}
    </div>
  );
};

export default ProfileSubscribersPage;
