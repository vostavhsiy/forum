import React from "react";
import { NextPage } from "next";
import { Pagination } from "@/components/Pagination";
import { Post } from "@/app/(browse)/(main)/blog/_components/post";
import { auth } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { getPosts } from "@/services/posts.service";

interface Props {
  params: {
    page: string;
  };
  searchParams: {
    search: string;
    size: string;
  };
}

const AdminPostsPage: NextPage<Props> = async ({ params, searchParams }) => {
  const user = await auth();

  const page = params.page ? +params.page - 1 : 0;
  const size = +(searchParams.size || 8);

  const { posts, total } = await getPosts(page, searchParams.search, size);

  if (!posts.length && page > 0) {
    return redirect(
      `/admin/posts/${page}?${searchParams.search ? `search=${searchParams.search}` : ""}`,
    );
  }

  const searchHandler = async (data: FormData) => {
    "use server";
    const search = data.get("search");
    if (!search) return redirect(`/admin/posts/1`);
    return redirect(`/admin/posts/1?search=${search}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-semibold">Посты</h1>
      <form action={searchHandler} className="flex items-center gap-2 w-1/2">
        <Input name={"search"} placeholder={"Поиск"} />
        <Button type={"submit"}>
          <Search />
        </Button>
      </form>
      {!!posts.length ? (
        <>
          {" "}
          <div className="flex flex-col gap-5">
            {posts.map((post) => {
              return (
                <Post
                  key={post.id}
                  post={post}
                  auth={user?.id}
                  favourite={
                    !!user?.favourites.find((fav) => fav.id === post.id)
                  }
                  inAdminPanel
                />
              );
            })}
          </div>
          <Pagination
            page={page + 1}
            size={size}
            total={total}
            baseLink={"/admin/posts"}
          />
        </>
      ) : (
        <h2 className="text-destructive">Пока пусто!</h2>
      )}
    </div>
  );
};

export default AdminPostsPage;
