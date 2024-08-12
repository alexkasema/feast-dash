"use server";

import { isAdmin } from "@/lib/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export const getCategories = async () => {
  const categories = await Category.find({}).select(["-__v"]);
  return {
    categories: categories.map((category) => ({
      _id: category._id.toString(),
      categoryName: category.name,
    })),
  };
};

export const createCategory = async ({
  data,
}: {
  data: { categoryName: string };
}) => {
  const { categoryName } = data;

  if (!categoryName) {
    throw new Error("Category name is required");
  }

  if (await isAdmin()) {
    const category = await Category.create({ name: categoryName });
    return {
      category: {
        _id: category._id.toString(),
        categoryName: category.name,
      },
    };
  } else {
    return {};
  }
};

export const updateCategory = async ({
  editedData,
}: {
  editedData: { categoryName: string; _id: string };
}) => {
  const { categoryName, _id } = editedData;
  if (await isAdmin()) {
    await Category.updateOne({ _id }, { name: categoryName });
  }
  return { success: true };
};

export const deleteCategory = async (id: string) => {
  if (await isAdmin()) {
    await Category.deleteOne({ _id: id });
  }
  return { success: true };
};
