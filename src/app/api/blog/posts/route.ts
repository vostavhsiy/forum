import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { page, search, size, filter } = await req.json();
  const options = {
    page: page || 0,
    search: search || "",
    size: size || 3,
    filter: filter || "views",
  };
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: options.search,
            },
          },
          {
            tags: {
              some: {
                name: {
                  contains: options.search,
                },
              },
            },
          },
        ],
      },
      skip: options.page * options.size,
      take: options.size,
      include: {
        tags: true,
        author: true,
      },
      orderBy:
        options.filter === "new"
          ? { createdAt: "desc" }
          : options.filter === "views"
            ? {
                //title: "asc",
                views: "desc",
              }
            : { createdAt: "asc" },
    });

    const total = await prisma.post.count({
      where: {
        OR: [
          {
            title: {
              contains: options.search,
            },
          },
          {
            tags: {
              some: {
                name: {
                  contains: options.search,
                },
              },
            },
          },
        ],
      },
    });
    return NextResponse.json({ ok: true, posts, total });
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return NextResponse.json({ ok: false, error: err.message });
  }
}
