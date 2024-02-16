const Loader = () => {
  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-[200] bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <span className="loader"></span>
    </div>
  );
};

export { Loader };
