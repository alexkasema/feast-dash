"use server";

import { mongooseConnect } from "@/lib/mongoose";
import { TAuthCredentialsValidator } from "@/lib/validators/account-credentials-validator";
import { User } from "@/models/User";

import bcrypt from "bcryptjs";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export const signUpUser = async ({
  email,
  password,
}: TAuthCredentialsValidator) => {
  if (!password.length || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const user = await User.findOne({ email });

  if (user) {
    throw new Error("User already exists");
  }

  const notHashedPassword = password;

  const salt = bcrypt.genSaltSync(10);

  const hashedPassword = bcrypt.hashSync(notHashedPassword, salt);

  const createdUser = await User.create({ email, password: hashedPassword });

  if (!createdUser) throw new Error("Could not create user");

  return { success: true };
};
