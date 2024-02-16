"use client";

import React, { FC, useTransition } from "react";
import { User } from "@prisma/client";
import { Form, Formik } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createAnswer, createComment } from "@/actions/blog.actions";

interface Props {
  commentId: string;
  to: string;
}

const CreateAnswerForm: FC<Props> = ({ commentId, to }) => {
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
          createAnswer({ commentId, text: values.text, to }).then((res) => {
            if (res.ok) {
              toast.success("Ответ добавлен!");
              resetForm();
            } else {
              toast.error(res.error);
            }
          });
        });
      }}
    >
      {() => (
        <Form className="flex items-center gap-4">
          <FormikInput
            name={"text"}
            className={"w-full"}
            placeholder={"Ваш ответ"}
          />
          <Button disabled={isPending} type={"submit"}>
            Ответить
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export { CreateAnswerForm };
