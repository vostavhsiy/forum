"use client";

import io from "socket.io-client";
import { FC, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  receiveNewMessage,
  receiveNewNotification,
} from "@/actions/chat.actions";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setNewMessage } from "@/store/messenger/reducer";

export const socket = io("https://main--ephemeral-palmier-8b476b.netlify.app/");

const Notifications: FC<{ id: string }> = ({ id }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    socket.send({
      type: "connection",
      data: id,
    });
  }, []);

  const listener = useCallback(
    (message: any) => {
      if (message.messenger) {
        receiveNewMessage().then((res) => {
          console.log(pathname);
          if (pathname.includes(`/messenger/${message.room}`)) {
            dispatch(setNewMessage(1));
          } else {
            toast.info(message.data, { id: message.data });
          }
        });
      } else {
        receiveNewNotification().then((res) => {
          toast.info(message.data, { id: message.data });
        });
      }
    },
    [pathname],
  );

  useEffect(() => {
    socket.removeAllListeners("message");
    socket.on("message", listener);
  }, [pathname]);

  return null;
};

export { Notifications };
