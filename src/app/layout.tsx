import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/Header/header";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Notifications } from "@/components/Notifications";
import { auth } from "@/actions/auth.actions";
import Link from "next/link";
import { Cog } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Форум ИВТиПТ ЮФУ",
  description: "Форум Института Высоких технологий и пьезотехники ЮФУ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await auth();

  return (
    <html lang="ru">
      <body
        className={cn(
          inter.className,
          "text-primary bg-gray-100 dark:bg-neutral-900",
        )}
      >
        <Providers>
          <Header />
          <main>
            {!user?.banned ? (
              children
            ) : (
              <div
                className={
                  "h-full flex items-center justify-center font-semibold text-destructive dark:text-primary text-3xl"
                }
              >
                Данный аккаунт забанен!
              </div>
            )}
          </main>
          {!user?.banned && (
            <>
              <Toaster closeButton={true} richColors={true} duration={2000} />
              {user && <Notifications id={user.id} />}
            </>
          )}
          {user && ["admin", "editor"].includes(user.role) && (
            <a
              href={"/admin"}
              className={
                "fixed bottom-4 left-4 w-[50px] aspect-square flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 text-white"
              }
            >
              <Cog />
            </a>
          )}
        </Providers>
      </body>
    </html>
  );
}
