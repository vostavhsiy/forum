import { prisma } from "@/lib/prisma";
import { auth } from "@/actions/auth.actions";

export const getUsers = async (page = 0, search?: string, size = 8) => {
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
      include: {
        subscribers: true,
      },
    });

    const total = await prisma.user.count({
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
    });

    return { users, total };
  } catch (e: any) {
    console.log(e.message);
    return { users: [], total: 0 };
  }
};

export const getRecommendedUsersForChat = async (size = 6) => {
  const authUser = await auth();
  if (!authUser) return null;
  try {
    const subs = await prisma.user.findMany({
      where: {
        subscribers: {
          some: {
            subscriberId: authUser.id,
          },
        },
      },
      take: 3,
      orderBy: {
        subscribers: {
          _count: "desc",
        },
      },
    });
    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: [authUser.id, ...subs.map((s) => s.id)],
        },
      },
      take: size,
      orderBy: {
        subscribers: {
          _count: "desc",
        },
      },
    });

    return [...subs, ...users];
  } catch (e: any) {
    console.log(e.message);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            author: true,
            tags: true,
          },
        },
        subscribers: {
          include: {
            subscriber: true,
          },
        },
        subscribes: {
          include: {
            subscribed: true,
          },
        },
        favourites: {
          include: {
            author: true,
            tags: true,
          },
        },
      },
    });
    return user;
  } catch (e: any) {
    console.log(e.message);
    return null;
  }
};

export const getUserWithSubscribes = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        subscribes: {
          include: {
            subscribed: true,
          },
          orderBy: {
            subscribed: {
              subscribers: {
                _count: "desc",
              },
            },
          },
        },
      },
    });
    return user;
  } catch (e: any) {
    console.log(e.message);
    return null;
  }
};

export const getUserWithSubscribers = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        subscribers: {
          include: {
            subscriber: true,
          },
          orderBy: {
            subscriber: {
              subscribers: {
                _count: "desc",
              },
            },
          },
        },
      },
    });
    return user;
  } catch (e: any) {
    console.log(e.message);
    return null;
  }
};
