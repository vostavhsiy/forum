import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/services/posts.service";
import { cn } from "@/lib/utils";
import { Oswald } from "next/font/google";
import { auth } from "@/actions/auth.actions";
import { HomeContent } from "@/app/(browse)/(home)/_components/HomeContent";
import { HomePosts } from "@/app/(browse)/(home)/_components/HomePosts";
import { HomeContacts } from "@/app/(browse)/(home)/_components/HomeContacts/HomeContacts";
import { getRecommendedPosts } from "@/actions/blog.actions";
import { Footer } from "@/components/Footer";

const oswald = Oswald({ subsets: ["cyrillic"], weight: ["400", "600", "700"] });

export default async function Home() {
  const user = await auth();

  const posts = await getRecommendedPosts();
  return (
    <div className="relative h-full overflow-hidden flex flex-col justify-between  max-w-[100vw] lg:max-w-none">
      <div>
        <HomeContent />
        {posts && <HomePosts posts={posts} user={user} />}
        <HomeContacts />
      </div>
      <Footer auth={!!user} />
    </div>
  );
}
