"use client";
import { MenuItemsType } from "@/lib/shared-types";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import ImageSlider from "./ImageSlider";
import { Button } from "./ui/button";
import { MenuItemData } from "./MenuItemForm";

interface MenuListingProps {
  menu: MenuItemData | null;
  index: number;
}

const MenuListing = ({ menu, index }: MenuListingProps) => {
  //! for the loading animation
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  //! if the menu is not loaded yet or not visible load the placeholders
  if (!menu || !isVisible) return <MenuPlaceholder />;

  const imageUrls = menu.images.map((image) => {
    if (typeof image === "string") return image;
  });

  const validUrls = imageUrls.filter((url) => typeof url === "string");

  if (isVisible && menu) {
    return (
      <>
        <div className="flex flex-col w-full">
          <Link
            className={cn("invisible h-full w-full cursor-pointer group/main", {
              "visible animate-in fade-in-5": isVisible,
            })}
            href={`/menu/${menu._id}`}
          >
            <ImageSlider urls={validUrls} />
          </Link>

          <h3 className="mt-4 font-medium text-sm text-gray-700">
            {menu.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-3">
            {menu.description}
          </p>
          <p className="mt-1 font-medium text-sm text-gray-900">
            {formatPrice(menu.basePrice)}
          </p>
          <Button>Add to cart ({formatPrice(menu.basePrice)})</Button>
        </div>
      </>
    );
  }
  return <div>ProductListing</div>;
};

const MenuPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default MenuListing;
