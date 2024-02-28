"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useTransition } from "react";
import { createUpdatePasswordLink } from "@/actions/auth.actions";
import { toast } from "sonner";

const Form = () => {
  const [isPending, startTransition] = useTransition();
  const submitHandler = (data: FormData) => {
    const email = data.get("email") as string;
    if (isPending || !email) return;
    startTransition(() => {
      createUpdatePasswordLink(email).then((res) => {
        if (res.ok) {
          toast.success("Письмо отправлено!");
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <form
      action={submitHandler}
      className="flex items-center gap-6 w-full px-6"
    >
      <Input name={"email"} type={"email"} placeholder={"Email"} />
      <Button type="submit" disabled={isPending}>
        <Send />
      </Button>
    </form>
  );
};

export { Form };
