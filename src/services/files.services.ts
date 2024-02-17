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

export const uploadMessageFile = async (file?: File) => {
  if (!file) return false;
  const id = uuid();
  const image = await s3.Upload(
    {
      buffer: Buffer.from(await file.arrayBuffer()),
      name: id + "---" + file.name,
    },
    "/messages-files",
  );
  return image;
};

export const downloadMessageFile = async (url: string) => {
  const file = await s3.Download(url);
  return file;
};

export const download = async (url: string) => {
  await fetch(url, { mode: "no-cors" })
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = url.split("---").slice(-1)[0];
      link.click();
    })
    .catch(console.error);
};

// export const download = async (url: string) => {
//   const file = await s3.Download(url);
//   if (!file) return;
//   const raw = atob(String(file.data.Body));
//   const binaryData = new Uint8Array(new ArrayBuffer(raw.length));
//   for (let i = 0; i < raw.length; i++) {
//     binaryData[i] = raw.charCodeAt(i);
//   }
//   const blob = new Blob([binaryData], {
//     type: file.data.ContentType,
//   });
//   let link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = url.split("---").slice(-1)[0];
//   link.click();
// };
