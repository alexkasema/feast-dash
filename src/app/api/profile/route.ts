import { authOptions } from "@/lib/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const email = session?.user?.email;

  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ email }).select(["-password"]);

  if (!user) {
    throw new Error("User not found");
  }

  return NextResponse.json({ user: user.isAdmin });
}
