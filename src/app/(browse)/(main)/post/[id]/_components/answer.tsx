"use client";

import { FC, useTransition } from "react";
import { User, Comment } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { deleteAnswer, deleteComment } from "@/actions/blog.actions";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import Link from "next/link";
import { CreateAnswerForm } from "@/app/(browse)/(main)/post/[id]/_components/createAnswerForm";

interface Props {
  answer: Comment & { author: User };
  user: User | null;
}

const Answer: FC<Props> = ({ user, answer }) => {
  const [isPending, startTransition] = useTransition();

  const clickHandler = async () => {
    startTransition(() => {
      deleteAnswer({ answerId: answer.id }).then((res) => {
        if (res.ok) {
          toast.success("Ответ удален!");
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <div className="ml-[30px] lg:ml-[50px] relative flex flex-col gap-3 p-3 pt-8 lg:pt-3 rounded-xl bg-primary-foreground min-w-[95%] lg:min-w-[80%] w-max max-w-full">
      <h5 className="absolute top-[10px] right-[10px] text-[12px] font-semibold">
        {new Date(answer.createdAt).toLocaleString()}
      </h5>
      <div className={"text-sm flex items-center gap-1"}>
        <Link
          href={`/user/${answer.author.id}`}
          className={"underline font-semibold"}
        >
          {answer.author.name}
        </Link>
        <span>отвечает {answer.to}</span>
      </div>

      <p>{answer.text}</p>
      {user && (
        <div className="flex items-center justify-end gap-4">
          {user.id === answer.author.id && (
            <Button
              variant={"destructive"}
              size={"icon"}
              disabled={isPending}
              onClick={clickHandler}
            >
              <Trash />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export { Answer };
