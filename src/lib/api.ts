import axios from "axios";
import { IUser } from "@/types/IUser";
import { IPost } from "@/types/IPost";
import { IComment } from "@/types/IComment";
import { ITag } from "@/types/ITag";
import { INotification } from "@/types/INotification";
import { IReport } from "@/types/IReport";

export const url = "localhost";

const instance = axios.create({
  baseURL: `http://${url}:6006/`,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.setAuthorization(`Bearer ${accessToken}`);
    }
  }
  return config;
});

instance.interceptors.response.use(
  (config) => config,
  async (error) => {
    const config = error.config;
    if (config) {
      if (error.response && error.response.status === 401 && !config.sent) {
        config.sent = true;
        const { data } = await axios.get<{
          accessToken: string;
        }>(`http://${url}:6006/auth/refresh`, { withCredentials: true });
        localStorage.setItem("token", data.accessToken);
        const res = await instance.request(config);
        return res;
      }
    }
    throw error;
  },
);

export interface createReportPayload {
  text: string;
  reportAuthor: {
    id: string;
    login: string;
  };
  postId: string;
}

export class Api {
  static registration(payload: { login: string; password: string }) {
    return instance.post<IUser>("/auth/registration", payload).then((res) => {
      return res.data;
    });
  }

  static login(payload: { login: string; password: string }) {
    return instance
      .post<{
        accessToken: string;
        user: { id: string; login: string };
      }>("/auth/login", payload)
      .then((res) => {
        return res.data;
      });
  }

  static logout() {
    return instance.get("/auth/logout").then((res) => {
      return res.data;
    });
  }

  static refresh() {
    return instance
      .get<{
        accessToken: string;
        user: { id: string; login: string };
      }>("/auth/refresh")
      .then((res) => {
        return res.data;
      });
  }

  static getProfile(id: string) {
    return instance
      .get<IUser & { posts: IPost[] }>(`/profile/${id}`)
      .then((res) => {
        return res.data;
      });
  }

  static getPosts({
    search,
    size,
    page,
    tag,
    favs,
    sort,
  }: {
    favs?: boolean;
    page?: number;
    size?: number;
    search?: string;
    tag?: string;
    sort?: string;
  }) {
    return instance
      .get<{
        posts: IPost[];
        total: number;
      }>(`/posts?${search ? `search=${search}` : ""}${size ? `&size=${size}` : ""}${page ? `&page=${page}` : ""}${tag ? `&tag=${tag}` : ""}${favs ? `&favs=${favs}` : ""}${sort ? `&sort=${sort}` : ""}`)
      .then((res) => {
        return res.data;
      });
  }

  static getPost(id: string) {
    return instance.get<IPost>(`/posts/${id}`).then((res) => {
      return res.data;
    });
  }

