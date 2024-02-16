"use client";

import { FC, useEffect } from "react";
import { socket } from "@/components/Notifications";
import { receiveNewMessage } from "@/actions/chat.actions";
import { Conversation } from "@prisma/client";

interface Props {
  conversation: Conversation;
  onReceiveMessage?: Function;
}

const MessageHandler: FC<Props> = ({ conversation, onReceiveMessage }) => {
  useEffect(() => {
    socket.send({ room: conversation.id, type: "join-room" });
    socket.on("room-message", (message) => {
      receiveNewMessage().then(() => {
        onReceiveMessage && onReceiveMessage(message);
      });
    });

    return () => {
      socket.send({ room: conversation.id, type: "leave-room" });
    };
  }, []);

  return null;
};

export { MessageHandler };
