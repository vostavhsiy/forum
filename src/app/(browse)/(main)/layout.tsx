import React from "react";
import { Sidebar } from "@/app/(browse)/(main)/_components/sidebar";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="max-w-[1400px] mx-auto h-full grid gap-5 grid-cols-[5fr_2fr] px-4">
      <div className="relative z-[1] h-full py-2 px-4 pt-20 main-layout">
        {children}
      </div>
      <Sidebar />
    </div>
  );
};

export default MainLayout;
