import React from "react";
import { AuthSlider } from "@/app/(browse)/(auth)/_components/Slider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={"h-full flex items-stretch pt-20"}>
      <div className={"h-full w-[60%] flex items-center justify-center"}>
        <AuthSlider />
      </div>
      <div className={"w-[40%] flex items-center justify-center"}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
