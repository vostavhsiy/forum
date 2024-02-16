"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Form, Formik } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { toast } from "sonner";
import { createTag } from "@/actions/users.actions";

const CreateTagForm = () => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogTrigger asChild>
          <Button>Создать тег</Button>
        </DialogTrigger>
        <DialogContent>
          <Formik
            initialValues={{ name: "" }}
            onSubmit={async (values, { resetForm }) => {
              if (isPending) {
                return;
              }
              if (!values.name) {
                return toast.error("Заполните поле!");
              }
              startTransition(() => {
                createTag(values.name).then((res) => {
                  if (res.ok) {
                    toast.success("Тег создан!");
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
              <Form className="flex items-center gap-4 pr-5">
                <FormikInput name={"name"} placeholder={"Название тега"} />
                <Button disabled={isPending} type={"submit"}>
                  Создать
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { CreateTagForm };
