"use client";

import AddToCartButton from "@/components/AddToCartButton";
import ImageSlider from "@/components/ImageSlider";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { MenuItemData } from "@/components/MenuItemForm";
import MenuReel from "@/components/MenuReel";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import axios from "axios";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const MenuDetailsPage = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState<MenuItemData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!id) return;
    getMenu();
  }, [id]);

  const getMenu = async () => {
    setIsLoading(true);
    await axios.get(`/api/menu/?id=${id}`).then((res) => {
      setMenu(res.data);
      setIsLoading(false);
    });
  };

  const BREADCRUMBS = [
    { id: 1, name: "Home", href: "/" },
    { id: 2, name: "menus", href: "/menu" },
  ];

  if (!menu) {
    return <Loader2 className="w-10 h-10 animate-spin text-zinc-500" />;
  }

  const imageUrls = menu.images.map((image) => {
    if (typeof image === "string") return image;
  });

  const validUrls = imageUrls.filter((url) => typeof url === "string");

  return (
    <MaxWidthWrapper>
      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product Details */}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={breadcrumb.href}
                      className="font-medium text-sm text-muted-foreground hover:text-gray-900"
                    >
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {menu?.name}
              </h1>
            </div>

            <section className="mt-4">
              <div className="flex items-center">
                <p className="font-medium text-gray-900">
                  Price: {menu?.basePrice && formatPrice(menu.basePrice)}
                </p>
              </div>
              <div className="mt-1 flex flex-col text-sm">
                <p className="text-muted-foreground">
                  Sizes:{" "}
                  {menu?.sizes &&
                    menu.sizes.map((size, i) => (
                      <span key={size.name}>
                        {size.name} ${size.price}
                        {i !== menu.sizes!.length - 1 ? ", " : ""}
                      </span>
                    ))}
                </p>
                <p className="text-muted-foreground">
                  Extras:{" "}
                  {menu?.extraIngredientPrices &&
                    menu.extraIngredientPrices.map((extra, i) => (
                      <span key={extra.name}>
                        {extra.name} ${extra.price}
                        {i !== menu.extraIngredientPrices!.length - 1
                          ? ", "
                          : ""}
                      </span>
                    ))}
                </p>
              </div>

              <div className="mt-4 space-y-6">
                <p className="text-base text-muted-foreground">
                  {menu?.description}
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <Check
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                />
                <p className="ml-2 text-sm text-muted-foreground">
                  Eligible for instant delivery
                </p>
              </div>
            </section>
          </div>

          {/* Product images */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-lg">
              {isLoading ? (
                <MenuPlaceholder />
              ) : (
                <ImageSlider urls={validUrls} />
              )}
            </div>
          </div>

          {/* add to cart part */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div>
              <div className="mt-10">
                <AddToCartButton menu={menu!} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <MenuReel title="Checkout our other menus" href="/menu" />
    </MaxWidthWrapper>
  );
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

export default MenuDetailsPage;
