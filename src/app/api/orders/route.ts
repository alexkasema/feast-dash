import { authOptions, isAdmin } from "@/lib/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return NextResponse.error();

  const user = await User.findOne({ email }).select(["-password"]);

  if (!user) return NextResponse.error();

  const isUserAdmin = await isAdmin();

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  if (_id) {
    return NextResponse.json(await Order.findById(_id));
  }

  if (isUserAdmin) {
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return NextResponse.json(orders);
    } catch (error) {
      return NextResponse.error();
    }
  } else {
    try {
      const orders = await Order.find({ userEmail: email }).sort({
        createdAt: -1,
      });
      return NextResponse.json(orders);
    } catch (error) {
      return NextResponse.error();
    }
  }
}
