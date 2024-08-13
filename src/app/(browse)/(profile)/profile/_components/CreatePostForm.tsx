"use client";

import React, { FC, useRef, useState, useTransition } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormikTextarea } from "@/components/FormikTextarea";
import { createPost } from "@/actions/blog.actions";
import { toast } from "sonner";
import { Tag } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Check, Plus, X } from "lucide-react";
import { socket } from "@/components/Notifications";

interface Props {
  tags: Tag[];
}

const CreatePostForm: FC<Props> = ({ tags }) => {
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [openPickedTags, setOpenPickedTags] = useState(false);

  const [pickedTags, setPickedTags] = useState<Tag[]>([]);
  const [searchInPickedTags, setSearchInPickedTags] = useState("");

  const image = useRef<HTMLInputElement>(null);

  const submitHandler = async (
    values: { title: string; text: string; tags: string; image: string },
    {
      setFieldError,
      resetForm,
    }: FormikHelpers<{
      title: string;
      text: string;
      tags: string;
      image: string;
    }>,
  ) => {
    if (!values.title || !values.text) {
      return setFieldError("title", "Заполните все поля");
    }
    const data = new FormData();
    data.set("title", values.title);
    data.set("text", values.text);
    data.set("tags", JSON.stringify(pickedTags));
    if (image.current?.files && image.current.files[0]) {
      data.set("image", image.current.files[0]);
    }
    try {
      startTransition(() => {
        createPost(data).then((res) => {
          if (res.ok) {
            socket.send({
              type: "specific",
              data: `Новый пост от ${res.name}!`,
              ids: res.ids,
              link: res.postId ? `/post/${res.postId}` : "",
            });
            toast.success("Пост создан!");
          } else {
            toast.error(res.error);
          }
          resetForm();
          setPickedTags([]);
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
        setPickedTags([]);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Добавить пост</Button>
      </DialogTrigger>
      <DialogContent className="w-[80%] h-[80%] max-w-screen-lg flex flex-col gap-5">
        <h2 className={"font-semibold"}>Создание поста</h2>
        <Formik
          initialValues={{ title: "", text: "", tags: "", image: "" }}
          onSubmit={submitHandler}
        >
          {({ errors }) => (
            <Form className="flex flex-col items-center gap-3 w-full h-full">
              <div className="w-full flex flex-col lg:flex-row items-center gap-4">
                <FormikInput
                  name={"title"}
                  type={"text"}
                  placeholder={"Название поста"}
                  className={"h-max"}
                />
                <Dialog
                  open={openPickedTags}
                  onOpenChange={(openValue) => {
                    setOpenPickedTags(openValue);
                    setSearchInPickedTags("");
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full lg:w-auto" variant="outline">
                      Добавить теги
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[80%] lg:w-[50%] h-[50%] max-w-screen-lg flex flex-col gap-5">
                    <Input
                      value={searchInPickedTags}
                      className={"w-[60%]"}
                      placeholder="Поиск доступных тегов"
                      onChange={(e) =>
                        setSearchInPickedTags(e.currentTarget.value)
                      }
                    />
                    <div className="flex flex-col gap-3 h-[90%] overflow-auto pr-2">
                      {tags
                        .filter((tag) =>
                          tag.name
                            .toLowerCase()
                            .includes(searchInPickedTags.toLowerCase()),
                        )
                        .map((tag) => {
                          return (
                            <div
                              key={tag.id}
                              className={
                                "cursor-pointer flex pb-2 items-center justify-between border-b-2 last:border-b-0"
                              }
                              onClick={() => {
                                if (pickedTags.find((t) => t.id === tag.id)) {
                                  setPickedTags((prev) =>
                                    prev.filter((t) => t.id !== tag.id),
                                  );
                                } else {
                                  setPickedTags((prev) => [...prev, tag]);
                                }
                              }}
                            >
                              <h2>{tag.name}</h2>
                              <Button
                                variant={
                                  pickedTags.find((t) => t.id === tag.id)
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {pickedTags.find((t) => t.id === tag.id) ? (
                                  <X />
                                ) : (
                                  <Plus />
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      {!tags.length && <h2>Нет доступных тегов!</h2>}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {!!pickedTags.length && (
                <div className="w-full flex items-center gap-2 flex-wrap">
                  {pickedTags.map((tag) => (
                    <h2
                      key={tag.id}
                      className="px-2 py-1 bg-primary text-background rounded-xl text-sm"
                    >
                      {tag.name}
                    </h2>
                  ))}
                </div>
              )}
              <FormikTextarea
                name={"text"}
                placeholder={"Содержание поста"}
                className="h-[80%] resize-none"
              />
              {errors.title && (
                <div className="text-base text-destructive">{errors.title}</div>
              )}
              <FormikInput name={"image"} type={"file"} fileRef={image} />
              <Button
                disabled={isPending}
                type={"submit"}
                size={"lg"}
                className={"text-lg w-full mt-5 py-4"}
              >
                Создать пост
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export { CreatePostForm };
