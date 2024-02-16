import { prisma } from "@/lib/prisma";

export const getPosts = async (
  page = 0,
  search?: string,
  size = 8,
  filter?: "new",
) => {
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
      orderBy:
        filter === "new"
          ? { createdAt: "desc" }
          : {
              views: "desc",
            },
      include: {
        tags: true,
        author: true,
        reports: true,
      },
    });
    const total = await prisma.post.count({
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
    });
    return { posts, total };
  } catch (e: any) {
    console.log(e.message);
    return { posts: [], total: 0 };
  }
};

export const getPostForPostPage = async (id: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        tags: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: true,
            answers: {
              include: {
                author: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });
    return post;
  } catch (e: any) {
    console.log(e.message);
    return null;
  }
};
