"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SHA256 as sha256 } from "crypto-js";
import { auth } from "@/actions/auth.actions";
import { changeUserAvatar } from "@/services/files.services";

export const follow = async (id: string) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return {
      ok: false,
      error: "Не авторизованы",
    };
  }
  if (session.user.id === id) {
    return {
      ok: false,
      error: "Это вы!",
    };
  }
  try {
    const isExist = await prisma.user.findUnique({
      where: { id },
    });
    if (!isExist) {
      return {
        ok: false,
        error: "Пользователя не существует",
      };
    }
    const isFollow = await prisma.follow.findFirst({
      where: {
        subscriberId: session.user.id,
        subscribedId: id,
      },
    });
    if (isFollow) {
      return {
        ok: false,
        error: "Вы уже подписаны на пользователя",
      };
    }
    const follow = await prisma.follow.create({
      data: {
        subscribedId: id,
        subscriberId: session.user.id,
      },
      include: {
        subscriber: true,
        subscribed: true,
      },
    });
    if (!follow) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    const notification = await prisma.notification.create({
      data: {
        userId: id,
        type: "follow",
        text: `${session.user.name} подписался на вас.`,
        title: `${session.user.name} подписался на вас.`,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        link: `/user/${session.user.id}`,
      },
    });
    revalidatePath("/", "page");
    revalidatePath("/users/[page]", "page");
    revalidatePath("/user/[name]", "page");
    revalidatePath("/profile", "page");
    revalidatePath("/profile/subscribers", "page");
    revalidatePath("/profile/subscribes", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const unfollow = async (id: string) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return {
      ok: false,
      error: "Не авторизованы",
    };
  }
  try {
    const isExist = await prisma.user.findUnique({
      where: { id },
    });
    if (!isExist) {
      return {
        ok: false,
        error: "Пользователя не существует",
      };
    }
    const isFollow = await prisma.follow.findFirst({
      where: {
        subscriberId: session.user.id,
        subscribedId: id,
      },
    });
    if (!isFollow) {
      return {
        ok: false,
        error: "Вы не подписаны на пользователя",
      };
    }
    const follow = await prisma.follow.deleteMany({
      where: {
        subscribedId: id,
        subscriberId: session.user.id,
      },
    });
    if (!follow) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    const notification = await prisma.notification.create({
      data: {
        userId: id,
        type: "follow",
        text: `${session.user.name} отписался от вас.`,
        title: `${session.user.name} отписался от вас.`,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        link: `/user/${session.user.id}`,
      },
    });
    revalidatePath("/", "page");
    revalidatePath("/users/[page]", "page");
    revalidatePath("/user/[name]", "page");
    revalidatePath("/profile", "page");
    revalidatePath("/profile/subscribers", "page");
    revalidatePath("/profile/subscribes", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const editProfile = async (payload: FormData) => {
  try {
    const authUser = await auth();
    if (!authUser) {
      return {
        ok: false,
        error: "Не авторизованы",
      };
    }
    const image = await changeUserAvatar(
      payload.get("image") as File,
      authUser.image || undefined,
    );

    const password = payload.get("password")
      ? String(payload.get("password"))
      : null;
    const data = password
      ? {
          name: payload.get("name") ? String(payload.get("name")) : "",
          password: payload.get("password")
            ? sha256(String(payload.get("password"))).toString()
            : "",
          image: image || authUser.image,
        }
      : {
          name: payload.get("name") ? String(payload.get("name")) : "",
          image: image || authUser.image,
        };
    if (!data.name && !data.password) {
      return {
        ok: false,
        error: "Плохие данные!",
      };
    }
    const user = await prisma.user.update({
      where: {
        id: authUser.id,
      },
      data,
    });
    if (!user) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/", "page");
    revalidatePath("/profile", "page");
    revalidatePath("/profile/edit", "page");
    revalidatePath("/users/[page]", "page");
    revalidatePath("/blog", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const getUsersPage = async (page = 0, search?: string, size = 3) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search || "",
            },
          },
          {
            email: {
              contains: search || "",
            },
          },
        ],
      },
      skip: page * size,
      take: size,
      orderBy: {
        name: "asc",
      },
    });
    return users;
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return null;
  }
};

export const changeRole = async (id: string, role: "user" | "editor") => {
  const user = await auth();

  if (user?.id === id) {
    return {
      ok: false,
      error: "Это вы!",
    };
  }

  if (!["admin", "editor"].find((r) => r === user?.role)) {
    return {
      ok: false,
      error: "Не авторизованы",
    };
  }
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
    });
    if (!user) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/users/[page]", "page");
    revalidatePath("/user/[id]", "page");
    revalidatePath("admin/users/[page]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const banUser = async (id: string) => {
  const user = await auth();
  if (!["admin", "editor"].find((r) => r === user?.role)) {
    return {
      ok: false,
      error: "Не авторизованы",
    };
  }

  try {
    const user = await prisma.user.update({
      where: {
        id,
        role: {
          notIn: ["admin"],
        },
      },
      data: {
        banned: true,
      },
    });
    if (!user) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }

    revalidatePath("/users/[page]", "page");
    revalidatePath("/user/[id]", "page");
    revalidatePath("admin/users/[page]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: "Нельзя забанить админа!",
    };
  }
};

