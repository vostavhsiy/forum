"use client";

import React, { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export const GoogleButton = (props: ButtonProps) => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          signIn("google", {
            callbackUrl,
          });
        });
      }}
      {...props}
    >
      Войти с помощью Google
    </Button>
  );
};
