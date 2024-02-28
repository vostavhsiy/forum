"use client";

import React, { FC, useEffect, useRef } from "react";
import { MessageBox } from "@/app/(browse)/(messenger)/messenger/[id]/_components/message";
import { Conversation, Message } from "@prisma/client";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setNewMessage } from "@/store/messenger/reducer";
import {
  deleteConversationNotifications,
  seenMessage,
} from "@/actions/chat.actions";
import { socket } from "@/components/Notifications";

interface Props {
  messages: Array<
    Message & {
      sender: {
        id: string;
        name: string | null;
        email: string | null;
        password: string | null;
        emailVerified: Date | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: string | null;
      };
      seen: {
        id: string;
        name: string | null;
        email: string | null;
        password: string | null;
        emailVerified: Date | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: string | null;
      }[];
    }
  >;
  conversation: Conversation;
}

const Messages: FC<Props> = ({ messages, conversation }) => {
  const dispatch = useAppDispatch();

  const isNewMessage = useAppSelector((state) => state.chat.newMessage);

  const bottom = useRef<HTMLDivElement>(null);

  const clickHandler = () => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
    dispatch(setNewMessage(null));
  };

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
    seenMessage({ conversationId: conversation.id }).then((res) => {
      if (res.ok) {
        socket.send({ type: "room-message", room: conversation.id });
      }
    });
    deleteConversationNotifications({ conversationId: conversation.id }).then(
      (res) => {},
    );
  }, [conversation.id, messages.length]);

  return (
    <div className={"relative w-full h-full overflow-auto"}>
      {/*{isNewMessage && (*/}
      {/*  <Button*/}
      {/*    onClick={clickHandler}*/}
      {/*    className="absolute right-[30px] bottom-[10px]"*/}
      {/*    size={"icon"}*/}
      {/*  >*/}
      {/*    {typeof isNewMessage === "number" ? isNewMessage : <ArrowDown />}*/}
      {/*  </Button>*/}
      {/*)}*/}
      <div className=" w-full h-full overflow-auto">
        {messages.map((message, idx) => {
          const isLastOfDay =
            idx !== messages.length - 1 &&
            message.createdAt.getDate() !==
              messages[idx + 1].createdAt.getDate();
          return (
            <>
              <MessageBox
                key={message.id}
                data={message}
                isLast={idx === messages.length - 1}
              />
              {isLastOfDay && (
                <div className={"flex justify-center my-8 font-semibold "}>
                  {messages[idx + 1].createdAt.getDate() +
                    "." +
                    (messages[idx + 1].createdAt.getMonth() + 1 < 10
                      ? "0"
                      : "") +
                    (messages[idx + 1].createdAt.getMonth() + 1) +
                    "." +
                    messages[idx + 1].createdAt.getFullYear()}
                </div>
              )}
            </>
          );
        })}
        <div ref={bottom}></div>
      </div>
    </div>
  );
};

export default Messages;
