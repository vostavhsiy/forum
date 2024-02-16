import { Tag, User, Comment } from "@prisma/client";

export interface IPost {
  id: string;
  title: string;
  text: string;
  image: string;
  userId: string;
  views: number;
  tags: Tag[];
  createdAt: Date;
  comments: Comment[];
  author: User;
}
