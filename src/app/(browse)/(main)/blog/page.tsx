import { Posts } from "@/app/(browse)/(main)/blog/_components/posts";
import { NextPage } from "next";
import { Filter } from "@/app/(browse)/(main)/blog/_components/filter";
import { auth } from "@/actions/auth.actions";
import { Loader } from "@/components/Loader";

interface Props {
  searchParams: {
    filter?: "views" | "old" | "new";
    search?: string;
  };
}

const BlogPage: NextPage<Props> = async ({ searchParams }) => {
  const user = await auth();

  const filter = searchParams.filter;

  return (
    <div className="mb-[40px] flex flex-col gap-4 p-10 pt-8">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-lg font-semibold">Посты</h1>
        <div>
          <Filter filter={filter} />
        </div>
      </div>
      <Posts search={searchParams.search} filter={filter} user={user as any} />
    </div>
  );
};

export default BlogPage;
