"use client";

import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ShoppingCart } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import CartItem from "./CartItem";
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

const Cart = () => {
  const { items } = useCart();
  const itemCount = items.length;

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const cartTotal = items.reduce(
    (total, { menu }) => total + Number(menu.basePrice),
    0
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <Sheet>
      {/* <SheetTrigger asChild>
        <Link
          href="/menu"
          className={buttonVariants({
            variant: "link",
            size: "sm",
            className: "text-sm text-muted-foreground",
          })}
        >
          <ShoppingCart
            aria-hidden="true"
            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
            {isMounted ? itemCount : 0}
          </span>
        </Link>
      </SheetTrigger> */}
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg z-50">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className=" flex w-full flex-col pr-6">
              <ScrollArea className="relative h-[80%] w-full  overflow-auto">
                {items.map(({ menu, size, extras }, index) => (
                  <CartItem
                    menu={menu}
                    size={size}
                    extras={extras}
                    index={index}
                  />
                ))}
                <div className="space-y-4 pr-6">
                  <Separator />
                  <div className="space-y-1.5 text-sm">
                    <div className="flex">
                      <span className="flex-1">Delivery</span>
                      <span>Free</span>
                    </div>
                    <div className="flex">
                      <span className="flex-1">Total</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetTrigger asChild>
                      <Link
                        href="/cart"
                        className={buttonVariants({
                          className: "w-full",
                        })}
                      >
                        Continue to Checkout
                      </Link>
                    </SheetTrigger>
                  </SheetFooter>
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <h1 className="text-2xl font-semibold tracking-tight text-center">
                Feast<span className="text-green-600">Dash</span>
              </h1>
            </div>
            <div className="text-xl font-semibold">Your cart is empty</div>
            <SheetTrigger asChild>
              <Link
                href="/menu"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
