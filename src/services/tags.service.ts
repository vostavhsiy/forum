import { prisma } from "@/lib/prisma";

export const getTags = async (
  page = 0,
  search?: string,
  size = 8,
  orderBy?: "name" | "createdAt",
) => {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: search || "",
        },
      },
      skip: page * size,
      take: size,
      orderBy:
        orderBy === "name"
          ? { name: "asc" }
          : {
              createdAt: "desc",
            },
    });

    const total = await prisma.tag.count({
      where: {
        name: {
          contains: search || "",
        },
      },
    });

    return { tags, total };
  } catch (e: any) {
    console.log(e.message);
    return { tags: [], total: 0 };
  }
};

export const getTagById = async (id: string) => {
  try {
    const tag = await prisma.tag.findUnique({
      where: {
        id,
      },
    });
    return tag;
  } catch (e: any) {
    console.log(e.message);
    return null;
  }
};
