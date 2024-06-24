"use client";

import React, { FC, useTransition } from "react";
import { addPostView, dislikePost, likePost } from "@/actions/blog.actions";
import Image from "next/image";
import { Tag } from "@prisma/client";
import { ends } from "@/lib/word-ends";
import { LoaderLink } from "@/components/LoaderLink";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Heart, HeartCrack } from "lucide-react";
import { ImageWithFallback } from "@/components/FallbackImage";

interface Props {
  post: any;
  auth?: string;
  favourite?: boolean;
}

const Post: FC<Props> = ({ post, auth, favourite }) => {
  const [isPending, startTransition] = useTransition();

  const clickHandler = () => {
    if (!auth) {
      return;
    }
    if (favourite) {
      startTransition(() => {
        dislikePost(post.id).then((res) => {
          if (res.ok) {
          } else {
          }
        });
      });
    } else {
      startTransition(() => {
        likePost(post.id).then((res) => {
          if (res.ok) {
          } else {
          }
        });
      });
    }
  };

  return (
    <div className="w-full p-5 rounded-2xl border border-primary/20 bg-background/60 flex flex-col gap-8">
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <LoaderLink
              href={`/post/${post.id}`}
              className="text-xl"
              onClick={async () => {
                await addPostView(post.id);
              }}
            >
              {post.title}
            </LoaderLink>
            {auth && (
              <Button
                disabled={isPending}
                variant={favourite ? "destructive" : "secondary"}
                size={"icon"}
                onClick={clickHandler}
              >
                {favourite ? <HeartCrack /> : <Heart />}
              </Button>
            )}
          </div>
          <h3 className="text-sm text-zinc-600">
            {post.text.slice(0, 200)}...
          </h3>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
        <LoaderLink
          href={`/user/${post.author.id}`}
          className="flex items-center gap-3"
        >
          <ImageWithFallback
            src={post.author.image || "/user.png"}
            alt={"user"}
            width={500}
            height={500}
            className="w-[40px] h-[40px] object-center object-cover rounded-full"
          />
          <div className="flex flex-col gap-1 w-max">
            <h3 className="text-sm font-semibold">{post.author.name}</h3>
            <h4 className="text-[12px]">{post.author.email}</h4>
          </div>
        </LoaderLink>
        <div className="flex flex-wrap items-center gap-4 lg:w-[80%] mb-6 lg:mb-0">
          {post.tags.map((tag: Tag) => {
            return (
              <LoaderLink
                key={tag.id}
                href={`/tag/${tag.id}`}
                className="text-[12px] bg-primary text-background py-1 px-4 rounded-xl transition-all hover:text-white hover:bg-destructive"
              >
                {tag.name}
              </LoaderLink>
            );
          })}
        </div>
      </div>
      <div className={"flex items-center gap-2 text-[12px]"}>
        <span>
          {post.views}{" "}
          {ends(post.views, ["просмотр", "просмотра", "просмотров"])}
        </span>
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

export { Post };
