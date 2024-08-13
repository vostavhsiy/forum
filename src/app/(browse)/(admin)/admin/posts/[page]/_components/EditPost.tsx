"use client";

import React, { FC, useRef, useState, useTransition } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormikTextarea } from "@/components/FormikTextarea";
import {
  createPost,
  deletePostPicture,
  editPostInPanel,
} from "@/actions/blog.actions";
import { toast } from "sonner";
import { Post, Tag } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Check, Plus, Settings, Trash, X } from "lucide-react";
import { socket } from "@/components/Notifications";

interface Props {
  post: Post;
}

const EditPostForm: FC<Props> = ({ post }) => {
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  const image = useRef<HTMLInputElement>(null);

  const deleteHandler = () => {
    if (post.image) {
      startTransition(() => {
        deletePostPicture(post.id, post.image).then((res) => {
          if (res.ok) {
            toast.success("Фотография удалена!");
          }
        });
      });
    }
  };

  const submitHandler = async (
    values: { title: string; text: string; image: string },
    {
      setFieldError,
      resetForm,
    }: FormikHelpers<{ title: string; text: string; image: string }>,
  ) => {
    if (!values.title || !values.text) {
      return setFieldError("title", "Заполните все поля");
    }
    const data = new FormData();
    data.set("title", values.title);
    data.set("text", values.text);
    data.set("url", post.image);
    if (image.current?.files && image.current.files[0]) {
      data.set("image", image.current.files[0]);
    }
    try {
      startTransition(() => {
        editPostInPanel(post.id, data).then((res) => {
          if (res.ok) {
            toast.success("Пост обновлен!");
          } else {
            toast.error(res.error);
          }
          resetForm();
          setOpen(false);
        });
      });
    } catch (e) {
      const err = e as Error;
      console.log(err.message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(openValue) => {
        setOpen(openValue);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80%] h-[80%] max-w-screen-lg flex flex-col gap-5">
        <h2 className={"font-semibold"}>Редактирование поста</h2>
        <Formik
          initialValues={{
            title: post.title || "",
            text: post.text || "",
            image: "",
          }}
          onSubmit={submitHandler}
        >
          {({ errors }) => (
            <Form className="flex flex-col items-center gap-3 w-full h-full">
              <div className="w-full flex items-center gap-4">
                <FormikInput
                  name={"title"}
                  type={"text"}
                  placeholder={"Название поста"}
                  className={"h-max"}
                />
              </div>
              <FormikTextarea
                name={"text"}
                placeholder={"Содержание поста"}
                className="h-[80%] resize-none"
              />
              {errors.title && (
                <div className="text-base text-destructive">{errors.title}</div>
              )}
              <div className="flex flex-col items-center gap-2">
                <FormikInput
                  name={"image"}
                  type={"file"}
                  fileRef={image}
                  label={
                    post.image ? "Изменить изображение" : "Добавить изображение"
                  }
                />
                {post.image && (
                  <Button
                    disabled={isPending}
                    variant={"destructive"}
                    onClick={deleteHandler}
                    type={"button"}
                  >
                    Удалить изображение
                  </Button>
                )}
              </div>
              <Button
                disabled={isPending}
                type={"submit"}
                size={"lg"}
                className={"text-lg w-full mt-5"}
              >
                Изменить пост
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export { EditPostForm };
