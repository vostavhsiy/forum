import { NotFoundImage } from "@/components/notFoundImage";

const NotFoundPage = () => {
  return (
    <div
      className={"w-full h-screen flex flex-col items-center justify-center"}
    >
      <NotFoundImage />
      <h1 className="text-6xl font-semibold -mt-[5%]">404</h1>
    </div>
  );
};

export default NotFoundPage;
