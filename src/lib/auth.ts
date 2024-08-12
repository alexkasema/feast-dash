import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getServerSession, NextAuthOptions } from "next-auth";
import { User } from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { mongooseConnect } from "./mongoose";

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;

        mongoose.connect(process.env.MONGODB_URI as string);
        const user = await User.findOne({ email });
        const passwordOk = user && bcrypt.compareSync(password!, user.password);

        if (passwordOk) {
          return user;
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      const userEmail = token.email;
      mongoose.connect(process.env.MONGODB_URI as string);
      const user = await User.findOne({ email: userEmail });
      return {
        ...session,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    },
  },
};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return false;
  }
  const email = session?.user?.email;
  if (!email) {
    return false;
  }
  mongoose.connect(process.env.MONGODB_URI as string);
  const user = await User.findOne({ email });
  return user?.isAdmin;
}
