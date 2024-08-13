"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export const HomeAdvantages = () => {
  const tl = useRef<any>();
  const pinScreen = useRef<any>();

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      tl.current = gsap
        .timeline()
        .from(".advantage", {
          opacity: 0,
          stagger: 1,
          ease: "power1.in",
          scrollTrigger: {
            trigger: pinScreen.current,
            pin: true,
            scrub: true,
            start: "top",
          },
        })
        .from(".advantage_bg", {
          opacity: 0,
          scrollTrigger: {
            scrub: true,
          },
        });
    },
    { scope: pinScreen.current },
  );

  return (
    <div
      ref={pinScreen}
      className={"relative h-screen flex items-center overflow-hidden"}
    >
      <div className="advantage_bg absolute w-full h-full top-0 left-0 bg-gradient-to-r from-cyan-300 to-indigo-600 opacity-80"></div>
      <div className="advantage_items max-w-[1450px] mx-auto flex gap-x-12 gap-y-8">
        <div className="advantage w-full flex flex-col gap-2 p-5 backdrop-blur-sm rounded-xl border-2 border-primary/20">
          <div className="flex items-center gap-4">
            <p className={"text-4xl font-black italic"}>1.</p>
            <h5 className="text-lg font-semibold">Обсуждение</h5>
          </div>
          <p className="text-sm">
            Обсудите актуальные темы, связанные с учебными материалами, курсами,
            лекциями и проектами, обменяйтесь мнениями и опытом с другими
            студентами и преподавателями.
          </p>
        </div>
        <div className="advantage w-full flex flex-col gap-2 p-5 backdrop-blur-sm rounded-xl border-2 border-primary/20">
          <div className="flex items-center gap-4">
            <p className={"text-4xl font-black italic"}>2.</p>
            <h5 className="text-lg font-semibold">Развитие</h5>
          </div>
          <p className="text-sm">
            Получайте советы и рекомендации от опытных специалистов в области
            программирования, участвуйте в обсуждениях о карьерных перспективах
            и развитии навыков для успешной карьеры в IT.
          </p>
        </div>
        <div className="advantage w-full flex flex-col gap-2 p-5 backdrop-blur-sm rounded-xl border-2 border-primary/20">
          <div className="flex items-center gap-4">
            <p className={"text-4xl font-black italic"}>3.</p>
            <h5 className="text-lg font-semibold">Проекты и соревнования</h5>
          </div>
          <p className="text-sm">
            Наши студенты активно участвуют в проектах и соревнованиях по
            программированию. Здесь вы можете найти партнеров для совместной
            работы над проектами, обсудить стратегии и получить обратную связь
            от сообщества.
          </p>
        </div>
        <div className="advantage w-full flex flex-col gap-2 p-5 backdrop-blur-sm rounded-xl border-2 border-primary/20">
          <div className="flex items-center gap-4">
            <p className={"text-4xl font-black italic"}>4.</p>
            <h5 className="text-lg font-semibold">Поддержка и обучение</h5>
          </div>
          <p className="text-sm">
            Наше дружелюбное и заботливое сообщество готово помочь вам с
            решением проблем, дать совет или просто поддержать ваши усилия в
            изучении программирования.
          </p>
        </div>
      </div>
    </div>
  );
};
