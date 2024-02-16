"use server";

import { prisma } from "@/lib/prisma";
import { SHA256 as sha256 } from "crypto-js";
import { revalidatePath } from "next/cache";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { uploadUserAvatar } from "@/services/files.services";

export const auth = async () => {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        favourites: true,
        notifications: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return null;
  }
};

export const signUp = async (payload: FormData) => {
  try {
    const data = {
      name: payload.get("name") ? String(payload.get("name")) : null,
      email: payload.get("email") ? String(payload.get("email")) : null,
      password: payload.get("password")
        ? String(payload.get("password"))
        : null,
      image: (payload.get("image") as File) || null,
    };
    if (!data.name || !data.email || !data.password) {
      return {
        ok: false,
        error: "Bad request",
      };
    }
    const isIn = await prisma.user.findFirst({
      where: { email: data.email },
    });
    if (isIn) {
      return {
        ok: false,
        error: "Пользователь с такой почтой уже существует",
      };
    }
    const image = await uploadUserAvatar(data.image);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        password: sha256(data.password).toString(),
        // @ts-ignore
        image: image ? image.Location : "",
        email: data.email,
        role: "user",
      },
    });
    if (!user) {
      return {
        ok: false,
        error: "Bad request",
      };
    }
    return {
      ok: true,
      error: "",
    };
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
};

export const revalidate = async (paths: string[]) => {
  paths.forEach((path) => {
    revalidatePath(path);
  });
};
