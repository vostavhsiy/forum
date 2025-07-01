"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { ContactsLinks } from "@/components/ContactsLinks";
import { HomeContactsForm } from "@/app/(browse)/(home)/_components/HomeContacts/HomeContactsForm";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export const HomeContacts = () => {
  const screen = useRef<any>();

  useGSAP(
    () => {
      screen.current &&
        gsap.from(".ball", {
          scale: 0,
          stagger: 0.2,
          scrollTrigger: { trigger: ".ball" },
        });
    },
    { scope: screen.current },
  );

  return (
    <div
      ref={screen}
      className={"pt-20 max-w-[1450px] mx-auto overflow-hidden"}
    >
      <h3 className={"text-center mb-6 text-4xl font-semibold text-primary"}>
        Контакты
      </h3>
      <div
        className={
          "flex items-stretch p-3 rounded-xl border-2 text-background bg-white dark:bg-transparent"
        }
      >
        <div
          className={
            "relative overflow-hidden w-2/5 bg-gradient-to-r from-cyan-500 to-blue-500 dark:bg-primary px-6 py-8 rounded-xl"
          }
        >
          <h3 className={"mb-3 text-2xl font-semibold"}>
            Контактная информация
          </h3>
          <p className={"mb-32 text-lg text-background/80"}>
            Вы можете связаться с нами по любым вопросам!
          </p>
          <div className={"mb-32 flex flex-col gap-5 font-semibold"}>
            <a href={"tel:+77777777777"} className={"flex items-center gap-4"}>
              <Phone />
              <span>+7 863 243 48 11</span>
            </a>
            <a
              href={"mailto:ivtipt@sfedu.ru"}
              className={"flex items-center gap-4"}
            >
              <Mail />
              <span>ivtipt@sfedu.ru</span>
            </a>
            <div className={"flex items-center gap-4"}>
              <MapPin />
              <span>г. Ростов-на-Дону, ул. Мильчакова, 10</span>
            </div>
          </div>
          <ContactsLinks />
          <div
            className={
              "ball absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 w-[60%] aspect-square rounded-full bg-black/20"
            }
          ></div>
          <div
            className={
              "ball absolute right-0 bottom-0 -translate-x-1/2 -translate-y-1/3 w-[25%] aspect-square rounded-full bg-black/30"
            }
          ></div>
        </div>
        <div className={"w-3/5 px-16 pt-10"}>
          <HomeContactsForm />
        </div>
      </div>
    </div>
  );
};
