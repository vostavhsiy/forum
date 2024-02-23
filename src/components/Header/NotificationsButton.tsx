"use client";

import React, { FC, useEffect, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Notification, User } from "@prisma/client";
import {
  deleteUserNotifications,
  seeUserNotifications,
} from "@/actions/users.actions";
import Link from "next/link";

interface Props {
  nots?: Notification[];
  authUser: User;
}

const NotificationsButton: FC<Props> = ({ nots, authUser }) => {
  const notExpiredNots = useMemo(() => {
    return nots?.filter((not) =>
      not.expires ? not.expires.getTime() > Date.now() : false,
    );
  }, [nots]);

  useEffect(() => {
    deleteUserNotifications({ userId: authUser.id }).then((res) => {});
  }, []);

  return (
    <div>
      <Popover
        onOpenChange={async (open) => {
          if (open && nots?.length) {
            await seeUserNotifications({ userId: authUser.id });
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button className={"relative"} size={"icon"} variant={"outline"}>
            <Bell />
            {!!nots?.filter((not) => !not.seen).length && (
              <span
                className={
                  "absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-sm"
                }
              >
                {nots.filter((not) => !not.seen).length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={"max-h-[300px] min-w-[350px] overflow-auto"}>
          {!!notExpiredNots?.length ? (
            <div className={"flex flex-col gap-3"}>
              {notExpiredNots?.map((not) => {
                if (not.link) {
                  return (
                    <Link
                      href={not.link}
                      className="cursor-pointer hover:underline"
                    >
                      {not.text}
                    </Link>
                  );
                }
                return <div key={not.id}>{not.text}</div>;
              })}
            </div>
          ) : (
            <h2 className="text-center text-destructive">Пока пусто!</h2>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { NotificationsButton };
