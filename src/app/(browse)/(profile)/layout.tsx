import React from "react";
import { Sidebar } from "@/app/(browse)/(profile)/_components/sidebar";

const ProfileLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid grid-rows-[1fr+12fr] lg:grid-cols-[1fr+7fr]">
      <Sidebar />
      <div
        style={{ height: "calc(100vh - 60px)" }}
        className="overflow-auto mb-[100px] py-2 px-4 main-layout"
      >
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
