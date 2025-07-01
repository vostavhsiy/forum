"use client";

import { Form, Formik } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { FormikTextarea } from "@/components/FormikTextarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const HomeContactsForm = () => {
  const form = useRef<any>();

  const [isPending, setIsPending] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo(
        ".send",
        {
          opacity: 0,
          y: "100%",
        },
        {
          opacity: 1,
          delay: 0.5,
          y: "85%",
          scrollTrigger: { trigger: form.current },
        },
      );
    },
    { scope: form.current },
  );

  return (
    <div className={"text-primary"}>
      <Formik
        initialValues={{
          name: "",
          surname: "",
          email: "",
          phone: "",
          message: "",
        }}
        onSubmit={(values, formikHelpers) => {
          if (Object.values(values).some((value) => !value)) {
            toast.error("Заполните все поля!");
            return;
          }
          setIsPending(true);
          setTimeout(() => {
            toast.success(
              "Спасибо за обращение! Мы свяжемся с вами в ближайшее время.",
            );
            formikHelpers.resetForm();
            setIsPending(false);
          }, 1000);
        }}
      >
        {({}) => (
          <Form
            ref={form}
            className={"form flex flex-col items-end gap-8 relative"}
          >
            <div className={"w-full grid grid-cols-2 gap-8"}>
              <label
                htmlFor={"contacts_name"}
                className={"focus-within:font-semibold"}
              >
                <span className={"block mb-2 text-sm"}>Имя:</span>
                <FormikInput
                  id={"contacts_name"}
                  name={"name"}
                  placeholder={"Ваше имя"}
                  required
                />{" "}
              </label>
              <label
                htmlFor={"contacts_surname"}
                className={"focus-within:font-semibold"}
              >
                <span className={"block mb-2 text-sm"}>Фамилия:</span>
                <FormikInput
                  id={"contacts_surname"}
                  name={"surname"}
                  placeholder={"Ваша фамилия"}
                  required
                />{" "}
              </label>
              <label
                htmlFor={"contacts_email"}
                className={"focus-within:font-semibold"}
              >
                <span className={"block mb-2 text-sm"}>Email:</span>
                <FormikInput
                  id={"contacts_email"}
                  name={"email"}
                  type={"email"}
                  placeholder={"Ваш email"}
                  required
                />{" "}
              </label>
              <label
                htmlFor={"contacts_phone"}
                className={"focus-within:font-semibold"}
              >
                <span className={"block mb-2 text-sm"}>Номер телефона:</span>
                <FormikInput
                  id={"contacts_phone"}
                  name={"phone"}
                  placeholder={"Ваш телефон"}
                  required
                />{" "}
              </label>
            </div>
            <label
              htmlFor={"contacts_message"}
              className={"focus-within:font-semibold w-full"}
            >
              <span className={"block mb-2 text-sm"}>Сообщение:</span>
              <FormikTextarea
                id={"contacts_message"}
                name={"message"}
                placeholder={"Ваше сообщение"}
              />
            </label>
            <Button
              disabled={isPending}
              type={"submit"}
              className={"w-max z-[1]"}
            >
              Отправить
            </Button>
            <Image
              src={"/home/contacts_send.svg"}
              alt={"send"}
              width={500}
              height={500}
              className={"send w-auto h-auto absolute right-0 bottom-0"}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};
