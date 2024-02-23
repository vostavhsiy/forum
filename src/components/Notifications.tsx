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
import Link from "next/link";

export const socket = io(String(process.env.NEXT_PUBLIC_SOCKET_URL));

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
          if (pathname.includes(`/messenger/${message.room}`)) {
            dispatch(setNewMessage(1));
          } else {
            toast.info(message.data, { id: message.data });
          }
        });
      } else {
        receiveNewNotification().then((res) => {
          toast.info(
            message.link ? (
              <Link href={message.link}>{message.data}</Link>
            ) : (
              message.data
            ),
            { id: message.data },
          );
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
