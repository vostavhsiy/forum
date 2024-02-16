"use client";

import { Form, Formik, FormikHelpers } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { signUp } from "@/actions/auth.actions";
import { toast } from "sonner";

export const SignUpForm = () => {
  const router = useRouter();

  const file = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const submitHandler = async (
    values: { email: string; name: string; password: string; image: string },
    {
      setFieldError,
    }: FormikHelpers<{
      email: string;
      name: string;
      password: string;
      image: string;
    }>,
  ) => {
    if (!values.email || !values.name || !values.password) {
      return setFieldError("email", "Заполните все поля");
    }
    const data = new FormData();
    data.set("email", values.email);
    data.set("name", values.name);
    data.set("password", values.password);
    if (file.current?.files && file.current.files[0]) {
      data.set("image", file.current.files[0]);
    }
    startTransition(() => {
      signUp(data).then((res) => {
        if (res?.ok) {
          router.push("/login");
        } else {
          toast.error(res.error);
        }
      });
    });
    // try {
    //   startTransition(() => {
    //     signUp(data).then((res) => {
    //       if (res?.ok) {
    //         router.push("/login");
    //       } else {
    //         toast.error(res.error);
    //       }
    //     });
    //   });
    // } catch (e) {
    //   const err = e as Error;
    //   console.log(err.message);
    // }
  };

  return (
    <Formik
      initialValues={{ email: "", name: "", password: "", image: "" }}
      onSubmit={submitHandler}
    >
      {({ errors }) => (
        <Form className="flex flex-col items-center gap-3 w-full">
          <FormikInput name={"email"} type={"email"} placeholder={"Почта"} />
          <FormikInput name={"name"} type={"text"} placeholder={"Логин"} />
          <FormikInput
            name={"password"}
            type={"password"}
            placeholder={"Пароль"}
          />
          <FormikInput name={"image"} type={"file"} fileRef={file} />
          {errors.email && (
            <div className="text-base text-destructive">{errors.email}</div>
          )}
          <Button
            disabled={isPending}
            type={"submit"}
            size={"lg"}
            className={"text-lg w-full mt-5"}
          >
            Зарегистрироваться
          </Button>
        </Form>
      )}
    </Formik>
  );
};
