"use client";

import { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Post } from "./post";
import { IPost } from "@/types/IPost";
import { User } from "@prisma/client";

interface Props {
  search?: string;
  filter?: string;
  size?: number;
  user?: (User & { favourites: IPost[] }) | null;
}

const Posts: FC<Props> = ({ search, size, filter, user }) => {
  const [page, setPage] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [total, setTotal] = useState(0);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [add, setAdd] = useState(false);

  useEffect(() => {
    setPage(0);
    setTotal(0);
    setPosts([]);
    setFetching(true);
  }, [filter, search]);

  useEffect(() => {
    setAdd(true);
    if (add && fetching) {
      axios
        .post(`api/blog/posts`, { page, search, size: 10, filter })
        .then((res) => {
          const { ok, posts, total, error } = res.data;
          if (error) {
            toast.error(error);
          } else {
            setTotal(total);
            setPage((prev) => prev + 1);
            setPosts((prev) => [...prev, ...posts]);
          }
          setFetching(false);
        });
    }
  }, [add, fetching]);

  useEffect(() => {
    document
      .querySelector(".main-layout")
      ?.removeEventListener("scroll", scrollHandler);
    document
      .querySelector(".main-layout")
      ?.addEventListener("scroll", scrollHandler);
    return () => {
      document
        .querySelector(".main-layout")
        ?.removeEventListener("scroll", scrollHandler);
    };
  }, [total, posts]);

  const scrollHandler = useCallback(
    (event: any) => {
      if (
        event.target.scrollHeight -
          (event.target.scrollTop + window.innerHeight) <
        100
      ) {
        if (posts.length < total) {
          setFetching(true);
        } else {
          setFetching(false);
        }
      }
    },
    [total, posts],
  );

  return (
    <div>
      {fetching && <h2>Загрузка...</h2>}
      <div className="flex flex-col gap-6">
        {posts.map((post) => {
          return (
            <Post
              key={post.id}
              post={post}
              auth={user?.id}
              inBlog
              favourite={
                !!user?.favourites.find((fav: IPost) => fav.id === post.id)
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export { Posts };
