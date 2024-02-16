import Image from "next/image";
import Link from "next/link";
import { HomeSlider } from "@/app/(browse)/(home)/_components/HomeSlider";
import { getPosts } from "@/services/posts.service";
import { Post } from "@/app/(browse)/(home)/_components/PostCard";
import { cn } from "@/lib/utils";
import { Satisfy } from "next/font/google";

const satisfy = Satisfy({ subsets: ["latin"], weight: ["400"] });

export default async function Home() {
  const { posts, total } = await getPosts(0, "", 3, "new");

  return (
    <div className="relative h-full overflow-auto pt-20 flex flex-col justify-between  max-w-[100vw] lg:max-w-none">
      <Image
        src={"/bg.png"}
        alt={"bg"}
        width={1500}
        height={1500}
        className="select-none opacity-10 fixed top-0 left-0 w-full h-full object-center object-cover -z-10"
      />
      <div>
        <div className={"flex flex-col items-center gap-8"}>
          <h1 className="flex flex-col items-center justify-center gap-1">
            <span className="text-sm lg:text-xl">Форум</span>{" "}
            <span className="text-base lg:text-2xl font-semibold">
              Институт высоких технологий и пьезотехники
            </span>
          </h1>
          <div
            className={
              "flex items-center flex-wrap justify-center gap-2 w-[40%] text-[10px] lg:text-base"
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
        <div className="max-w-screen-lg w-[90%] lg:w-auto backdrop-blur-sm rounded-xl p-5 mx-auto mt-20 border-2 border-primary/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            <div className="w-full flex flex-col gap-2 p-2">
              <div className="flex items-center gap-4">
                <Image
                  src={"/home1.png"}
                  alt={"img"}
                  width={500}
                  height={500}
                  className="w-[60px] h-[60px] object-cover object-center "
                />
                <h5 className="text-lg font-semibold">Обсуждение</h5>
              </div>
              <p className="text-sm">
                Обсудите актуальные темы, связанные с учебными материалами,
                курсами, лекциями и проектами, обменяйтесь мнениями и опытом с
                другими студентами и преподавателями.
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 p-2">
              <div className="flex items-center gap-4">
                <Image
                  src={"/home2.png"}
                  alt={"img"}
                  width={500}
                  height={500}
                  className="w-[60px] h-[60px] object-cover object-center "
                />
                <h5 className="text-lg font-semibold">
                  Профессиональное развитие
                </h5>
              </div>
              <p className="text-sm">
                Получайте советы и рекомендации от опытных специалистов в
                области программирования, участвуйте в обсуждениях о карьерных
                перспективах и развитии навыков для успешной карьеры в IT.
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 p-2">
              <div className="flex items-center gap-4">
                <Image
                  src={"/home3.png"}
                  alt={"img"}
                  width={500}
                  height={500}
                  className="w-[60px] h-[60px] object-cover object-center "
                />
                <h5 className="text-lg font-semibold">
                  Проекты и соревнования
                </h5>
              </div>
              <p className="text-sm">
                Наши студенты активно участвуют в проектах и соревнованиях по
                программированию. Здесь вы можете найти партнеров для совместной
                работы над проектами, обсудить стратегии и получить обратную
                связь от сообщества.
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 p-2">
              <div className="flex items-center gap-4">
                <Image
                  src={"/home4.png"}
                  alt={"img"}
                  width={500}
                  height={500}
                  className="w-[60px] h-[60px] object-cover object-center "
                />
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
        <div className="max-w-screen-lg w-[90%] lg:w-auto mx-auto flex flex-col gap-6 items-center mt-10">
          {!posts.length && (
            <>
              <h2 className="font-semibold">Команда</h2>
              <div className="w-full flex justify-center">
                <HomeSlider />
              </div>
            </>
          )}
          {!!posts.length && (
            <>
              <h2 className="font-semibold">Последние несколько постов</h2>
              <div className="w-full flex flex-col gap-3">
                {posts.map((post) => {
                  return <Post key={post.id} post={post} />;
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <footer
        className={"mt-[100px] py-4 bg-background border-t-2 border-primary/20"}
      >
        <div
          className={
            "max-w-screen-lg mx-auto flex items-center justify-between px-4 lg:p-0"
          }
        >
          <Link href={"/"} className="flex items-center gap-6">
            <Image
              src={"/logo.png"}
              alt={"logo"}
              width={500}
              height={500}
              className={
                "w-[40px] h-[40px] object-cover object-center rounded-full border-2"
              }
            />
            <h1 className={cn(satisfy.className, "text-base lg:text-2xl")}>
              Ararat Team
            </h1>
          </Link>
          <h5 className="text-sm lg:text-base">© Все права защищены.</h5>
        </div>
      </footer>
    </div>
  );
}
