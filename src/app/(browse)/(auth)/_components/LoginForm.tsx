"use client";

import { Form, Formik, FormikHelpers } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useTransition } from "react";
import { revalidate } from "@/actions/auth.actions";
import { toast } from "sonner";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isPending, startTransition] = useTransition();

  const submitHandler = async (
    values: { email: string; password: string },
    { setFieldError }: FormikHelpers<{ email: string; password: string }>,
  ) => {
    if (!values.email || !values.password) {
      return setFieldError("email", "Заполните все поля");
    }
    startTransition(() => {
      signIn("credentials", {
        email: values.email,
        password: values.password,
        // callbackUrl,
      }).then((res) => {
        if (res?.ok) {
          revalidate(["/"]).then((res) => {
            router.push("/");
          });
        } else {
          // toast.error(res ? res.error : "Ошибка!");
        }
      });
    });
    // try {
    //   startTransition(() => {
    //     signIn("credentials", {
    //       email: values.email,
    //       password: values.password,
    //       callbackUrl,
    //     }).then((res) => {
    //       if (res?.ok) {
    //         revalidate(["/"]).then((res) => {
    //           router.push("/");
    //         });
    //       } else {
    //         // toast.error(res ? res.error : "Ошибка!");
    //       }
    //     });
    //   });
    // } catch (e) {
    //   const err = e as Error;
    //   console.log(err.message);
    // }
  };

  return (
    <Suspense>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={submitHandler}
      >
        {({ errors }) => (
          <Form className="flex flex-col items-center gap-3 w-full">
            <FormikInput name={"email"} type={"email"} placeholder={"Почта"} />
            <FormikInput
              name={"password"}
              type={"password"}
              placeholder={"Пароль"}
            />
            {errors.email && (
              <div className="text-base text-destructive">{errors.email}</div>
            )}
            <Button
              disabled={isPending}
              type={"submit"}
              size={"lg"}
              className={"text-lg w-full mt-5"}
            >
              Войти
            </Button>
            {searchParams.get("error") && (
              <h3 className="text-destructive">Неправильные данные!</h3>
            )}
          </Form>
        )}
      </Formik>
    </Suspense>
  );
};