  static createPost(
    payload:
      | {
          title: string;
          text: string;
          image?: string;
          tags?: string[];
        }
      | FormData,
  ) {
    return instance
      .post<IPost>("/posts", payload, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
      .then((res) => {
        return res.data;
      });
  }

  static deletePost(id: string) {
    return instance.delete<{ userId: string }>(`/posts/${id}`).then((res) => {
      return res.data;
    });
  }

  static createComment(payload: { text: string; postId: string; to?: string }) {
    return instance.post<IComment>(`/posts/comment`, payload).then((res) => {
      return res.data;
    });
  }

  static createAnswer(payload: {
    text: string;
    postId: string;
    to: string;
    commentId: string;
  }) {
    return instance
      .post<IComment>(`/posts/comment/answer`, payload)
      .then((res) => {
        return res.data;
      });
  }

  static likeComment(payload: { postId: string; commentId: string }) {
    return instance
      .post<IComment>(`/posts/comment/like`, payload)
      .then((res) => {
        return res.data;
      });
  }

  static dislikeComment(payload: { commentId: string; postId: string }) {
    return instance
      .post<IComment>(`/posts/comment/dislike`, payload)
      .then((res) => {
        return res.data;
      });
  }

  static addPostView(payload: { postId: string }) {
    return instance.post<IPost>(`/posts/view`, payload).then((res) => {
      return res.data;
    });
  }

  static getUsers({
    page,
    size,
    search,
  }: {
    page: number;
    size: number;
    search?: string;
  }) {
    console.log(search);

    return instance
      .get<{
        users: IUser[];
        total: number;
      }>(`/users/${page || 0}?size=${size || 4}${search ? `&search=${search}` : ""}`)
      .then((res) => {
        return res.data;
      });
  }

  static updateProfile(payload: { id: string; login: string; image: string }) {
    return instance.put<IUser>("/profile/edit", payload).then((res) => {
      return res.data;
    });
  }

  static getTags({
    search,
    size,
    page,
  }: {
    page?: number;
    size?: number;
    search?: string;
  }) {
    return instance
      .get<{
        tags: ITag[];
        total: number;
      }>(`/tags?${search ? `search=${search}` : ""}${size ? `&size=${size}` : ""}${page ? `&page=${page}` : ""}`)
      .then((res) => {
        return res.data;
      });
  }

  static addFavPost(payload: { postId: string; title: string; id: string }) {
    return instance
      .post<{
        postId: string;
        title: string;
        id: string;
        userId: string;
      }>(`/profile/favs`, payload)
      .then((res) => {
        return res.data;
      });
  }

  static deleteFavPost(payload: { id: string }) {
    return instance
      .delete<{ id: string }>(`/profile/favs/${payload.id}`)
      .then((res) => {
        return res.data;
      });
  }

  static subscribe(id: string) {
    return instance
      .put<{ code: number; id: string }>("/profile/subscribe", { id })
      .then((res) => {
        return res.data;
      });
  }

  static unsubscribe(id: string) {
    return instance
      .put<{ code: number; id: string }>("/profile/unsubscribe", { id })
      .then((res) => {
        return res.data;
      });
  }

  static getNotifications() {
    return instance
      .get<{
        id: string;
        notifications: INotification[];
      }>(`/profile/notification`)
      .then((res) => {
        return res.data;
      });
  }

  static deleteNotification(id: string) {
    return instance
      .delete<{ id: string }>(`/profile/notification/${id}`)
      .then((res) => {
        return res.data;
      });
  }

  static getFavsPosts() {
    return instance
      .get<{ posts: IPost[]; total: number }>(`/posts/favs`)
      .then((res) => {
        return res.data;
      });
  }

  static getPopularPosts() {
    return instance.get<IPost[]>(`/posts/popular`).then((res) => {
      return res.data;
    });
  }

  static deleteUser(id: string) {
    return instance.delete<IUser>(`/users/${id}`).then((res) => {
      return res.data;
    });
  }

  static upgradeUser(id: string) {
    return instance.put<IUser>(`/users/upgrade/${id}`).then((res) => {
      return res.data;
    });
  }

  static degradeUser(id: string) {
    return instance.put<IUser>(`/users/degrade/${id}`).then((res) => {
      return res.data;
    });
  }

  static getReports({ page, size }: { page: number; size: number }) {
    return instance
      .get<{
        reports: IReport[];
        total: number;
      }>(`/reports?${page ? `page=${page}` : ""}${page ? `&size=${size}` : ""}`)
      .then((res) => {
        return res.data;
      });
  }

  static createReport(payload: createReportPayload) {
    return instance.post<IReport>(`/reports`, payload).then((res) => {
      return res.data;
    });
  }

  static deleteReport(id: string) {
    return instance.delete<IReport>(`/reports/${id}`).then((res) => {
      return res.data;
    });
  }

  static getUserPosts(id: string) {
    return instance.get<IPost[]>(`/profile/${id}/posts`).then((res) => {
      return res.data;
    });
  }

  static getComments(id: string) {
    return instance.get<IComment[]>(`/posts/${id}/comments`).then((res) => {
      return res.data;
    });
  }

  static getAnswers(id: string) {
    return instance.get<IComment[]>(`/posts/${id}/answers`).then((res) => {
      return res.data;
    });
  }
}
