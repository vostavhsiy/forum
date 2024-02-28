import React from "react";
import Image from "next/image";

const NotFound = () => {
  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <Image
        src={"/rock.svg"}
        alt={"rock"}
        width={1000}
        height={1000}
        className={"w-[300px] -mt-[150px]"}
      />
      <h1 className="text-6xl font-semibold">404</h1>
    </div>
  );
};

export default NotFound;
