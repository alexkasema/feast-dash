"use server";

import { MenuItemData } from "@/components/MenuItemForm";
import { isAdmin } from "@/lib/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { MenuItem } from "@/models/MenuItem";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export const getMenuItem = async (id: string) => {
  if (await isAdmin()) {
    const menuItem = await MenuItem.findById(id);

    return {
      menuItem: {
        _id: menuItem._id.toString(),
        name: menuItem.name,
        description: menuItem.description,
        basePrice: menuItem.basePrice,
        images: menuItem.images,
        sizes: menuItem.sizes,
        extraIngredientPrices: menuItem.extraIngredientPrices,
      },
    };
  } else {
    return {};
  }
};

export const getMenuItems = async () => {
  if (await isAdmin()) {
    const menuItems = await MenuItem.find({});

    if (menuItems.length > 0) {
      return {
        menuItems: menuItems.map((menuItem) => ({
          _id: menuItem._id.toString(),
          name: menuItem.name,
          description: menuItem.description,
          basePrice: menuItem.basePrice,
          images: menuItem.images,
          sizes: menuItem.sizes,
          extraIngredientPrices: menuItem.extraIngredientPrices,
        })),
      };
    } else {
      return {};
    }
  } else {
    return {};
  }
};

export const createMenuItem = async (data: MenuItemData) => {
  const { name, description, basePrice, images, sizes, extraIngredientPrices } =
    data;

  if (!name || !description || !basePrice || !images) {
    throw new Error("All fields are required");
  }

  const menuItem = await MenuItem.create({
    name,
    description,
    basePrice,
    images,
    sizes,
    extraIngredientPrices,
  });

  return {
    menuItem: {
      _id: menuItem._id.toString(),
      name: menuItem.name,
      description: menuItem.description,
      basePrice: menuItem.basePrice,
      images: menuItem.images,
      sizes: menuItem.sizes,
      extraIngredientPrices: menuItem.extraIngredientPrices,
    },
  };
};

export const updateMenuItem = async (data: MenuItemData) => {
  const {
    _id,
    name,
    description,
    basePrice,
    images,
    sizes,
    extraIngredientPrices,
  } = data;

  if (!_id || !name || !description || !basePrice || !images) {
    throw new Error("All fields are required");
  }

  if (await isAdmin()) {
    const menuItem = await MenuItem.findByIdAndUpdate(_id, {
      name,
      description,
      basePrice,
      images,
      sizes,
      extraIngredientPrices,
    });

    return {
      menuItem: {
        _id: menuItem._id.toString(),
        name: menuItem.name,
      },
    };
  } else {
    throw new Error("Unauthorized");
  }
};
