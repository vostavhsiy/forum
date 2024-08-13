"use client";

import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import styles from "../home.module.scss";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Background } from "@/app/(browse)/(home)/_components/background";
import { HomeAdvantages } from "@/app/(browse)/(home)/_components/HomeAdvantages";

export const HomeContent = () => {
  const tl = useRef<any>();

  const firstScreen = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    tl.current = gsap
      .timeline()
      .fromTo(
        firstScreen.current,
        {
          opacity: 0,
          scale: 0,
        },
        {
          opacity: 1,
          scale: 1,
        },
      )
      .to(firstScreen.current, {
        opacity: 0.1,
      })
      .fromTo(
        ".main_text",
        {
          opacity: 0,
          x: (index) => (index % 2 === 0 ? 200 : -200),
        },
        {
          opacity: 1,
          x: 0,
          stagger: 0.5,
        },
      )
      .fromTo(
        ".intro_text",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
        },
      )
      .to(".main_text", {
        y: (index) => {
          return index * -70;
        },
        scrollTrigger: {
          scrub: true,
        },
      })
      .fromTo(
        ".intro_parallax",
        {
          y: 0,
        },
        {
          y: -100,
          scrollTrigger: {
            scrub: true,
          },
        },
      )
      .from(".intro_bottom", {
        width: 0,
        scrollTrigger: {
          scrub: true,
        },
      })
      .fromTo(
        firstScreen.current,
        {
          opacity: 0.1,
        },
        {
          opacity: 1,
          scrollTrigger: {
            start: 0,
            end: "max",
            scrub: true,
          },
        },
      );
  });

  return (
    <>
      <div
        className={
          "relative max-w-[1920px] min-h-screen overflow-hidden mx-auto w-full flex flex-col items-center justify-center gap-12 h-screen max-h-[1000px] px-10"
        }
      >
        <div
          ref={firstScreen}
          className={"absolute top-0 left-0 w-full h-full"}
        >
          <Background />
        </div>
        <h1 className={"flex flex-col items-center text-8xl gap-6"}>
          <span className={cn("main_text text-black", styles.first)}>
            факультет
          </span>
          <span className={cn("main_text", styles.main_text)}>высоких</span>
          <span
            className={cn(
              "main_text text-black",
              styles.third,
              styles.main_text,
            )}
          >
            технологий
          </span>
        </h1>
        <div
          className={
            "intro_text w-full flex flex-col items-center gap-4 intro_parallax"
          }
        >
          <h2 className="flex flex-col items-center justify-center gap-1">
            <span className="text-base lg:text-2xl font-semibold">Форум</span>{" "}
            <span className="text-sm lg:text-xl text-center">
              Институт высоких технологий и пьезотехники
            </span>
          </h2>
          <div
            className={
              "flex items-center flex-wrap justify-center gap-4 w-[40%] text-[10px] lg:text-base"
            }
          >
            <Link
              className="py-1 px-4 bg-primary border-2 border-primary text-background rounded-2xl hover:bg-background hover:text-primary hover:border-primary transition-all"
              href={"https://sfedu.ru/"}
              target={"_blank"}
            >
              Южный федеральный
            </Link>
            <Link
              href={"https://ivtipt.ru/"}
              className="py-1 px-4 bg-primary border-2 border-primary text-background rounded-2xl hover:bg-background hover:text-primary hover:border-primary transition-all"
              target={"_blank"}
            >
              Сайт факультета
            </Link>
          </div>
        </div>
      </div>
      <div className={"intro_bottom h-[2px] bg-primary"}></div>
      <HomeAdvantages />
    </>
  );
};
