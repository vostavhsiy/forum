"use client";

import React, { FC, useTransition } from "react";
import { deletePost } from "@/actions/blog.actions";
import { toast } from "sonner";
import { Post, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface Props {
  post: Post;
  user?: User;
}

const DeleteButton: FC<Props> = ({ post, user }) => {
  const [isPending, startTransition] = useTransition();
  const deleteHandler = () => {
    if (!user) {
      return;
    }
    if (!["admin", "editor"].includes(user.role)) {
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

  if (!user || !["admin", "editor"].includes(user.role)) {
    return null;
  }

  return (
    <Button
      size={"icon"}
      variant={"outline"}
      disabled={isPending}
      onClick={deleteHandler}
    >
      <Trash />
    </Button>
  );
};

export { DeleteButton };
