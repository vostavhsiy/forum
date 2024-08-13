import { NextPage } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/actions/auth.actions";
import { CreateCommentForm } from "@/app/(browse)/(main)/post/[id]/_components/createCommentForm";
import { Comment } from "@/app/(browse)/(main)/post/[id]/_components/comment";
import { CreateReportForm } from "@/app/(browse)/(main)/post/[id]/_components/CreateReportForm";
import { getPostForPostPage } from "@/services/posts.service";
import { ends } from "@/lib/word-ends";
import { addPostView } from "@/actions/blog.actions";

import { EditPostForm } from "@/app/(browse)/(admin)/admin/posts/[page]/_components/EditPost";
import { DeleteButton } from "@/app/(browse)/(main)/post/[id]/_components/DeleteButton";
import { ImageWithFallback } from "@/components/FallbackImage";
import { PostText } from "@/app/(browse)/(main)/post/[id]/_components/PostText";
import { Eye } from "lucide-react";
import Link from "next/link";

interface Props {
  params: {
    id: string;
  };
}

const PostPage: NextPage<Props> = async ({ params }) => {
  const user = await auth();

  const post = await getPostForPostPage(params.id);
  if (!post) {
    return notFound();
  }

  await addPostView(post.id);

  const text = post.text
    .split(/\r\n|\r|\n/g)
    .map((p) => (p ? p : "<br/><br/>"))
    .reduce((acc, elem) => {
      if (
        !elem.includes("<br/>") &&
        !acc.slice(-"<br/><br/>".length).includes("<br/>")
      )
        acc += "<br/>";
      acc += elem;
      return acc;
    });

  return (
    <div className="relative p-10 pt-12 mb-[100px] flex flex-col gap-10">
      <div
        className={
          "fixed top-[4.4rem] left-[50%] -translate-x-1/2 w-full max-w-[1300px] px-4 flex items-center justify-end gap-2 text-[10px] lg:text-sm font-semibold"
        }
      >
        {user &&
          (["admin", "editor"].includes(user.role) ||
            post.userId === user.id) && <EditPostForm post={post} />}
        {user && <CreateReportForm post={post} />}
        {user && ["admin", "editor"].includes(user.role) && (
          <DeleteButton post={post} user={user} />
        )}
      </div>
      <div className="flex flex-col gap-8">
        {post.image && (
          <div className="w-full flex justify-center items-center">
            <ImageWithFallback
              src={post.image}
              fallback={"/image404.jpg"}
              alt={"post"}
              width={1000}
              height={1000}
              className={
                "max-w-[100%] aspect-video object-cover object-center min-w-[50%]"
              }
            />
          </div>
        )}
        <h1 className="text-xl font-semibold">{post.title}</h1>
        <PostText text={text} />
        <Link
          href={`/user/${post.author.id}`}
          className="flex items-center gap-5"
        >
          <ImageWithFallback
            src={post.author.image || "/user.png"}
            alt={"user"}
            width={500}
            height={500}
            className="w-[60px] h-[60px] object-cover object-center rounded-full border-2"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold">{post.author.name}</h3>
            <h3 className="text-sm text-zinc-600">{post.author.email}</h3>
          </div>
        </Link>
        <div className={"flex flex-col gap-8"}>
          <span className={"text-lg font-semibold"}>
            {new Date(post.createdAt).toLocaleString()}
          </span>
          <div className={"flex items-center gap-2"}>
            <Eye />
            <span>
              {post.views}{" "}
              {ends(post.views, ["просмотр", "просмотра", "просмотров"])}
            </span>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-4">
          {post.tags.map((tag) => {
            return (
              <Link
                key={tag.id}
                href={`/tag/${tag.id}`}
                className="text-[12px] bg-primary text-background py-1 px-4 rounded-xl transition-all hover:text-white hover:bg-destructive"
              >
                {tag.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {user && (
          <div className={"flex flex-col gap-3"}>
            <h3 className={"text-base font-semibold"}>Оставьте комментарий</h3>
            <CreateCommentForm postId={post.id} />
          </div>
        )}
        <h2 className={"text-xl font-semibold"}>Комментарии</h2>
        <div className="flex flex-col gap-5">
          {!!post.comments.length ? (
            post.comments.map((comment) => {
              return (
                <Comment
                  key={comment.id}
                  comment={comment}
                  user={user as any}
                />
              );
            })
          ) : (
            <h2 className="text-destructive">Пока пусто!</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
