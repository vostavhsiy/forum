"use client";

import io from "socket.io-client";
import { FC, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  receiveNewMessage,
  receiveNewNotification,
} from "@/actions/chat.actions";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setNewMessage } from "@/store/messenger/reducer";
import Link from "next/link";
import { Player } from "@/lib/audio";

export const socket = io(String(process.env.NEXT_PUBLIC_SOCKET_URL));

const Notifications: FC<{ id: string }> = ({ id }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  // const player = useAppSelector((state) => state.service.player);

  const [player, setPlayer] = useState(new Player());

  useEffect(() => {
    // dispatch(setPlayer(new Player()));
    socket.send({
      type: "connection",
      data: id,
    });
  }, []);

  const listener = useCallback(
    (message: any) => {
      if (message.messenger) {
        receiveNewMessage().then((res) => {
          //if (pathname.includes(`/messenger/${message.room}`)) {
          if (pathname.includes(`/messenger`)) {
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
      player?.play();
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
