"use client";

import { MenuItemData } from "@/components/MenuItemForm";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

import axios from "axios";
import { cn } from "@/lib/utils";
import ImageSlider from "@/components/ImageSlider";

const MenuItemsPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  //! Fetch menu items on mount
  useEffect(() => {
    axios.get("/api/menu-items").then((res) => {
      setMenuItems(res.data);
    });
    setIsMounted(true);
  }, []);

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Link
          className={buttonVariants({
            variant: "default",
            className: "gap-1.5",
          })}
          href="/profile/menu-items/new"
        >
          Create a new menu item
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div>
        <h2 className=" mt-8">Edit menu item:</h2>
        <div className="grid grid-cols-3 gap-2 ">
          {menuItems?.length > 0 &&
            menuItems.map((item) => (
              <div key={item._id} className="flex flex-col w-[50%]">
                <Link
                  className={cn(
                    "invisible h-full w-full cursor-pointer group/main",
                    {
                      "visible animate-in fade-in-5": isMounted,
                    }
                  )}
                  href={"/profile/menu-items/edit/" + item._id}
                >
                  <ImageSlider urls={item.images} />
                </Link>

                <h3 className="mt-4 font-medium text-sm text-gray-700">
                  {item.name}
                </h3>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenuItemsPage;
