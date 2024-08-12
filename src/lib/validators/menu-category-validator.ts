import { z } from "zod";

export const MenuCategoryValidator = z.object({
  categoryName: z.string().min(3, {
    message: "Category name must be at least 3 characters long.",
  }),
});

export type TMenuCategoryValidator = z.infer<typeof MenuCategoryValidator>;
