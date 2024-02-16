"use client";

import { Post } from "@prisma/client";
import { FC, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deletePost } from "@/actions/blog.actions";
import { toast } from "sonner";
import { LoaderLink } from "@/components/LoaderLink";

interface Props {
  post: Post;
}

const PostCard: FC<Props> = ({ post }) => {
  const [isPending, startTransition] = useTransition();

  const clickHandler = () => {
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
    <div
      key={post.id}
      className="flex items-center justify-between py-2 px-5 rounded-xl bg-primary-foreground"
    >
      <div className="flex flex-col gap-1">
        <LoaderLink className={"font-semibold"} href={`/posts/${post.id}`}>
          {post.title}
        </LoaderLink>
        <h3 className="text-sm text-zinc-600">{post.text.slice(0, 200)}...</h3>
      </div>
      <Button
        size={"icon"}
        variant={"destructive"}
        disabled={isPending}
        onClick={clickHandler}
      >
        <Trash />
      </Button>
    </div>
  );
};

export { PostCard };
