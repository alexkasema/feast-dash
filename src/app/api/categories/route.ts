import { isAdmin } from "@/lib/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export async function GET() {
  if (await isAdmin()) {
    try {
      const categories = await Category.find({});
      return NextResponse.json(categories);
    } catch (error) {
      return NextResponse.error();
    }
  } else {
    return NextResponse.error();
  }
}
