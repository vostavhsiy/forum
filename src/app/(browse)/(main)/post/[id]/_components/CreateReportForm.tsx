"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FC, useState, useTransition } from "react";
import { Form, Formik } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { toast } from "sonner";
import { createReport, createTag } from "@/actions/users.actions";
import { FormikTextarea } from "@/components/FormikTextarea";
import { Post } from "@prisma/client";
import { AlertTriangle } from "lucide-react";

interface Props {
  post: Post;
}

const CreateReportForm: FC<Props> = ({ post }) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <AlertTriangle />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="font-semibold">Репорт</DialogHeader>
          <Formik
            initialValues={{ report: "" }}
            onSubmit={async (values, { resetForm }) => {
              if (isPending) {
                return;
              }
              if (!values.report) {
                return toast.error("Заполните поле!");
              }
              startTransition(() => {
                createReport(values.report, post.id).then((res) => {
                  if (res.ok) {
                    toast.success("Репорт отправлен!");
                    resetForm();
                    setOpen(false);
                  } else {
                    toast.success(res.error);
                  }
                });
              });
            }}
          >
            {() => (
              <Form className="flex flex-col items-center gap-4 ">
                <FormikTextarea
                  name={"report"}
                  placeholder={"Ваша жалоба"}
                  className={"h-[30vh] resize-none"}
                />
                <Button
                  className={"w-full"}
                  disabled={isPending}
                  type={"submit"}
                >
                  Отправить
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { CreateReportForm };
