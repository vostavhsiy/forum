import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/actions/auth.actions";
import { LoaderLink } from "@/components/LoaderLink";

const ProfileButton = async () => {
  const user = await auth();
  if (!user) {
    return null;
  }
  return (
    <LoaderLink href={"/profile"}>
      <Image
        src={user.image || "/user.png"}
        alt={"profile"}
        width={500}
        height={500}
        className={
          "w-[40px] h-[40px] object-cover object-center rounded-full border-2"
        }
      />
    </LoaderLink>
  );
};

export { ProfileButton };
