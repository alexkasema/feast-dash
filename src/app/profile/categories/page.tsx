"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  MenuCategoryValidator,
  TMenuCategoryValidator,
} from "@/lib/validators/menu-category-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./actions";
import { toast } from "sonner";

interface Category {
  _id: string;
  categoryName: string;
}

const CategoriesPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const fetched = await getCategories();
    setCategories(fetched.categories);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TMenuCategoryValidator>({
    resolver: zodResolver(MenuCategoryValidator),
  });

  const { mutate: createMenuCategory, isPending } = useMutation({
    mutationKey: ["create-menu-category"],
    mutationFn: createCategory,
    onSuccess: ({ category }) => {
      toast.success(`${category?.categoryName} Category created successfully`);
      setCategoryName("");
      setEditedCategory(null);
      fetchCategories();
    },
    onError: (err) => {
      toast.error(`Failed to create category: ${err.message}`);
    },
  });

  const { mutate: updateMenuCategory, isPending: isPendingUpdate } =
    useMutation({
      mutationKey: ["update-menu-category"],
      mutationFn: updateCategory,
      onSuccess: () => {
        setCategoryName("");
        toast.success(` Category updated successfully`);
        setEditedCategory(null);
        fetchCategories();
      },
      onError: (err) => {
        toast.error(`Failed to update category: ${err.message}`);
      },
    });

  const onSubmit = async ({ categoryName }: TMenuCategoryValidator) => {
    const data = { categoryName };
    if (editedCategory) {
      const _id = editedCategory._id;
      const editedData = { ...data, _id };
      updateMenuCategory({ editedData });
      setCategoryName("");
    } else {
      createMenuCategory({ data });
      setCategoryName("");
    }
  };
  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <Label htmlFor="categoryName">
              {editedCategory ? "Update category" : "New category name"}
              {editedCategory && (
                <>
                  : <b>{editedCategory.categoryName}</b>
                </>
              )}
            </Label>
            <Input
              {...register("categoryName")}
              className={cn("w-full", {
                "focus-visible:ring-red-500": errors.categoryName,
              })}
              type="text"
              placeholder={
                editedCategory
                  ? `Update category: ${categoryName}`
                  : "Enter menu category"
              }
            />
            {errors?.categoryName && (
              <p className="text-sm text-red-500">
                {errors.categoryName.message}
              </p>
            )}
          </div>

          <div
            className={cn("flex gap-2 ", {
              "pb-5": errors.categoryName,
            })}
          >
            <Button
              disabled={editedCategory ? isPendingUpdate : isPending}
              isLoading={editedCategory ? isPendingUpdate : isPending}
              loadingText={
                editedCategory ? "Updating category" : "Creating new category"
              }
            >
              {editedCategory ? "Update" : "Create"}
            </Button>
            {editedCategory && (
              <Button
                onClick={() => {
                  setEditedCategory(null);
                  setCategoryName("");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </form>
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Existing categories</h2>
        {categories?.length > 0 &&
          categories.map((c) => (
            <div
              key={c._id}
              className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center"
            >
              <div className="grow">{c.categoryName}</div>
              <div className="flex gap-1">
                <Button
                  onClick={() => {
                    setEditedCategory(c);
                    setCategoryName(c.categoryName);
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    deleteCategory(c._id);
                    fetchCategories();
                    toast.success(`${c.categoryName} Category deleted`);
                  }}
                  className={buttonVariants({ variant: "destructive" })}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default CategoriesPage;
