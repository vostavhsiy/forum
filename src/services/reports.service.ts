import { prisma } from "@/lib/prisma";

export const getReports = async (page = 0, size = 8) => {
  try {
    const reports = await prisma.report.findMany({
      skip: page * size,
      take: size,
      include: {
        author: true,
        post: true,
      },
    });

    const total = await prisma.report.count({});
    return { reports, total };
  } catch (e: any) {
    console.log(e.message);
    return { reports: [], total: 0 };
  }
};
