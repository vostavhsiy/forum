import React from "react";
import { NextPage } from "next";
import { getConversation } from "@/actions/chat.actions";
import { redirect } from "next/navigation";
import SendMessageForm from "@/app/(browse)/(messenger)/messenger/[id]/_components/sendMessageForm";
import { MessageHandler } from "@/app/(browse)/(messenger)/messenger/_components/MessageHandler";
import Messages from "@/app/(browse)/(messenger)/messenger/[id]/_components/messages";
import { MessagesHeader } from "@/app/(browse)/(messenger)/messenger/_components/MessageHeader";
import { Button } from "@/components/ui/button";
import { StepBack } from "lucide-react";
import Link from "next/link";

interface Props {
  params: {
    id: string;
  };
}

const ConversationPage: NextPage<Props> = async ({ params }) => {
  const conversation = await getConversation(params.id);
  if (!conversation) {
    return redirect("/messenger");
  }
  return (
    <div
      className={
        "relative lg:static h-full grid grid-rows-[60px+1fr+60px] gap-2 w-full"
      }
    >
      <Button
        size={"icon"}
        variant={"outline"}
        className="absolute top-[0px] -translate-y-[140%] left-[5px] lg:hidden"
        asChild
      >
        <Link href={"/messenger"}>
          <StepBack />
        </Link>
      </Button>
      <MessagesHeader conversation={conversation} />
      <Messages messages={conversation.messages} conversation={conversation} />
      <SendMessageForm conversation={conversation} />
      <MessageHandler conversation={conversation} />
    </div>
  );
};

export default ConversationPage;
