"use server";

import { MenuItemData } from "@/components/MenuItemForm";
import { isAdmin } from "@/lib/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { MenuItem } from "@/models/MenuItem";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export const getMenuItems = async () => {
  if (await isAdmin()) {
    const menuItems = await MenuItem.find({});

    return {
      menuItems: menuItems.map((menuItem) => ({
        _id: menuItem._id.toString(),
        name: menuItem.name,
        description: menuItem.description,
        basePrice: menuItem.basePrice,
        images: menuItem.images,
      })),
    };
  } else {
    return {};
  }
};

export const createMenuItem = async (data: MenuItemData) => {
  const { name, description, basePrice, images } = data;

  if (!name || !description || !basePrice || !images) {
    throw new Error("All fields are required");
  }

  const menuItem = await MenuItem.create({
    name,
    description,
    basePrice,
    images,
  });

  return {
    menuItem: {
      _id: menuItem._id.toString(),
      name: menuItem.name,
      description: menuItem.description,
      basePrice: menuItem.basePrice,
      images: menuItem.images,
    },
  };
};
