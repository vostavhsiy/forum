"use client";

import React, { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { format } from "date-fns";
import Image from "next/image";
import { Message } from "@prisma/client";
import { CheckCheck } from "lucide-react";
import { download } from "@/services/files.services";
import { downloadMessageFile } from "@/actions/chat.actions";

interface MessageBoxProps {
  data: Message & {
    sender: {
      id: string;
      name: string | null;
      email: string | null;
      password: string | null;
      emailVerified: Date | null;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
      role: string | null;
    };
    seen: {
      id: string;
      name: string | null;
      email: string | null;
      password: string | null;
      emailVerified: Date | null;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
      role: string | null;
    }[];
  };
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const session = useSession();

  const isOwn = session?.data?.user?.email === data?.sender?.email;

  const seenList = (data.seen || [])
    .filter((user) => user?.email !== data?.sender?.email)
    .map((user) => user?.name)
    .join(", ");

  const container = clsx("flex gap-3 p-4 select-none", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-1", isOwn && "items-end");
  const message = clsx(
    "text-sm w-full overflow-hidden px-4 py-2.5 flex flex-col gap-3",
    isOwn
      ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-b-xl rounded-tl-xl"
      : "bg-gray-100 rounded-b-xl rounded-tr-xl text-gray-800",
    data.image ? "rounded-md p-0" : "py-2 px-3",
  );

  return (
    // <div className={container}>
    //     <div className={avatar}>
    //         <Avatar user={data?.sender} />
    //     </div>
    //     <div className={body}>
    //         <div className='flex items-center gap-1'>
    //             <div className='text-sm text-gray-500'>
    //                 {data.sender.name}
    //             </div>
    //             <div className='text-xs text-gray-400'>
    //                 {format(new Date(data.createdAt), 'p')}
    //             </div>
    //         </div>
    //         <div className={message}>
    //             {data?.image ? (
    //                 <Image
    //                     src={data.image}
    //                     alt='Image'
    //                     width={1000}
    //                     height={1000}
    //                     className='w-72 h-72 cursor-pointer object-cover hover:scale-105 transition ease-in-out'
    //                 />
    //             ) : (
    //                 <div>
    //                     {data.body}
    //                 </div>
    //             )}
    //         </div>
    //         {isLast && isOwn && seenList.length > 0 && (
    //             <div className='text-xs text-gray-500'>
    //                 {`Seen by ${seenList}`}
    //             </div>
    //         )}
    //     </div>
    // </div>
    <div className={container}>
      <div className={body}>
        <div className={message}>
          {data.image && (
            <Image
              src={data.image}
              alt="Image"
              onClick={() => setImageModalOpen(true)}
              width={1000}
              height={1000}
              className="min-w-72 lg:max-w-[500px] cursor-pointer object-cover hover:scale-105 transition ease-in-out rounded-md"
            />
          )}
          {data.file && (
            <div
              onClick={async () => {
                if (data.file) {
                  startTransition(() => {
                    downloadMessageFile(data.file as string).then((file) => {
                      console.log(file);
                      if (file && file.data.ContentType && data.file) {
                        download(
                          file.data.Body as Uint8Array,
                          file.data.ContentType,
                          data.file.split("---").slice(-1)[0],
                        );
                      }
                    });
                  });
                }
              }}
            >
              {isPending && <h5>Загрузка...</h5>}
              <span>{data.file.split("---").slice(-1)}</span>
            </div>
          )}
          <div>{data.body}</div>
        </div>
        <div className={`flex gap-2`}>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
          {isOwn && seenList.length > 0 && (
            <div className={`text-xs text-blue-500`}>
              <CheckCheck className="w-4 h-4 text-current" />
            </div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs text-gray-500">{`Просмотрено`}</div>
        )}
      </div>
    </div>
  );
};

export { MessageBox };
