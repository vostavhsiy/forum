import React from "react";
import { Sidebar } from "@/app/(browse)/(admin)/_components/sidebar";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { auth } from "@/actions/auth.actions";
import { redirect } from "next/navigation";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await auth();

  if (user?.role !== "admin" && user?.role !== "editor") {
    return redirect("/profile");
  }

  return (
    <div className="h-full grid grid-cols-[1fr+7fr]">
      <Sidebar />
      <div className="h-full mb-[100px] py-2 pt-20 px-4">{children}</div>
    </div>
  );
};

export default AdminLayout;
