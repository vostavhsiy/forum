import React from "react";
import { prisma } from "@/lib/prisma";
import { NextPage } from "next";
import { UserCard } from "@/app/(browse)/(main)/users/[page]/_components/UserCard";
import { Pagination } from "@/components/Pagination";
import { auth } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { TagCard } from "@/app/(browse)/(admin)/admin/tags/[page]/_components/TagCard";
import { CreateTagForm } from "@/app/(browse)/(admin)/admin/tags/[page]/_components/CreateTagForm";
import { getTags } from "@/services/tags.service";

interface Props {
  params: {
    page: string;
  };
  searchParams: {
    search: string;
    size: string;
  };
}

const AdminTagsPage: NextPage<Props> = async ({ params, searchParams }) => {
  const user = await auth();

  const page = params.page ? +params.page - 1 : 0;
  const size = +(searchParams.size || 20);

  const { tags, total } = await getTags(page, searchParams.search, size);

  if (!tags.length && page > 0) {
    return redirect(
      `/admin/tags/${page}?${searchParams.search ? `search=${searchParams.search}` : ""}`,
    );
  }

  const searchHandler = async (data: FormData) => {
    "use server";
    const search = data.get("search");
    if (!search) return redirect(`/admin/tags/1`);
    return redirect(`/admin/tags/1?search=${search}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-semibold">Теги</h1>
      <div className={"flex items-center gap-8"}>
        <form action={searchHandler} className="flex items-center gap-2 w-1/2">
          <Input name={"search"} placeholder={"Поиск"} />
          <Button type={"submit"}>
            <Search />
          </Button>
        </form>
        <CreateTagForm />
      </div>
      {!!tags.length ? (
        <>
          <div className="flex gap-8 flex-wrap items-center">
            {tags.map((tag) => {
              return <TagCard key={tag.id} tag={tag} />;
            })}
          </div>
          <Pagination
            page={page + 1}
            size={size}
            total={total}
            baseLink={"admin/tags"}
            search={searchParams.search}
          />
        </>
      ) : (
        <h2 className="text-destructive">Пока пусто!</h2>
      )}
    </div>
  );
};

export default AdminTagsPage;
