import { default as EasyYandexS3 } from "easy-yandex-s3";
import { v4 as uuid } from "uuid";

// Инициализация
const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY || "",
    secretAccessKey: process.env.STORAGE_SECRET_KEY || "",
  },
  Bucket: "ivtipt-forum",
  debug: true,
});

export const uploadUserAvatar = async (file?: File) => {
  if (!file) return false;
  const id = uuid();
  const image = await s3.Upload(
    {
      buffer: Buffer.from(await file.arrayBuffer()),
      name: id + file.name,
    },
    "/users-avatars",
  );
  return image;
};

export const changeUserAvatar = async (file?: File, oldImageUrl?: string) => {
  if (!file) return false;
  if (oldImageUrl) {
    const deleted = await s3.Remove(
      oldImageUrl
        .split("https://ivtipt-forum.storage.yandexcloud.net")
        .slice(-1)[0],
    );
  }
  const id = uuid();
  const image = await s3.Upload(
    {
      buffer: Buffer.from(await file.arrayBuffer()),
      name: id + file.name,
    },
    "/users-avatars",
  );
  return image;
};

export const uploadPostImage = async (file?: File) => {
  if (!file) return false;
  const id = uuid();
  const image = await s3.Upload(
    {
      buffer: Buffer.from(await file.arrayBuffer()),
      name: id + file.name,
    },
    "/posts-images",
  );
  return image;
};

export const changePostImage = async (file?: File, oldImageUrl?: string) => {
  if (!file) return false;
  if (oldImageUrl) {
    const deleted = await s3.Remove(
      oldImageUrl
        .split("https://ivtipt-forum.storage.yandexcloud.net")
        .slice(-1)[0],
    );
  }
  const id = uuid();
  const image = await s3.Upload(
    {
      buffer: Buffer.from(await file.arrayBuffer()),
      name: id + file.name,
    },
    "/posts-images",
  );
  return image;
};

export const deletePostImage = async (imageUrl: string) => {
  if (!imageUrl) return false;
  const deleted = await s3.Remove(
    imageUrl.split("https://ivtipt-forum.storage.yandexcloud.net").slice(-1)[0],
  );
  return deleted;
};

export const uploadMessageImage = async (file?: File) => {
  if (!file) return false;
  const id = uuid();
  const image = await s3.Upload(
    {
      buffer: Buffer.from(await file.arrayBuffer()),
      name: id + file.name,
    },
    "/messages-images",
  );
  return image;
};
