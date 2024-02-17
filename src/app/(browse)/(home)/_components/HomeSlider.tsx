"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export function HomeSlider() {
  return (
    <Carousel className="w-[70%]">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex items-start gap-12 py-6 px-12">
                  <Image
                    src={"/team/1.png"}
                    width={500}
                    height={1000}
                    alt={"user"}
                    className="w-1/3 h-auto object-cover object-center rounded-xl"
                  />
                  <div className={"flex flex-col gap-2 pt-12"}>
                    <h2 className="text-xl font-semibold">
                      Атоян Роберт Ашотович
                    </h2>
                    <h3 className="text-sm text-zinc-600">atoian@sfedu.ru</h3>
                    <h5 className="text-sm">
                      09.03.03 Прикладная информатика, группа 2.9
                    </h5>
                    <h4 className="text-sm font-bold py-1 px-4 rounded-2xl bg-primary text-background w-max mt-3">
                      Разработчик
                    </h4>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
