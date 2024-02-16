"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";

const SignOutButton = (props: ButtonProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || pathname;

  const [isPending, startTransition] = useTransition();

  return (
    <Button
      {...props}
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          signOut({ callbackUrl });
        });
      }}
    >
      Выйти
    </Button>
  );
};

export { SignOutButton };
