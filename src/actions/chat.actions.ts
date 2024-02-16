"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  uploadMessageImage,
  uploadUserAvatar,
} from "@/services/files.services";

export const getConversations = async () => {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return [];
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        users: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
        notifications: {
          include: {
            user: true,
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export const getConversation = async (id: string) => {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return null;
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
    return conversation;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const createConversation = async ({ userId }: { userId: string }) => {
  const session = await getServerSession(authConfig);

  if (!session?.user || session.user.id === userId) {
    return {
      ok: false,
    };
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        users: true,
      },
    });
    const isExist = conversations.find(
      (con) => !!con.users.find((u) => u.id === userId),
    );
    if (isExist) {
      return {
        ok: true,
        id: isExist.id,
      };
    }
    const conversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: session.user.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    revalidatePath("/messenger", "page");
    revalidatePath("/messenger/[id]", "page");
    return {
      ok: true,
      id: conversation.id,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      ok: false,
    };
  }
};

export const sendMessage = async (
  conversationId: string,
  payload: FormData,
) => {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return {
      ok: false,
    };
  }

  const data = {
    text: payload.get("text") ? String(payload.get("text")) : null,
    image: (payload.get("image") as File) || null,
  };

  if (!data.text && !data.image) {
    return {
      ok: false,
      error: "Заполните поля!",
    };
  }

  const messageImage = await uploadMessageImage(data.image);

  try {
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: data.text,
        //@ts-ignore
        image: messageImage ? messageImage.Location : "",
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: session.user.id },
        },
        seen: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    const otherUser = updatedConversation.users.find(
      (u) => u.id !== session.user.id,
    );
    if (otherUser) {
      const notification = await prisma.notification.create({
        data: {
          userId: otherUser.id,
          type: "message",
          conversationId: conversationId,
          text: `Новое сообщение от ${session.user.name}.`,
          title: "Сообщение",
        },
      });
    }

    revalidatePath("/", "layout");
    revalidatePath("/", "page");
    revalidatePath("/messenger", "page");
    revalidatePath("/messenger/[id]", "page");
    return {
      ok: true,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      ok: false,
    };
  }
};

export const deleteConversationNotifications = async ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return {
      ok: false,
      error: "Ошибка!",
    };
  }

  try {
    const conversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        notifications: {
          deleteMany: {
            conversationId,
            userId: session.user.id,
          },
        },
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return {
        ok: false,
        error: "Ошибка!",
      };
    }

    revalidatePath("/messenger", "page");
    revalidatePath("/messenger/[id]", "page");
    return {
      ok: true,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      ok: false,
      error: error.message,
    };
  }
};

export const seenMessage = async ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return {
      ok: false,
    };
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return {
        ok: false,
      };
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return {
        ok: false,
      };
    }

    // Update seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    revalidatePath("/messenger", "page");
    revalidatePath("/messenger/[id]", "page");
    return {
      ok: true,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      ok: false,
      error: error.message,
    };
  }
};

export const receiveNewMessage = async () => {
  revalidatePath("/messenger", "page");
  revalidatePath("/messenger/[id]", "page");
};

export const receiveNewNotification = async () => {
  revalidatePath("/messenger", "page");
  revalidatePath("/messenger/[id]", "page");
};
