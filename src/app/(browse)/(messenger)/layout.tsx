import React from "react";
import { Sidebar } from "@/app/(browse)/(messenger)/messenger/_components/sidebar";

const MessengerLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid h-screen lg:grid-cols-[1fr+5fr]">
      <Sidebar />
      <div className="py-2 px-4 h-screen pt-20">{children}</div>
    </div>
  );
};

export default MessengerLayout;
