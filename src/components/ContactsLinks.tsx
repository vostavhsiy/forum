import { Instagram, Facebook, Youtube } from "lucide-react";

const links = [
  { icon: <Instagram />, href: "https://instagram.com" },
  { icon: <Facebook />, href: "https://facebook.com" },
  { icon: <Youtube />, href: "https://youtube.com" },
];

export const ContactsLinks = () => {
  return (
    <div className={"flex items-center gap-5"}>
      {links.map((link) => {
        return (
          <a
            key={link.href}
            className={
              "w-[40px] flex items-center justify-center aspect-square rounded-full transition-all bg-gray-200 hover:!bg-white text-black"
            }
            href={link.href}
          >
            {link.icon}
          </a>
        );
      })}
    </div>
  );
};
