import { NextPage } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/actions/auth.actions";
import { CreateCommentForm } from "@/app/(browse)/(main)/post/[id]/_components/createCommentForm";
import { Comment } from "@/app/(browse)/(main)/post/[id]/_components/comment";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { CreateReportForm } from "@/app/(browse)/(main)/post/[id]/_components/CreateReportForm";
import { getPostForPostPage } from "@/services/posts.service";
import { ends } from "@/lib/word-ends";
import { addPostView } from "@/actions/blog.actions";
import { LoaderLink } from "@/components/LoaderLink";
import { EditPostForm } from "@/app/(browse)/(admin)/admin/posts/[page]/_components/EditPost";
import { DeleteButton } from "@/app/(browse)/(main)/post/[id]/_components/DeleteButton";

interface Props {
  params: {
    id: string;
  };
}

const PostPage: NextPage<Props> = async ({ params }) => {
  const user = await auth();

  const post = await getPostForPostPage(params.id);
  if (!post) {
    redirect("/blog");
  }

  await addPostView(post.id);

  return (
    <div className="relative p-4 pt-12 mb-[100px] flex flex-col gap-10">
      <div
        className={
          "absolute top-[10px] right-[10px] flex items-center gap-8 text-[10px] lg:text-sm font-semibold"
        }
      >
        {user && ["admin", "editor"].includes(user.role) && (
          <EditPostForm post={post} />
        )}
        {user && ["admin", "editor"].includes(user.role) && (
          <DeleteButton post={post} user={user} />
        )}
        {user && <CreateReportForm post={post} />}
        <div className={"flex items-center gap-2"}>
          <span>
            {post.views}{" "}
            {ends(post.views, ["просмотр", "просмотра", "просмотров"])}
          </span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-6">
        <h1 className="text-xl font-semibold">{post.title}</h1>
        {post.image && (
          <div className="w-full flex justify-center items-center">
            <Image
              src={post.image}
              alt={"post"}
              width={1000}
              height={1000}
              className={"max-w-[80%] min-w-[50%]"}
            />
          </div>
        )}
        <p>{post.text}</p>
        <LoaderLink
          href={`/user/${post.author.id}`}
          className="flex items-center gap-5"
        >
          <Image
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
        </LoaderLink>
        <div className="flex items-center flex-wrap gap-4">
          {post.tags.map((tag) => {
            return (
              <LoaderLink
                key={tag.id}
                href={`/tag/${tag.id}`}
                className="text-[12px] bg-primary text-background py-1 px-4 rounded-xl transition-all hover:text-white hover:bg-destructive"
              >
                {tag.name}
              </LoaderLink>
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
