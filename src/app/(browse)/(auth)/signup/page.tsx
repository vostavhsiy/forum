import { Separator } from "@/components/ui/separator";
import { SignUpForm } from "@/app/(browse)/(auth)/_components/SignUpForm";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div
      className={
        "w-[80%] bg-primary-foreground p-10 rounded-2xl flex flex-col items-center"
      }
    >
      <h1 className="text-2xl font-semibold">Регистрация</h1>
      <Separator className="my-8" />
      <div className="w-full">
        <SignUpForm />
      </div>
      <div className="mt-6">
        Уже есть аккаунт?{" "}
        <Link
          href={"/login"}
          className={
            "bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent font-semibold"
          }
        >
          Войти
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
