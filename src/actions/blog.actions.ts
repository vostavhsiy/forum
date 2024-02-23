"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";
import { auth } from "@/actions/auth.actions";
import {
  changePostImage,
  deletePostImage,
  uploadPostImage,
} from "@/services/files.services";
import { deleteReport } from "@/actions/users.actions";
import { Tag } from "@prisma/client";
import { v4 as uuid } from "uuid";

export const createPost = async (payload: FormData) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      subscribers: {
        include: {
          subscriber: true,
        },
      },
    },
  });
  if (!user) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }
  const data = {
    title: payload.get("title"),
    text: payload.get("text"),
    tags: JSON.parse(String(payload.get("tags"))),
    image: (payload.get("image") as File) || undefined,
  };

  const tags: Tag[] = data.tags || [];

  if (!data.title || !data.text) {
    return {
      ok: false,
      error: "Не все поля заполнены!",
    };
  }
  const image = await uploadPostImage(data.image);
  try {
    const post = await prisma.post.create({
      data: {
        title: String(data.title),
        text: String(data.text),
        userId: session.user.id,
        //@ts-ignore
        image: image ? image.Location : "",
        views: 0,
        tags: {
          connect: tags,
        },
      },
    });
    if (!post) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    for (let i = 0; i < user.subscribers.length; i++) {
      const notification = await prisma.notification.create({
        data: {
          userId: user.subscribers[i].subscriberId,
          type: "post",
          text: `Новый пост от ${session.user.name}.`,
          title: "Новый пост",
          expires: new Date(Date.now() + 1000 * 60 * 60 * 4),
          link: `/post/${post.id}`,
        },
      });
    }
    revalidatePath("/", "page");
    revalidatePath("/profile", "page");
    revalidatePath("/profile/posts", "page");
    revalidatePath("/profile/favourites", "page");
    revalidatePath("/profile/subscribes", "page");
    revalidatePath("/profile/subscribers", "page");
    revalidatePath("/profile/edit", "page");
    revalidatePath("/messenger", "page");
    revalidatePath("/messenger/[id]", "page");
    revalidatePath("/admin", "page");
    revalidatePath("/admin/posts/[page]", "page");
    revalidatePath("/admin/reports/[page]", "page");
    revalidatePath("/admin/users/[page]", "page");
    revalidatePath("/admin/tags/[page]", "page");
    revalidatePath("/blog", "page");
    revalidatePath("/post/[id]", "page");
    revalidatePath("/tags/[page]", "page");
    revalidatePath("/tag/[id]", "page");
    return {
      ok: true,
      name: user.name,
      postId: post.id,
      ids: user.subscribers.map(({ subscriber }) => subscriber.id),
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const editPostInPanel = async (id: string, payload: FormData) => {
  const user = await auth();
  if (!["admin", "editor"].find((r) => r === user?.role)) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }

  const data = {
    title: payload.get("title"),
    text: payload.get("text"),
    image: (payload.get("image") as File) || undefined,
    oldUrl: payload.get("url") ? String(payload.get("url")) : "",
  };

  if (!data.title || !data.text) {
    return {
      ok: false,
      error: "Не все поля заполнены!",
    };
  }
  const image = await changePostImage(data.image, data.oldUrl);
  try {
    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title: String(data.title),
        text: String(data.text),
        //@ts-ignore
        image: image ? image.Location : "",
      },
    });
    if (!post) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/profile", "page");
    revalidatePath("/profile/posts", "page");
    revalidatePath("/profile/favourites", "page");
    revalidatePath("/blog", "page");
    revalidatePath("/post/[id]", "page");
    revalidatePath("/admin/posts/[page]", "page");
    revalidatePath("/admin/reports/[page]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const deletePostPicture = async (id: string, url: string) => {
  const user = await auth();
  if (!["admin", "editor"].find((r) => r === user?.role)) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }
  const deleted = await deletePostImage(url);
  try {
    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        image: "",
      },
    });
    if (!post) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/profile", "page");
    revalidatePath("/profile/posts", "page");
    revalidatePath("/profile/favourites", "page");
    revalidatePath("/blog", "page");
    revalidatePath("/admin/posts/[page]", "page");
    revalidatePath("/admin/reports/[page]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const addPostView = async (id: string) => {
  try {
    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    if (!post) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/", "page");
    revalidatePath("/blog", "page");
    revalidatePath("/post/[id]", "page");
    revalidatePath("/profile/posts", "page");
    revalidatePath("/profile/favourites", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const deletePost = async (id: string) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: true,
        reports: true,
      },
    });
    if (!post) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    for (let i = 0; i < post.comments.length; i++) {
      await deleteComment({ commentId: post.comments[i].id });
    }
    for (let i = 0; i < post.reports.length; i++) {
      await deleteReport(post.reports[i].id);
    }
    const deletedPost = await prisma.post.delete({
      where: {
        id,
      },
    });
    if (!deletedPost) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    const deleted = await deletePostImage(deletedPost.image);
    revalidatePath("/profile", "page");
    revalidatePath("/blog", "page");
    revalidatePath("/tags", "page");
    revalidatePath("/admin/posts", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const likePost = async (id: string) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }
  try {
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        favourites: {
          connect: {
            id,
          },
        },
      },
    });
    if (!user) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/profile", "page");
    revalidatePath("/profile/favourites", "page");
    revalidatePath("/blog", "page");
    revalidatePath("/admin/posts", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const dislikePost = async (id: string) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }
  try {
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        favourites: {
          disconnect: {
            id,
          },
        },
      },
    });
    if (!user) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/profile", "page");
    revalidatePath("/profile/favourites", "page");
    revalidatePath("/blog", "page");
    revalidatePath("/admin/posts", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const createComment = async ({
  postId,
  text,
  to,
}: {
  postId: string;
  text: string;
  to?: string;
}) => {
  const user = await auth();
  if (!user) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }
  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        dislikes: 0,
        likes: 0,
        to: "",
        author: {
          connect: {
            id: user.id,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });
    if (!comment) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/post/[id]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const deleteComment = async ({ commentId }: { commentId: string }) => {
  const user = await auth();
  if (!user) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }
  try {
    await prisma.answer.deleteMany({
      where: {
        commentid: commentId,
      },
    });
    const comment = await prisma.comment.delete({
      where: !!["admin", "editor"].find((r) => r === user?.role)
        ? { id: commentId }
        : {
            id: commentId,
          },
    });
    if (!comment) {
      return {
        ok: false,
        error: "Комментария нет!",
      };
    }
    revalidatePath("/post/[id]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const createAnswer = async ({
  commentId,
  text,
  to,
}: {
  commentId: string;
  text: string;
  to: string;
}) => {
  const user = await auth();
  if (!user) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }
  try {
    const answer = await prisma.answer.create({
      data: {
        text,
        to,
        author: {
          connect: {
            id: user.id,
          },
        },
        comment: {
          connect: {
            id: commentId,
          },
        },
      },
    });
    if (!answer) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/post/[id]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const deleteAnswer = async ({ answerId }: { answerId: string }) => {
  const user = await auth();
  if (!user) {
    return {
      ok: false,
      error: "Не авторизованы!",
    };
  }
  try {
    const answer = await prisma.answer.delete({
      where: {
        id: answerId,
        userid: user.id,
      },
    });
    if (!answer) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/post/[id]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message + "!",
    };
  }
};

export const setFilter = async (filter: string, search: string | null) => {
  revalidatePath(`/blog`);
  redirect(`/blog?filter=${filter}&${search ? `search=${search}` : ""}`);
};

export const getRecommendedPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        views: "desc",
      },
      take: 3,
      include: {
        author: true,
      },
    });
    return posts;
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return null;
  }
};

export const getRecommendedUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        subscribers: {
          _count: "desc",
        },
      },
      take: 3,
    });
    return users;
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return null;
  }
};

export const getPostsPage = async (page = 0, search?: string, size = 3) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search || "",
            },
          },
          {
            tags: {
              some: {
                name: {
                  contains: search || "",
                },
              },
            },
          },
        ],
      },
      skip: page * size,
      take: size,
      orderBy: {
        views: "desc",
      },
    });
    return posts;
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return null;
  }
};

export const getTagsPage = async (page = 0, search?: string, size = 3) => {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: search || "",
        },
      },
      skip: page * size,
      take: size,
    });
    return tags;
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return null;
  }
};
