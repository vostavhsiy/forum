"use client";

import { Button } from "@/components/ui/button";
import { createConversation } from "@/actions/chat.actions";
import { MessageCircle } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const MessageButton = ({ userId }: { userId: string }) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  return (
    <Button
      onClick={() => {
        startTransition(() => {
          createConversation({ userId }).then((res) => {
            if (res.ok) {
              router.push(`/messenger/${res.id}`);
            }
          });
        });
      }}
    >
      <MessageCircle />
    </Button>
  );
};

export { MessageButton };
