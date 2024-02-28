import { Form } from "@/app/(browse)/(auth)/login/update/_components/Form";

const UpdatePasswordLinkPage = async () => {
  return (
    <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
      <h1 className="w-lg font-semibold">Введите вашу почту</h1>
      <Form />
    </div>
  );
};

export default UpdatePasswordLinkPage;
