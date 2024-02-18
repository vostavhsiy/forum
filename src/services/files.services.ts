import { default as EasyYandexS3 } from "easy-yandex-s3";
import { v4 as uuid } from "uuid";

// Инициализация
export const s3 = new EasyYandexS3({
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

// export const download = async (url: string) => {
//   try {
//     const res = await fetch(url, { mode: "no-cors" });
//     console.log(res);
//     const file = await res.blob();
//     const binaryData = await file.arrayBuffer();
//     const blob = new Blob([binaryData], {
//       type: file.type,
//     });
//     let link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = url.split("---").slice(-1)[0];
//     link.click();
//   } catch (e) {
//     console.log(e);
//   }
// };

export const download = async (
  file: Uint8Array,
  type: string,
  name: string,
) => {
  const binaryData = new Uint8Array(file);
  const blob = new Blob([file], {
    type,
  });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
};
