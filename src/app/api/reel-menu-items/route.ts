import { mongooseConnect } from "@/lib/mongoose";
import { MenuItem } from "@/models/MenuItem";
import { NextResponse } from "next/server";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export async function GET() {
  try {
    const menuItems = await MenuItem.find({}).limit(4);
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json([]);
  }
}
