import {
  getRecommendedPosts,
  getRecommendedUsers,
} from "@/actions/blog.actions";
import Link from "next/link";
import Image from "next/image";
import { PostCard } from "@/app/(browse)/(main)/_components/sidebar/PostCard";
import { LoaderLink } from "@/components/LoaderLink";

const usefulLinks = [
  {
    link: "/",
    label: "Южный федеральный университет",
    image: "",
  },
  {
    link: "/",
    label: "ИВТиПТ",
    image: "",
  },
  {
    link: "/",
    label: "Команда",
    image: "",
  },
];

const Sidebar = async () => {
  const recommendedPosts = await getRecommendedPosts();
  const recommendedUsers = await getRecommendedUsers();

  return (
    <div className="hidden w-full border-r-2 lg:flex flex-col py-2 px-4 items-start gap-10 pt-5 overflow-auto">
      {!!recommendedPosts?.length && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Популярные посты</h2>
          <div className="flex flex-col gap-2 pl-2">
            {recommendedPosts.map((post) => {
              return <PostCard key={post.id} post={post} />;
            })}
          </div>
        </div>
      )}
      {!!recommendedUsers?.length && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Популярные авторы</h2>
          <div className="flex flex-col gap-4 pl-2">
            {recommendedUsers.map((user) => {
              return (
                <LoaderLink
                  href={`/user/${user.id}`}
                  key={user.id}
                  className="flex items-center gap-2"
                >
                  <Image
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
                </LoaderLink>
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
