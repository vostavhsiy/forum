import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Post } from "@/app/(browse)/(main)/blog/_components/post";
import Link from "next/link";
import { getUserById } from "@/services/users.service";

const ProfileFavouritesPage = async () => {
  const session = await getServerSession(authConfig);
  if (!session) {
    redirect("/");
  }
  const user = await getUserById(session.user.id);
  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4 p-5 mb-[100px]">
      <h1 className="text-lg font-semibold">Понравившиеся посты</h1>
      {!!user.favourites.length ? (
        <div className="flex flex-col gap-6">
          {user.favourites.map((post) => {
            return (
              <Post
                key={post.id}
                post={post}
                auth={user?.id}
                favourite={!!user?.favourites.find((fav) => fav.id === post.id)}
              />
            );
          })}
        </div>
      ) : (
        <Link href={"/blog"} className={"text-destructive hover:underline"}>
          Найти интересные посты
        </Link>
      )}
    </div>
  );
};

export default ProfileFavouritesPage;
