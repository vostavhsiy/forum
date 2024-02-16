"use client";

import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function AuthSlider() {
  return (
    <Carousel
      className="w-[80%]"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent className="-ml-1">
        <CarouselItem className="pl-1">
          <div className="p-1 ">
            <Card className="h-[80vh]">
              <CardContent className="flex w-full h-full items-center justify-center p-6">
                <h2 className="text-2xl font-semibold">
                  Делись знаниями с нуждающимися!
                </h2>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem className="pl-1">
          <div className="p-1 ">
            <Card className="h-[80vh]">
              <CardContent className="flex w-full h-full items-center justify-center p-6">
                <h2 className="text-2xl font-semibold">
                  Исследуй работы однокурсников!
                </h2>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem className="pl-1">
          <div className="p-1 ">
            <Card className="h-[80vh]">
              <CardContent className="flex w-full h-full items-center justify-center p-6">
                <h2 className="text-2xl font-semibold">
                  Общайся с другими студентами!
                </h2>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
