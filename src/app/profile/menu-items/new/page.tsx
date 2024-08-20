"use client";

import MenuItemForm, { MenuItemData } from "@/components/MenuItemForm";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

const CreateMenuItemPage = () => {
  const router = useRouter();
  const [goToProducts, setGoToProducts] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (
    ev: FormEvent<HTMLFormElement>,
    data: MenuItemData
  ) => {
    ev.preventDefault();

    const savePromise: Promise<void> = new Promise(async (resolve, reject) => {
      const response = await axios.post("/api/menu-items", data);
      setIsPending(true);
      if (response.status === 200) {
        setGoToProducts(true);
        setIsPending(false);
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(savePromise, {
      loading: "Creating Menu Item...",
      success: "Menu Item Created!",
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
