"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { MenuItemData } from "./MenuItemForm";
import { Button, buttonVariants } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";

interface MenuItem {
  menu: MenuItemData;
}

interface MenuListingProps {
  menu: MenuItemData | null;
  index: number;
}

interface ExtraIngredient {
  _id: string;
  name: string;
  price: number;
}

const AddToCartButton = ({ menu }: MenuItem) => {
  const { addItem } = useCart();

  const [name, setName] = useState(menu?.name || "");
  const [description, setDescription] = useState(menu?.description || "");
  const [basePrice, setBasePrice] = useState(menu?.basePrice || "");
  const [images, setImages] = useState<string[]>(menu?.images || []);
  const [category, setCategory] = useState(menu?.category || "");
  const [sizes, setSizes] = useState(menu?.sizes || []);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState(
    menu?.extraIngredientPrices || []
  );
  const [selectedSize, setSelectedSize] = useState<{
    name: string;
    price: number;
  } | null>(null);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (menu) {
      setName(menu.name);
      setDescription(menu.description);
      setBasePrice(menu.basePrice);
      setImages(menu.images);
      setCategory(menu.category);
      setSizes(menu.sizes ?? []);
      setExtraIngredientPrices(menu.extraIngredientPrices ?? []);
    }
  }, [menu]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isSuccess]);

  const hasSizesOrExtras = sizes.length > 0 || extraIngredientPrices.length > 0;

  async function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addItem(menu!, selectedSize, selectedExtras);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowPopup(false);
    toast.success("Added to cart");
  }

  function handleExtraThingClick(
    ev: FormEvent<HTMLInputElement>,
    extraThing: ExtraIngredient
  ) {
    const checked = (ev.target as HTMLInputElement).checked;
    if (checked) {
      // @ts-ignore
      setSelectedExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectedExtras((prev) => {
        // @ts-ignore
        return prev.filter((e) => e.name !== extraThing.name);
      });
    }
  }

  let selectedPrice = basePrice;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      // @ts-ignore
      selectedPrice += extra.price;
    }
  }

  if (menu) {
    return (
      <>
        {showPopup && (
          <div
            onClick={() => setShowPopup(false)}
            className=" fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <div
              onClick={(ev) => ev.stopPropagation()}
              className="my-8 bg-white p-2 rounded-lg max-w-md  z-50"
            >
              <div
                className="overflow-y-scroll p-2 relative"
                style={{ maxHeight: "calc(100vh - 100px)" }}
              >
                <Image
                  src={images[0]}
                  alt={name}
                  width={300}
                  height={200}
                  className="mx-auto -z-20"
                />
                <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
                <p className="text-center text-gray-500 text-sm mb-2">
                  {description}
                </p>
                {sizes?.length > 0 && (
                  <div className="py-2">
                    <h3 className="text-center text-gray-700">
                      Pick your size
                    </h3>
                    {sizes.map((size, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 p-4 border rounded-md mb-1"
                      >
                        <input
                          type="radio"
                          // @ts-ignore
                          onChange={() => setSelectedSize(size)}
                          // @ts-ignore
                          checked={selectedSize?.name === size.name}
                          name="size"
                        />
                        {size.name} {formatPrice(basePrice + size.price)}
                      </label>
                    ))}
                  </div>
                )}
                {extraIngredientPrices?.length > 0 && (
                  <div className="py-2">
                    <h3 className="text-center text-gray-700">Any extras?</h3>
                    {extraIngredientPrices.map((extraThing, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 p-4 border rounded-md mb-1"
                      >
                        <input
                          type="checkbox"
                          onChange={(ev) =>
                            // @ts-ignore
                            handleExtraThingClick(ev, extraThing)
                          }
                          checked={selectedExtras
                            .map((e: ExtraIngredient) => e._id)
                            // @ts-ignore
                            .includes(extraThing._id)}
                          name={extraThing.name}
                        />
                        {extraThing.name} +{formatPrice(extraThing.price)}
                      </label>
                    ))}
                  </div>
                )}
                <Button
                  type="button"
                  className="mt-2 w-full"
                  onClick={() => {
                    handleAddToCartButtonClick();
                    setIsSuccess(true);
                  }}
                >
                  {isSuccess
                    ? "Added!"
                    : ` Add to cart ${formatPrice(selectedPrice)}`}
                </Button>
                <Button
                  className={cn(
                    "mt-2 w-full",
                    buttonVariants({ variant: "destructive" })
                  )}
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {hasSizesOrExtras ? (
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCartButtonClick}
          >
            Add to cart (from {formatPrice(basePrice)})
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              handleAddToCartButtonClick();
              setIsSuccess(true);
            }}
          >
            {isSuccess ? "Added!" : ` Add to cart ${formatPrice(basePrice)}`}
          </Button>
        )}
      </>
    );
  }
  return (
    <Button size="lg" className="w-full">
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
