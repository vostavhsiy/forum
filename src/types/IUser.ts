import { IPost } from "./IPost"

export interface IUser {
  id: string
  login: string
  password: string
  image: string
  role: "admin" | "editor" | "user"
  subscribers: string[]
  subscribs: string[]
  favs: string[]
  posts: IPost[]
}

export interface IUserPost {
  id: string
  title: string
  createdAt: string
}

export interface IFav {
  id: string
  title: string
  postId: string
}

export interface ISubscribedUser {
  userId: string
  login: string
}
