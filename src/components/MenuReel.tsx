"use client";

import { MenuItemsType } from "@/lib/shared-types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React from "react";
import MenuListing from "./MenuListing";
import { MenuItemData } from "./MenuItemForm";

interface MenuReelProps {
  title: string;
  subtitle?: string;
  href?: string;
}

const FALLBACK_LIMIT = 4;

const MenuReel = (props: MenuReelProps) => {
  const { title, subtitle, href } = props;

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const response = await axios.get("/api/reel-menu-items");
      return response.data;
    },
    retry: 3,
    retryDelay: 500,
    refetchOnWindowFocus: false,
  });

  let menuItemsList: (MenuItemData | null)[] = [];
  if (menuItems && menuItems.length) {
    menuItemsList = menuItems;
  } else if (isLoading) {
    menuItemsList = new Array<null>(FALLBACK_LIMIT).fill(null);
  }

  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="hidden text-sm font-medium text-green-600 hover:text-green-500 md:block"
          >
            Visit our menu <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {menuItemsList.map((menu, i) => (
              <MenuListing key={`menu-${i}`} menu={menu} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuReel;
