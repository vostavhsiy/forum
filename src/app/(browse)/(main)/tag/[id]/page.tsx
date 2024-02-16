import React from "react";
import { NextPage } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { redirect } from "next/navigation";
import { Post } from "@/app/(browse)/(main)/blog/_components/post";
import { Pagination } from "@/components/Pagination";
import { getTagById } from "@/services/tags.service";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    page: string;
    size: string;
  };
}

const TagPage: NextPage<Props> = async ({ params, searchParams }) => {
  const page = searchParams.page ? +searchParams.page - 1 : 0;
  const size = +(searchParams.size || 5);

  const tag = await getTagById(params.id);

  if (!tag) {
    redirect("/tags/1");
  }

  const session = await getServerSession(authConfig);

  const user = session?.user
    ? await prisma.user.findUnique({
        where: {
          id: session?.user.id,
        },
        include: {
          favourites: true,
        },
      })
    : null;

  const posts = await prisma.post.findMany({
    where: {
      tags: {
        some: {
          id: params.id,
        },
      },
    },
    include: {
      author: true,
      tags: true,
    },
    skip: page * size,
    take: size,
    orderBy: {
      views: "desc",
    },
  });

  const total = await prisma.post.count({
    where: {
      tags: {
        some: {
          id: params.id,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 p-5 mb-[100px]">
      <h1 className="text-lg font-semibold">
        Посты с тегом <span className="font-bold">{tag.name}</span>
      </h1>
      {!!posts.length ? (
        <div className="flex flex-col gap-6">
          {posts.map((post) => {
            return (
              <Post
                key={post.id}
                post={post}
                auth={user?.id}
                favourite={!!user?.favourites.find((fav) => fav.id === post.id)}
              />
            );
          })}
        </div>
      ) : (
        <h2 className={"text-destructive"}>Пока пусто!</h2>
      )}
      <Pagination
        page={page + 1}
        size={size}
        total={total}
        baseLink={`/tag/${tag.id}`}
        isQuery
      />
    </div>
  );
};

export default TagPage;
