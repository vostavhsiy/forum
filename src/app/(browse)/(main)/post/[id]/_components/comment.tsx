"use client";

import { FC, useTransition } from "react";
import { User, Comment, Answer as IAnswer } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { deleteComment } from "@/actions/blog.actions";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import Link from "next/link";
import { CreateAnswerForm } from "@/app/(browse)/(main)/post/[id]/_components/createAnswerForm";
import { Answer } from "@/app/(browse)/(main)/post/[id]/_components/answer";
import { LoaderLink } from "@/components/LoaderLink";

interface Props {
  comment: Comment & { author: User; answers: IAnswer[] };
  user: User | null;
}

const Comment: FC<Props> = ({ user, comment }) => {
  const [isPending, startTransition] = useTransition();

  const clickHandler = async () => {
    startTransition(() => {
      deleteComment({ commentId: comment.id }).then((res) => {
        if (res.ok) {
          toast.success("Комментарий удален!");
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <>
      <div className="relative flex flex-col gap-3 p-3 pt-8 lg:pt-3 rounded-xl bg-primary-foreground min-w-[40%] w-max max-w-[95%] lg:max-w-full">
        <h5 className="absolute top-[10px] right-[10px] text-[12px] font-semibold">
          {new Date(comment.createdAt).toLocaleString()}
        </h5>
        <LoaderLink
          href={`/user/${comment.author.id}`}
          className={"text-sm underline font-semibold"}
        >
          {comment.author.name}
        </LoaderLink>
        <p>{comment.text}</p>
        {user && (
          <div className="flex items-center justify-between gap-4">
            <div className={"w-full lg:w-1/2 lg:min-w-[450px]"}>
              <CreateAnswerForm
                commentId={comment.id}
                to={comment.author.name as string}
              />
            </div>
            {user.id === comment.author.id && (
              <Button
                variant={"destructive"}
                disabled={isPending}
                onClick={clickHandler}
                className={"w-max"}
              >
                <Trash />
              </Button>
            )}
          </div>
        )}
      </div>
      {!!comment.answers.length &&
        comment.answers.map((answer) => {
          return <Answer key={answer.id} answer={answer as any} user={user} />;
        })}
    </>
  );
};

export { Comment };
