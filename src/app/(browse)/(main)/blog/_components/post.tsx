"use client";

import React, { FC, useTransition } from "react";
import { IPost } from "@/types/IPost";
import { Button } from "@/components/ui/button";
import { HeartCrack, Heart, Trash } from "lucide-react";
import {
  addPostView,
  deletePost,
  dislikePost,
  likePost,
} from "@/actions/blog.actions";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "@prisma/client";
import { toast } from "sonner";
import { EditPostForm } from "@/app/(browse)/(admin)/admin/posts/[page]/_components/EditPost";
import { ends } from "@/lib/word-ends";
import { LoaderLink } from "@/components/LoaderLink";
import { ImageWithFallback } from "@/components/FallbackImage";

interface Props {
  post: any;
  auth?: string;
  favourite?: boolean;
  inBlog?: boolean;
  inAdminPanel?: boolean;
}

const Post: FC<Props> = ({ post, auth, favourite, inBlog, inAdminPanel }) => {
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

  const deleteHandler = () => {
    if (!inAdminPanel && auth !== post.author.id) {
      return;
    }
    startTransition(() => {
      deletePost(post.id).then((res) => {
        if (res.ok) {
          toast.success("Пост удален!");
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <div className="relative w-full p-5 rounded-2xl bg-primary-foreground flex flex-col gap-8">
      <div
        className={
          "absolute bottom-[5px] right-[10px] flex items-center gap-2 text-[12px]"
        }
      >
        <span>
          {post.views}{" "}
          {ends(post.views, ["просмотр", "просмотра", "просмотров"])}
        </span>
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <div className="w-full flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <LoaderLink
            href={`/post/${post.id}`}
            className="text-base lg:text-xl"
            onClick={async () => {
              await addPostView(post.id);
            }}
          >
            {post.title}
          </LoaderLink>
          <h3 className="text-sm text-zinc-600">
            {post.text.slice(0, 200)}...
          </h3>
        </div>
        <div className="flex items-center justify-end lg:justify-start gap-2">
          {inAdminPanel && <EditPostForm post={post} />}
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
          {((!inBlog && auth === post.author.id) || inAdminPanel) && (
            <Button
              size={"icon"}
              variant={"destructive"}
              disabled={isPending}
              onClick={deleteHandler}
            >
              <Trash />
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">
        <LoaderLink
          href={
            post.author.id === auth ? "/profile" : `/user/${post.author.id}`
          }
          className="flex items-center gap-3"
        >
          <ImageWithFallback
            src={post.author.image || "/user.png"}
            alt={"user"}
            width={500}
            height={500}
            className="w-[30px] h-[30px] object-center object-cover rounded-full"
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
    </div>
  );
};

export { Post };
