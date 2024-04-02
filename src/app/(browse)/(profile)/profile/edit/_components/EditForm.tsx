"use client";

import React, { FC, useRef, useTransition } from "react";
import { Form, Formik } from "formik";
import { Button } from "@/components/ui/button";
import { editProfile } from "@/actions/users.actions";
import { toast } from "sonner";
import { FormikInput } from "@/components/FormikInput";

interface Props {
  name: string | null;
  password: string | null;
}

const EditForm: FC<Props> = ({ name, password }) => {
  const image = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  return (
    <Formik
      initialValues={{
        name: name || "",
        password: password || "",
        image: "",
      }}
      onSubmit={async (values, { setFieldValue }) => {
        const data = new FormData();
        if (values.name.length < 5) {
          return toast.error("Имя должно быть не короче 5 символов!");
        }
        if (values.password.length < 5) {
          return toast.error("Пароль должен быть не короче 5 символов!");
        }
        data.set("name", values.name);
        if (values.password !== password) {
          data.set("password", values.password);
        }
        if (image.current?.files && image.current.files[0]) {
          data.set("image", image.current.files[0]);
        }
        startTransition(() => {
          editProfile(data).then((res) => {
            if (res.ok) {
              toast.success("Данные изменены");
              setFieldValue("image", "");
            } else {
              toast.error(res.error);
            }
          });
        });
      }}
    >
      {() => (
        <Form className="flex flex-col gap-3 lg:w-1/2">
          <FormikInput name={"name"} placeholder="Новое имя" />
          <FormikInput
            name={"password"}
            type="password"
            placeholder="Новый пароль"
          />
          <FormikInput name={"image"} type={"file"} fileRef={image} />
          <Button disabled={isPending} type={"submit"} className="mt-3">
            Изменить
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export { EditForm };
