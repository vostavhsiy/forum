"use client";

import { FC, useTransition } from "react";
import { Post, User, Report } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteReport } from "@/actions/users.actions";
import { toast } from "sonner";
import { LoaderLink } from "@/components/LoaderLink";

interface Props {
  report: Report & { post: Post; author: User };
}

const ReportCard: FC<Props> = ({ report }) => {
  const [isPending, startTransition] = useTransition();

  const clickHandler = () => {
    startTransition(() => {
      deleteReport(report.id).then((res) => {
        if (res.ok) {
          toast.success("Репорт удален!");
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <div className={"relative flex flex-col gap-4 p-4 rounded-xl bg-secondary"}>
      <div
        className={
          "absolute top-[10px] right-[10px] flex items-center gap-4 text-sm"
        }
      >
        <h5>{new Date(report.createdAt).toLocaleString()}</h5>
        <Button
          onClick={clickHandler}
          disabled={isPending}
          size={"sm"}
          variant={"destructive"}
        >
          <Trash />
        </Button>
      </div>
      <h3 className={"text-sm font-semibold flex items-center gap-2"}>
        <span>Репорт от</span>
        <LoaderLink href={`/user/${report.author.id}`} className={"underline"}>
          {report.author.name}
        </LoaderLink>
      </h3>
      <p>{report.text}</p>
      <div className={"text-sm"}>
        Пост:{" "}
        <LoaderLink href={`/post/${report.post.id}`} className={"underline"}>
          {report.post.title}
        </LoaderLink>
      </div>
    </div>
  );
};

export { ReportCard };
