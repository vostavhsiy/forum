import { GoogleButton } from "@/components/GoogleButton";
import { LoginForm } from "@/app/(browse)/(auth)/_components/LoginForm";
import { Separator } from "@/components/ui/separator";
import { LoaderLink } from "@/components/LoaderLink";
import { GithubButton } from "@/components/GithubButton";

const LoginPage = () => {
  return (
    <div
      className={
        "w-[80%] bg-primary-foreground p-10 rounded-2xl flex flex-col items-center"
      }
    >
      <h1 className="mb-6 text-2xl font-semibold">Вход</h1>
      {/*<GoogleButton variant={"outline"} size={"lg"} className="text-lg" />*/}
      <GithubButton variant={"outline"} size={"lg"} className="text-lg" />
      <Separator className="my-8" />
      <div className="w-full">
        <LoginForm />
      </div>
      <div className="mt-6">
        Нет даже аккаунта Google?{" "}
        <LoaderLink href={"/signup"} className={"text-destructive"}>
          Зарегистрируйтесь
        </LoaderLink>
      </div>
    </div>
  );
};

export default LoginPage;
