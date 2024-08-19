"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { useEffect, useState } from "react";
import { Category } from "../profile/categories/page";
import { getCategories } from "../profile/categories/actions";
import { MenuItemData } from "@/components/MenuItemForm";
import axios from "axios";
import MenuListing from "@/components/MenuListing";
import { Loader2 } from "lucide-react";

const MenuPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);

  useEffect(() => {
    fetchCategories();
    axios.get("/api/menu").then((res) => {
      setMenuItems(res.data);
    });
  }, []);

  const fetchCategories = async () => {
    const fetched = await getCategories();
    setCategories(fetched.categories);
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <MaxWidthWrapper className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          <div className="mt-8">
            {categories.length > 0 ? (
              categories.map((c) => (
                <div key={c._id}>
                  <div className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
                    {c.categoryName}
                  </div>
                  <div className="w-full grid grid-cols-2 my-5 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
                    {menuItems
                      .filter((menu) => menu.category === c._id)
                      .map((menu, i) => (
                        <MenuListing key={`menu-${i}`} menu={menu} index={i} />
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex gap-3 justify-center text-center">
                <p>Loading menu items...</p>
                <Loader2 className="w-10 h-10 animate-spin text-zinc-500"></Loader2>
              </div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default MenuPage;
