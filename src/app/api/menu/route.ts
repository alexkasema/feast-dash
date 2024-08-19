import { mongooseConnect } from "@/lib/mongoose";
import { MenuItem } from "@/models/MenuItem";
import { NextResponse } from "next/server";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    if (id) {
      const menuItem = await MenuItem.findById(id);
      return NextResponse.json(menuItem);
    }
    const menuItems = await MenuItem.find({});
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.error();
  }
}
