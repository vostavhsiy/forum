import { Nav } from "@/components/Header/nav";
import { Button } from "@/components/ui/button";
import { ProfileButton } from "@/components/ProfileButton";
import { SignOutButton } from "@/components/SignOutButton";
import Image from "next/image";
import { Oswald } from "next/font/google";
import { cn } from "@/lib/utils";
import { auth } from "@/actions/auth.actions";
import { NotificationsButton } from "@/components/Header/NotificationsButton";

import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import styles from "./header.module.scss";
import Link from "next/link";

const oswald = Oswald({ subsets: ["cyrillic"], weight: ["400", "600", "700"] });

export const Header = async () => {
  const user = await auth();

  const messageNots = user?.notifications.filter(
    (not) => not.type === "message",
  );

  const otherNots = user?.notifications.filter((not) => not.type !== "message");

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-background/70 backdrop-blur flex items-center px-4 py-2 shadow-lg">
      <div className="max-w-[1130px] w-full lg:w-3/4 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-8">
          <a
            href={"/"}
            className={cn("flex items-center gap-6", styles.logo_link)}
          >
            <Image
              src={"/logo.png"}
              alt={"logo"}
              width={500}
              height={500}
              className={
                "w-[40px] aspect-square bg-white object-cover object-center rounded-full border-2"
              }
            />
            <h1 className={cn(oswald.className, "text-3xl hidden lg:block")}>
              ИВТиПТ
            </h1>
          </a>
          {!user?.banned && <Nav isAuth={!!user} messageNots={messageNots} />}
        </div>
        <div className={"flex items-center gap-2 lg:gap-5"}>
          {user?.email ? (
            <div className="flex items-center gap-3">
              <ThemeToggleButton />
              {!user?.banned && user?.notifications && (
                <NotificationsButton authUser={user} nots={otherNots} />
              )}
              <ProfileButton />
              <SignOutButton variant={"outline"} />
            </div>
          ) : (
            <>
              {" "}
              <ThemeToggleButton />{" "}
              <Button asChild variant={"outline"}>
                <Link href={"/login"}>Войти</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
