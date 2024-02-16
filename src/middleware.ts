export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/profile",
    "/profile/favourites",
    "/profile/posts",
    "/profile/edit",
    "/profile/subscribers",
    "/profile/subscribes",
    "/messenger",
    "/messenger/[id]",
    "/admin",
    "/admin/reports",
    "/admin/posts",
    "/admin/users",
    "/admin/tags",
  ],
};
