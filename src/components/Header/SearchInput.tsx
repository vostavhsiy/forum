"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Music, Users, BookAudio, Search, BookText, Hash } from "lucide-react";
import { Post, Tag, User } from "@prisma/client";
import { getUsersPage } from "@/actions/users.actions";
import { addPostView, getPostsPage, getTagsPage } from "@/actions/blog.actions";

export const SearchInput = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isPending, startTransition] = useTransition();

  const [isActive, setActive] = useState(false);

  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (search) {
      getUsersPage(0, search, 3).then((users) => {
        if (users) setUsers(users);
      });
      getPostsPage(0, search, 3).then((posts) => {
        if (posts) setPosts(posts);
      });
      getTagsPage(0, search, 3).then((tags) => {
        if (tags) setTags(tags);
      });
    } else {
      setUsers([]);
      setPosts([]);
      setTags([]);
    }
  }, [search]);

  const close = () => {
    setActive(false);
    setSearch("");
    setUsers([]);
    setPosts([]);
    setTags([]);
  };

  const submitHandler = (data: FormData) => {
    const search = data.get("search");
    if (!search) return;
    form.current?.reset();
    close();
    // startTransition(() => {
    //   searchSubmitHandler(String(search)).then((value) => {
    //     form.current?.reset();
    //     setSearch("");
    //     setActive(false);
    //     setUsers([]);
    //     setSongs([]);
    //     setPlaylists([]);
    //   });
    // });
  };

  return (
    <div className="w-max relative lg:h-[60%]">
      <Dialog
        open={isActive}
        onOpenChange={(open) => {
          if (!open) {
            close();
          }
        }}
      >
        <DialogTrigger
          asChild
          onClick={() => {
            setActive(true);
          }}
        >
          <Button
            variant="outline"
            className={"w-full flex items-center gap-4"}
          >
            <span>Поиск</span>
            <span>
              <Search size={20} />
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-0 gap-1">
          <form action={submitHandler} ref={form} className="w-full">
            <Input
              disabled={isPending}
              name={"search"}
              autoComplete={"off"}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
              }}
              placeholder="Название поста, имя пользователя..."
              className={
                "outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-[48px]"
              }
            />
          </form>
          {(!!posts.length || !!users.length || !!posts.length) && (
            <div className="p-3 flex flex-col gap-3 ">
              {!!posts.length && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-base font-semibold">Посты</h4>
                  <div className="flex flex-col gap-2">
                    {posts.map((post) => {
                      return (
                        <Link
                          key={post.id}
                          href={`/post/${post.id}`}
                          className="text-[12px] font-semibold underline"
                          onClick={async () => {
                            await addPostView(post.id);
                            close();
                          }}
                        >
                          {post.title}
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    className={
                      "text-start font-semibold text-destructive text-sm"
                    }
                    href={`/blog?search=${search}`}
                    onClick={() => {
                      close();
                    }}
                  >
                    Все результаты
                  </Link>
                </div>
              )}
              {!!users.length && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-base font-semibold">Пользователи</h4>
                  <div className="flex flex-col gap-2">
                    {users.map((user) => {
                      return (
                        <Link
                          href={`/user/${user.id}`}
                          key={user.id}
                          className="flex items-center gap-2"
                          onClick={() => {
                            close();
                          }}
                        >
                          <Image
                            src={user.image || "/logo.png"}
                            alt={"user"}
                            width={500}
                            height={500}
                            className="w-[30px] h-[30px] object-cover object-center rounded-full"
                          />
                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-semibold">
                              {user.name}
                            </h3>
                            <h4 className="text-[12px]">{user.email}</h4>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    onClick={() => {
                      close();
                    }}
                    className={
                      "text-start font-semibold text-destructive text-sm"
                    }
                    href={`/users/1?search=${search}`}
                  >
                    Все результаты
                  </Link>
                </div>
              )}
              {!!tags.length && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-base font-semibold">Теги</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {tags.map((tag) => {
                      return (
                        <Link
                          href={`/tag/${tag.id}`}
                          key={tag.id}
                          className="py-2 px-4 text-[12px] rounded-xl bg-primary text-background transition-all hover:bg-destructive hover:text-white"
                          onClick={() => {
                            close();
                          }}
                        >
                          {tag.name}
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    onClick={() => {
                      close();
                    }}
                    className={
                      "text-start font-semibold text-destructive text-sm"
                    }
                    href={`/tags/1?search=${search}`}
                  >
                    Все результаты
                  </Link>
                </div>
              )}
            </div>
          )}
          {!search && (
            <div className="p-3 flex flex-col gap-3">
              <Link
                href={"/blog"}
                className="hover:text-destructive transition-all flex items-center gap-3"
                onClick={() => {
                  close();
                }}
              >
                <BookText />
                <span>Посты</span>
              </Link>
              <Link
                href={"/users/1"}
                className="hover:text-destructive transition-all flex items-center gap-3"
                onClick={() => {
                  close();
                }}
              >
                <Users />
                <span>Пользователи</span>
              </Link>
              <Link
                href={"/tags/1"}
                className="hover:text-destructive transition-all flex items-center gap-3"
                onClick={() => {
                  close();
                }}
              >
                <Hash />
                <span>Теги</span>
              </Link>
            </div>
          )}
          {search && !posts.length && !users.length && (
            <div className="flex items-center justify-center p-2 pb-4">
              <h2>Ничего не найдено.</h2>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
