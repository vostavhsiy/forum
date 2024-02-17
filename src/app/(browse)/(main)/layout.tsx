import React from "react";
import { Sidebar } from "@/app/(browse)/(main)/_components/sidebar";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr+5fr]">
      <Sidebar />
      <div className="h-full overflow-auto py-2 px-4 main-layout">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
