import { isAdmin } from "@/lib/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import { NextResponse } from "next/server";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (await isAdmin()) {
    if (id) {
      const user = await User.findById(id).select(["-password"]);
      if (!user) {
        return NextResponse.error();
      }
      const userInfo = await UserInfo.findOne({ email: user.email });

      return NextResponse.json({ ...user.toJSON(), ...userInfo?.toJSON() });
    }
    const users = await User.find({}).select(["-password"]);
    return NextResponse.json(users);
  } else {
    return NextResponse.json([]);
  }
}
