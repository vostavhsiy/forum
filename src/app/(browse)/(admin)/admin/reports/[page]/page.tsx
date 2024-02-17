import React from "react";
import { NextPage } from "next";
import { Pagination } from "@/components/Pagination";
import { auth } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { ReportCard } from "@/app/(browse)/(admin)/admin/reports/[page]/_components/ReportCard";
import { getReports } from "@/services/reports.service";

interface Props {
  params: {
    page: string;
  };
  searchParams: {
    search: string;
    size: string;
  };
}

const AdminReportsPage: NextPage<Props> = async ({ params, searchParams }) => {
  const user = await auth();

  const page = params.page ? +params.page - 1 : 0;
  const size = +(searchParams.size || 8);

  const { reports, total } = await getReports(page, size);

  if (!reports.length && page > 0) {
    return redirect(
      `/admin/reports/${page}?${searchParams.search ? `search=${searchParams.search}` : ""}`,
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-semibold">Репорты</h1>
      {!!reports.length ? (
        <>
          <div className="flex flex-col gap-5">
            {reports.map((report) => {
              return <ReportCard key={report.id} report={report} />;
            })}
          </div>
          <Pagination
            page={page + 1}
            size={size}
            total={total}
            baseLink={"admin/users"}
            search={searchParams.search}
          />
        </>
      ) : (
        <h2 className="text-destructive">Пока пусто!</h2>
      )}
    </div>
  );
};

export default AdminReportsPage;
