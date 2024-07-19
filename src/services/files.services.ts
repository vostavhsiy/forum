import { default as EasyYandexS3 } from "easy-yandex-s3";
import { v4 as uuid } from "uuid";
import CyrillicToTranslit from "cyrillic-to-translit-js";

import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getBlob,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "@firebase/storage";

const firebaseConfig = {
  apiKey: process.env.STORAGE_API_KEY,
  authDomain: process.env.STORAGE_AUTH_DOMAIN,
  projectId: process.env.STORAGE_PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.STORAGE_MESSAGING_SENDER_ID,
  appId: process.env.STORAGE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const storageRoutes = {
  usersAvatars: "users-avatars/",
  postsImages: "posts-images/",
  messagesImages: "messages-images/",
  messagesFiles: "messages-files/",
};

//@ts-ignore
const cyrillicToTranslit = new CyrillicToTranslit();

export const transliteName = (fileName: string) => {
  return (
    cyrillicToTranslit.transform(fileName.split(".")[0], "_") +
    "." +
    fileName.split(".").slice(-1)[0]
  );
};

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
  const imageRef = ref(storage, storageRoutes.usersAvatars + id);
  const image = await uploadBytes(imageRef, file);
  return getDownloadURL(image.ref);
};

export const changeUserAvatar = async (file?: File, oldImageUrl?: string) => {
  if (!file) return false;
  const imageRef = ref(storage, oldImageUrl);
  const image = await uploadBytes(imageRef, file);
  return getDownloadURL(image.ref);
};

export const uploadPostImage = async (file?: File) => {
  if (!file) return false;
  const id = uuid();
  const imageRef = ref(storage, storageRoutes.postsImages + id);
  const image = await uploadBytes(imageRef, file);
  return getDownloadURL(image.ref);
};

export const changePostImage = async (file?: File, oldImageUrl?: string) => {
  if (!file) return false;
  const imageRef = ref(storage, oldImageUrl);
  const image = await uploadBytes(imageRef, file);
  return getDownloadURL(image.ref);
};

export const deletePostImage = (url: string) => {
  if (!url) return false;
  const imageRef = ref(storage, url);
  return deleteObject(imageRef);
};

export const uploadMessageImage = async (file?: File) => {
  if (!file) return false;
  const id = uuid();
  const imageRef = ref(storage, storageRoutes.messagesImages + id);
  const image = await uploadBytes(imageRef, file);
  return getDownloadURL(image.ref);
};

export const uploadMessageFile = async (file?: File) => {
  if (!file) return false;
  const id = uuid();
  const imageRef = ref(storage, storageRoutes.messagesFiles + id);
  const image = await uploadBytes(imageRef, file);
  return getDownloadURL(image.ref);
};

export const downloadMessageFile = async (url: string) => {
  const imageRef = ref(storage, url);
  await getBlob(imageRef);
};

export const download = async (file: Blob, type: string, name: string) => {
  let link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = name;
  link.click();
};
