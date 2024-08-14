"use client";

import { MenuItemData } from "@/components/MenuItemForm";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getMenuItems } from "./new/actions";

import axios from "axios";

const MenuItemsPage = () => {
  // const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);

  // useEffect(() => {
  //   getMenuItems().then(({ menuItems }) => {
  //     setMenuItems(menuItems!);
  //   });
  // }, []);

  useEffect(() => {
    axios.get("/api/menu-items").then((res) => {
      setMenuItems(res.data);
    });
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
              <Link
                key={item._id}
                href={"/profile/menu-items/edit/" + item._id}
                className="bg-gray-200 rounded-lg p-4"
              >
                <div className="relative">
                  <Image
                    className="rounded-md"
                    src={item.images[0]}
                    alt={item.images[0]}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="text-center">{item.name}</div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenuItemsPage;
