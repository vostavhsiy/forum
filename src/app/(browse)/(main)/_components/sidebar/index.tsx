import {
  getRecommendedPosts,
  getRecommendedUsers,
} from "@/actions/blog.actions";

import { PostCard } from "@/app/(browse)/(main)/_components/sidebar/PostCard";

import { ImageWithFallback } from "@/components/FallbackImage";
import Link from "next/link";

const Sidebar = async () => {
  const recommendedPosts = await getRecommendedPosts();
  const recommendedUsers = await getRecommendedUsers();

  return (
    <div className="hidden fixed top-10 left-[50%] -translate-x-1/2 w-full max-w-[1300px] px-4 lg:flex flex-col py-2 pt-20 items-end gap-5 overflow-auto">
      {!!recommendedPosts?.length && (
        <div className="w-96 shadow flex flex-col gap-5 p-4 bg-background rounded-lg">
          <h2 className="text-base font-semibold text-center uppercase">
            Популярные посты
          </h2>
          <div className="flex flex-col gap-2 pl-2">
            {recommendedPosts.map((post) => {
              return <PostCard key={post.id} post={post} />;
            })}
          </div>
        </div>
      )}
      {!!recommendedUsers?.length && (
        <div className="w-96 shadow flex flex-col gap-5 p-4 bg-background rounded-lg">
          <h2 className="text-base font-semibold text-center uppercase">
            Популярные авторы
          </h2>
          <div className="flex flex-col gap-4 pl-2">
            {recommendedUsers.map((user) => {
              return (
                <Link
                  href={`/user/${user.id}`}
                  key={user.id}
                  className="flex items-center gap-2"
                >
                  <ImageWithFallback
                    src={user.image || "/user.png"}
                    alt={"user"}
                    width={500}
                    height={500}
                    className="w-[25px] h-[25px] object-cover object-center rounded-full"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold">{user.name}</h3>
                    <h4 className="text-[12px]">{user.email}</h4>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {/*<div className="flex flex-col gap-3">*/}
      {/*  <h2 className="text-sm font-semibold text-destructive">*/}
      {/*    Полезные ссылки*/}
      {/*  </h2>*/}
      {/*  <div className="flex flex-col gap-4">*/}
      {/*    {usefulLinks.map(({ link, label, image }) => {*/}
      {/*      return (*/}
      {/*        <Link href={link} key={link} className="flex items-center gap-2">*/}
      {/*          /!*<Image*!/*/}
      {/*          /!*  src={image || "/user.png"}*!/*/}
      {/*          /!*  alt={"user"}*!/*/}
      {/*          /!*  width={500}*!/*/}
      {/*          /!*  height={500}*!/*/}
      {/*          /!*  className="w-[25px] h-[25px] object-cover object-center rounded-full"*!/*/}
      {/*          /!*/
      /*/}
      {/*          <h3 className="text-[12px] font-semibold">{label}</h3>*/}
      {/*        </Link>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export { Sidebar };
