"use client";

import MenuItemForm, { MenuItemData } from "@/components/MenuItemForm";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getMenuItem, updateMenuItem } from "../../new/actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";

const EditMenuItemPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [menuItem, setMenuItem] = useState<MenuItemData | null>(null);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isPending, setisPending] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/menu-items/?id=${id}`).then((response) => {
      setMenuItem(response.data);
    });
  }, [id]);

  // const { mutate: updateMenu, isPending } = useMutation({
  //   mutationKey: ["update-menu-item"],
  //   mutationFn: updateMenuItem,
  //   onMutate: () => {
  //     toast.loading("Updating menu item...");
  //   },
  //   onSuccess: ({ menuItem }) => {
  //     console.log(menuItem);
  //     toast.success(`${menuItem.name} updated successfully`);
  //     router.push("/profilee/menu-items");
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //     toast.error(`Failed to create menu item: ${error.message}`);
  //   },
  // });

  const handleSubmit = async (
    ev: FormEvent<HTMLFormElement>,
    data: MenuItemData
  ) => {
    ev.preventDefault();
    const updatePromise: Promise<void> = new Promise(
      async (resolve, reject) => {
        const response = await axios.put("/api/menu-items", { ...data, id });
        setisPending(true);
        if (response.status === 200) {
          setGoToProducts(true);
          setisPending(false);
          resolve();
        } else {
          reject();
        }
      }
    );

    await toast.promise(updatePromise, {
      loading: "Updating Menu Item...",
      success: "Menu Item Updated!",
      error: "Error",
    });
  };

  if (goToProducts) {
    router.push("/profile/menu-items");
  }

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Feast<span className="text-green-600">Dash</span>
          </h1>
          <h1 className="text-2xl font-semibold tracking-tight">
            Update Menu Item {menuItem?.name}
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
          <MenuItemForm
            onSubmit={handleSubmit}
            isPending={isPending}
            menuItem={menuItem ?? undefined}
          />
        </div>
        <div>
          <Button
            className={cn("w-full", buttonVariants({ variant: "destructive" }))}
            onClick={() => {
              axios.delete(`/api/menu-items/?_id=${id}`).then(() => {
                setGoToProducts(true);
                toast.success("Menu items deleted successfully");
              });
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditMenuItemPage;
