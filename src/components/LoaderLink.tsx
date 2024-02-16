"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";

const LoaderLink = (props: any) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  return (
    <>
      <Link
        {...props}
        onClick={() => {
          startTransition(() => {
            router.push(props.href);
          });
        }}
      >
        {props.children}
      </Link>
      {isPending && <Loader />}
    </>
  );
};

export { LoaderLink };
