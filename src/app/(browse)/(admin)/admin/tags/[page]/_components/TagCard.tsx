"use client";

import React, { FC, useTransition } from "react";
import { Tag } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { deleteTag } from "@/actions/users.actions";
import { toast } from "sonner";

interface Props {
  tag: Tag;
}

const TagCard: FC<Props> = ({ tag }) => {
  const [isPending, startTransition] = useTransition();

  const deleteHandler = () => {
    startTransition(() => {
      deleteTag(tag.id).then((res) => {
        if (res.ok) {
          toast.success("Тег удален!");
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <div
      key={tag.id}
      className={
        "flex items-center gap-4 py-2 px-4 bg-primary text-background rounded-xl"
      }
    >
      <Link href={`/tag/${tag.id}`}>{tag.name}</Link>
      <Button
        disabled={isPending}
        onClick={deleteHandler}
        size={"sm"}
        variant={"link"}
        className={"text-destructive"}
      >
        <X />
      </Button>
    </div>
  );
};

export { TagCard };
