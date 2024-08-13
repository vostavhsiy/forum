import React from "react";
import { Sidebar } from "@/app/(browse)/(profile)/_components/sidebar";

const ProfileLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid lg:grid-cols-[1fr+7fr]">
      <Sidebar />
      <div className="mb-[100px] py-2 pt-20 px-4">{children}</div>
    </div>
  );
};

export default ProfileLayout;
