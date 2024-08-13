"use client";

import MenuItemForm, { MenuItemData } from "@/components/MenuItemForm";
import { buttonVariants } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FormEvent } from "react";
import { createMenuItem } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateMenuItemPage = () => {
  const router = useRouter();
  const { mutate: createMenu, isPending } = useMutation({
    mutationKey: ["create-menu-item"],
    mutationFn: createMenuItem,
    onMutate: () => {
      toast.loading("Creating menu item...");
    },
    onSuccess: ({ menuItem }) => {
      console.log(menuItem);
      toast.success(`${menuItem.name} created successfully`);
      router.push("/profile/menu-items");
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to create menu item: ${error.message}`);
    },
  });

  const handleSubmit = (ev: FormEvent<HTMLFormElement>, data: MenuItemData) => {
    ev.preventDefault;
    console.log(data);
    createMenu(data);
  };

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Feast<span className="text-green-600">Dash</span>
          </h1>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create A Menu Item
          </h1>

          <Link
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5",
            })}
            href="/profile/menu-items"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </div>
        <div>
          <MenuItemForm onSubmit={handleSubmit} isPending={isPending} />
        </div>
      </div>
    </div>
  );
};

export default CreateMenuItemPage;