export const unbanUser = async (id: string) => {
  const user = await auth();
  if (!["admin", "editor"].find((r) => r === user?.role)) {
    return {
      ok: false,
      error: "Не авторизованы",
    };
  }
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        banned: false,
      },
    });
    if (!user) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/users/[page]", "page");
    revalidatePath("/user/[id]", "page");
    revalidatePath("admin/users/[page]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const createTag = async (name: string) => {
  const user = await auth();

  if (!["admin", "editor"].find((r) => r === user?.role)) {
    return {
      ok: false,
      error: "Не авторизованы",
    };
  }
  try {
    const tag = await prisma.tag.create({
      data: {
        name,
      },
    });
    if (!tag) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/profile", "page");
    revalidatePath("admin/tags/[page]", "page");
    revalidatePath("admin/posts/[page]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const deleteTag = async (id: string) => {
  const user = await auth();

  if (!["admin", "editor"].find((r) => r === user?.role)) {
    return {
      ok: false,
      error: "Не авторизованы",
    };
  }
  try {
    const tag = await prisma.tag.delete({
      where: {
        id,
      },
    });
    if (!tag) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/blog", "page");
    revalidatePath("/profile", "page");
    revalidatePath("/profile/posts", "page");
    revalidatePath("/profile/favourites", "page");
    revalidatePath("admin/tags/[page]", "page");
    revalidatePath("admin/posts/[page]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const createReport = async (text: string, postId: string) => {
  const user = await auth();

  if (!user) {
    return {
      ok: false,
      error: "Не авторизованы",
    };
  }
  try {
    const report = await prisma.report.create({
      data: {
        text,
        postId,
        authorId: user.id,
        postTitle: "",
      },
    });
    if (!report) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/blog", "page");
    revalidatePath("/profile/posts", "page");
    revalidatePath("/profile/favourites", "page");
    revalidatePath("admin/reports/[page]", "page");
    revalidatePath("admin/posts/[page]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const deleteReport = async (id: string) => {
  const user = await auth();

  if (!["admin", "editor"].find((r) => r === user?.role)) {
    return {
      ok: false,
      error: "Не авторизованы",
    };
  }

  try {
    const report = await prisma.report.delete({
      where: {
        id,
      },
    });
    if (!report) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("admin/reports/[page]", "page");
    revalidatePath("admin/posts/[page]", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const deleteNotification = async (id: string) => {
  const user = await auth();

  if (!user) {
    return {
      ok: false,
      error: "Не авторизованы",
    };
  }
  try {
    const notification = await prisma.report.delete({
      where: {
        id,
      },
    });
    if (!notification) {
      return {
        ok: false,
        error: "Ошибка",
      };
    }
    revalidatePath("/", "page");
    revalidatePath("/blog", "page");
    revalidatePath("/messenger", "page");
    revalidatePath("/messenger/[id]", "page");
    revalidatePath("/users/[page]", "page");
    revalidatePath("/tags/[page]", "page");
    revalidatePath("/profile", "page");
    revalidatePath("/profile/posts", "page");
    revalidatePath("/profile/favourites", "page");
    revalidatePath("/profile/users/[page]", "page");
    revalidatePath("/profile/tags/[page]", "page");
    revalidatePath("/admin", "page");
    return {
      ok: true,
      error: null,
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const seeUserNotifications = async ({ userId }: { userId: string }) => {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return {
      ok: false,
      error: "Ошибка!",
    };
  }

  try {
    const notifications = await prisma.notification.updateMany({
      where: {
        userId,
        type: {
          notIn: ["message"],
        },
        seen: false,
      },
      data: {
        seen: true,
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      },
    });

    if (!notifications.count) {
      return {
        ok: false,
        error: "Ошибка!",
      };
    }

    revalidatePath("/", "page");
    return {
      ok: true,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      ok: false,
      error: error.message,
    };
  }
};

export const deleteUserNotifications = async ({
  userId,
}: {
  userId: string;
}) => {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return {
      ok: false,
      error: "Ошибка!",
    };
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        notifications: {
          deleteMany: {
            type: {
              notIn: ["message"],
            },
            userId: session.user.id,
            expires: {
              lt: new Date(),
            },
            seen: true,
          },
        },
      },
      include: {
        notifications: true,
      },
    });

    if (!user) {
      return {
        ok: false,
        error: "Ошибка!",
      };
    }

    revalidatePath("/", "page");
    return {
      ok: true,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      ok: false,
      error: error.message,
    };
  }
};
