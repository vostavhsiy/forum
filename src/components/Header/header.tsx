import { Nav } from "@/components/Header/nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileButton } from "@/components/ProfileButton";
import { SignOutButton } from "@/components/SignOutButton";
import Image from "next/image";
import { Satisfy } from "next/font/google";
import { cn } from "@/lib/utils";
import { auth } from "@/actions/auth.actions";
import { Bell } from "lucide-react";
import { NotificationsButton } from "@/components/Header/NotificationsButton";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { Loader } from "@/components/Loader";
import { LoaderLink } from "@/components/LoaderLink";

const satisfy = Satisfy({ subsets: ["latin"], weight: ["400"] });

export const Header = async () => {
  const user = await auth();

  const messageNots = user?.notifications.filter(
    (not) => not.type === "message",
  );

  const otherNots = user?.notifications.filter((not) => not.type !== "message");

  return (
    <header className="relative z-50 w-full bg-background border-b-2 flex items-center border-b-border px-4">
      {(user?.role === "admin" || user?.role === "editor") && !user.banned && (
        <Button
          className={
            "hidden lg:block absolute top-0 right-0 text-[12px] h-[30px] rounded-t-none rounded-br-none"
          }
          asChild
        >
          <LoaderLink href={"/admin"}>Панель</LoaderLink>
        </Button>
      )}
      <div className="w-full lg:w-3/4 mx-auto flex items-center justify-between">
        <LoaderLink href={"/"} className="flex items-center gap-6">
          <Image
            src={"/logo.png"}
            alt={"logo"}
            width={500}
            height={500}
            className={
              "w-[40px] h-[40px] object-cover object-center rounded-full border-2"
            }
          />
          <h1 className={cn(satisfy.className, "text-2xl hidden lg:block")}>
            Ararat Team
          </h1>
        </LoaderLink>
        <div className="flex items-center gap-3 lg:gap-16">
          {!user?.banned && <Nav isAuth={!!user} messageNots={messageNots} />}
          {!user?.banned && user?.notifications && (
            <NotificationsButton authUser={user} nots={otherNots} />
          )}
          {user?.email ? (
            <div className="flex items-center gap-3">
              <SignOutButton variant={"outline"} />
              <ProfileButton />
            </div>
          ) : (
            <Button asChild variant={"outline"}>
              <LoaderLink href={"/login"}>Войти</LoaderLink>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
