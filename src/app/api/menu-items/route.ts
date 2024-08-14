import { isAdmin } from "@/lib/auth";
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
  if (await isAdmin()) {
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
  } else {
    return NextResponse.error();
  }
}

export async function POST(req: Request) {
  if (await isAdmin()) {
    try {
      const {
        name,
        description,
        basePrice,
        images,
        sizes,
        category,
        extraIngredientPrices,
      } = await req.json();
      const menuItem = new MenuItem({
        name,
        description,
        basePrice,
        images,
        sizes,
        category,
        extraIngredientPrices,
      });
      await menuItem.save();
      return NextResponse.json(menuItem);
    } catch (error) {
      return NextResponse.error();
    }
  } else {
    return NextResponse.error();
  }
}

export async function PUT(req: Request) {
  if (await isAdmin()) {
    try {
      const {
        name,
        description,
        basePrice,
        images,
        sizes,
        category,
        extraIngredientPrices,
        id,
      } = await req.json();
      const menuItem = await MenuItem.updateOne(
        { _id: id },
        {
          name,
          description,
          basePrice,
          images,
          sizes,
          category,
          extraIngredientPrices,
        }
      );

      return NextResponse.json(true);
    } catch (error) {
      return NextResponse.error();
    }
  }
}

export async function DELETE(req: Request) {
  if (await isAdmin()) {
    try {
      const url = new URL(req.url);
      const _id = url.searchParams.get("_id");
      await MenuItem.deleteOne({ _id });
      return NextResponse.json(true);
    } catch (error) {
      return NextResponse.error();
    }
  }
}
