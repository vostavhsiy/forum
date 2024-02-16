export interface IAnswer {
  id: string
  postid: string
  commentid: string
  createdAt: Date
  userid: string
  text: string
  to: string
  subscribers: string[]
  subscribs: string[]
  likes: string[]
  dislikes: string[]
  author: {
    login: string
    id:string
  }
}
