import { NextPage } from "next";
import { prisma } from "@/lib/prisma";
import { UserCard } from "@/app/(browse)/(main)/users/[page]/_components/UserCard";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { Pagination } from "@/components/Pagination";
import Link from "next/link";
import { getTags } from "@/services/tags.service";
import { auth } from "@/actions/auth.actions";
import { LoaderLink } from "@/components/LoaderLink";

interface Props {
  params: {
    page: string;
  };
  searchParams: {
    search: string;
    size: string;
  };
}

const TagsPage: NextPage<Props> = async ({ params, searchParams }) => {
  const user = await auth();
  const page = params.page ? +params.page - 1 : 0;
  const size = +(searchParams.size || 30);

  const { tags, total } = await getTags(
    page,
    searchParams.search,
    size,
    "name",
  );

  if (!tags) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-semibold">Теги</h1>
      {!!tags.length ? (
        <div className="flex items-center flex-wrap gap-5">
          {tags.map((tag) => {
            return (
              <LoaderLink
                key={tag.id}
                href={`/tag/${tag.id}`}
                className="py-2 px-4 bg-primary text-background transition-all hover:bg-destructive rounded-full"
              >
                {tag.name}
              </LoaderLink>
            );
          })}
        </div>
      ) : (
        <h2 className="text-destructive">Пока пусто!</h2>
      )}
      <Pagination
        page={page + 1}
        size={size}
        total={total}
        baseLink={"/tags"}
      />
    </div>
  );
};

export default TagsPage;
