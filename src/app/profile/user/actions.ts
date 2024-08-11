"use server";

import { authOptions } from "@/lib/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import { getServerSession } from "next-auth";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

interface UserData {
  data: {
    name?: string;
    email?: string;
    phone?: string;
    streetAddress?: string;
    postalCode?: string;
    city?: string;
    isAdmin?: boolean;
  };
}

export const getUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const email = session?.user?.email;

  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ email }).select(["-password"]);
  const userInfo = await UserInfo.findOne({ email: user.email });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: userInfo?.phone,
      streetAddress: userInfo?.streetAddress,
      postalCode: userInfo?.postalCode,
      city: userInfo?.city,
    },
  };
};

export const updateUser = async ({ data }: UserData) => {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { name, isAdmin, ...otherUserInfo } = data;

  const email = session?.user?.email;

  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  await User.updateOne({ email }, { name, isAdmin });
  await UserInfo.findOneAndUpdate({ email: user.email }, otherUserInfo, {
    upsert: true,
  });

  return { success: true };
};
