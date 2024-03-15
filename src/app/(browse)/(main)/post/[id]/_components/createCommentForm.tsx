"use client";

import React, { FC, useTransition } from "react";
import { User } from "@prisma/client";
import { Form, Formik } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createComment } from "@/actions/blog.actions";
import { socket } from "@/components/Notifications";

interface Props {
  postId: string;
}

const CreateCommentForm: FC<Props> = ({ postId }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Formik
      initialValues={{ text: "" }}
      onSubmit={async (values, { resetForm }) => {
        if (!values.text) {
          toast.error("Заполните поле!");
          return;
        }
        startTransition(() => {
          createComment({ postId, text: values.text }).then((res) => {
            if (res.ok) {
              socket.send({
                type: "specific",
                data: `Новый комментарий от ${res.name}!`,
                ids: res.ids,
                link: res.postId ? `/post/${res.postId}` : "",
              });
              toast.success("Комментарий добавлен!");
              resetForm();
            } else {
              toast.error(res.error);
            }
          });
        });
      }}
    >
      {() => (
        <Form className="flex items-center gap-4 lg:w-1/2">
          <FormikInput name={"text"} placeholder={"Ваш комментарий"} />
          <Button disabled={isPending} type={"submit"}>
            Оставить
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export { CreateCommentForm };
