import React from "react";
import { Sidebar } from "@/app/(browse)/(messenger)/messenger/_components/sidebar";

const MessengerLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid h-full grid-rows-[1fr+5fr] lg:grid-cols-[1fr+5fr]">
      <Sidebar />
      <div className="py-2 px-4" style={{ height: "calc(100vh - 60px)" }}>
        {children}
      </div>
    </div>
  );
};

export default MessengerLayout;
