"use client";

import { Post } from "@/app/(browse)/(home)/_components/PostCard";
import { Post as IPost, User, Prisma } from "@prisma/client";
import { FC, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface Props {
  posts: IPost[];
  user: Prisma.UserGetPayload<{
    include: {
      favourites: true;
    };
  }> | null;
}

export const HomePosts: FC<Props> = ({ posts, user }) => {
  const tl = useRef<any>();

  const screen = useRef<any>();

  useGSAP(
    () => {
      gsap.from(".posts_title", {
        opacity: 0,
        x: -200,
        scrollTrigger: ".posts_title",
      });
      tl.current = gsap.timeline().from(".post", {
        opacity: 0,
        stagger: 1,
        scrollTrigger: {
          trigger: screen.current,
          start: "-=50 top",
          end: "+=60%",
          scrub: true,
          pin: true,
        },
      });
    },
    { scope: screen.current },
  );

  return (
    <div
      ref={screen}
      className="max-w-[1130px] w-[90%] lg:w-auto min-h-screen mx-auto flex flex-col justify-center items-center gap-6 items-center mt-20"
    >
      {!!posts.length && (
        <>
          <h2 className="posts_title text-4xl font-semibold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            Популярные посты
          </h2>
          <div className="w-full flex flex-col gap-3">
            {posts.map((post) => {
              return (
                <Post
                  key={post.id}
                  post={post}
                  auth={user?.id}
                  favourite={
                    !!user?.favourites.find((fav) => fav.id === post.id)
                  }
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
