import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
    GithubProvider({
      clientId: String(process.env.GITHUB_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        const userCredentials = {
          email: credentials?.email,
          password: credentials?.password,
        };
        try {
          const res = await axios.post(
            `${process.env.NEXTAUTH_URL}/api/user/login`,
            userCredentials,
          );
          const user = res.data;
          const { password, ...rest } = user;
          if (user) {
            return user as User;
          } else {
            return null;
          }
        } catch (e) {
          const err = e as Error;
          console.log(err.message);
          return null;
        }
      },
    }),
  ],

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token, user }) {
      session = {
        ...session,
        user: {
          ...session.user,
          id: String(token.sub),
        },
      };
      return session;
    },
  },
};
