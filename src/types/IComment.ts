import { IAnswer } from "@/types/IAnswer"

export interface IComment {
  id: string
  createdAt: Date
  userid: string
  postid: string
  text: string
  to: string
  likes: string[]
  dislikes: string[]
  answers: IAnswer[]
  author: {
    login: string
    id: string
  }
}
