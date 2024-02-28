"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FC, useState, useTransition } from "react";
import {
  createUpdatePasswordLink,
  updatePassword,
} from "@/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  link: string;
}

const Form: FC<Props> = ({ link }) => {
  const [isPending, startTransition] = useTransition();

  const [fetching, setFetching] = useState(false);

  const router = useRouter();
  const submitHandler = (data: FormData) => {
    const password = data.get("password") as string;
    if (isPending || !password || fetching) return;
    if (password.length < 9) {
      return toast.error("Пароль должен быть не короче 9 символов!");
    }
    startTransition(() => {
      updatePassword(link, password).then((res) => {
        if (res.ok) {
          toast.success("Пароль восстановлен!");
          setFetching(true);
          router.push("/login");
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
      <Input name={"password"} type={"password"} placeholder={"Новый пароль"} />
      <Button type="submit" disabled={isPending || fetching}>
        <Send />
      </Button>
    </form>
  );
};

export { Form };
