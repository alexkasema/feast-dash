"use client";

import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, X, Loader2, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../profile/user/actions";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CartPage = () => {
  const { items, removeItem, cartMenuTotal } = useCart();

  const router = useRouter();

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useState({});

  //! Fetch user profile
  const { data } = useQuery({
    queryKey: ["get-user-profile"],
    queryFn: async () => await getUser(),
    retry: 3,
    retryDelay: 500,
    refetchOnWindowFocus: false,
  });

  const user = data?.user;

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      if (window.location.href.includes("canceled=1")) {
        toast.error("Payment failed 😔");
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      const { phone, streetAddress, postalCode, city } = user;
      const userAddress = { phone, streetAddress, postalCode, city };
      setAddress(userAddress);
    }
  }, [user]);

  const proceedToCheckout = async () => {
    const savePromise: Promise<void> = new Promise(async (resolve, reject) => {
      setIsLoading(true);
      const response = await axios.post("/api/checkout", { items, address });
      if (response.status === 200) {
        router.push(response.data.url);
        // setGoToProducts(true);
        setIsLoading(false);
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(savePromise, {
      loading: "Preparing your order...",
      success: "Redirecting to payment...",
      error: "Something went wrong... Please try again later",
    });
  };

  //! Check if there is a user in session before proceeding to checkout
  const handleCheckout = () => {
    if (!user) {
      router.push("/sign-in?origin=cart");
      toast.error("Please sign in to proceed to checkout");
    } else {
      proceedToCheckout();
    }
  };

  let total = 0;
  if (isMounted) {
    for (const item of items) {
      // @ts-ignore
      total += cartMenuTotal(item.menu, item.size, item.extras);
    }
  }

  const DELIVERY_FEE = 3;

  return (
    <div className="flex min-h-screen w-full ">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Menu Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                isMounted && items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>
            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <h1 className="text-2xl font-semibold tracking-tight text-center">
                    Feast<span className="text-green-600">Dash</span>
                  </h1>
                </div>
                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">
                  Whoops! Nothing to show here yet.
                </p>
                <Link
                  href="/menu"
                  className={buttonVariants({
                    variant: "link",
                    size: "sm",
                    className: "text-sm text-muted-foreground",
                  })}
                >
                  Add items to your cart to checkout
                  <ArrowRight />
                </Link>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200":
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                items.map(({ menu, size, extras }, index) => {
                  const image = menu.images[0];
                  let selectedPrice = menu.basePrice;
                  if (size) {
                    selectedPrice += size.price;
                  }
                  if (extras!.length > 0) {
                    for (const extra of extras!) {
                      // @ts-ignore
                      selectedPrice += extra.price;
                    }
                  }
                  return (
                    <li key={menu._id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <div className="relative h-24 w-24">
                          <Image
                            fill
                            src={image}
                            alt="menu image"
                            className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        </div>
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link
                                  href={`/menu/${menu._id}`}
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {menu.name}
                                </Link>
                              </h3>
                            </div>

                            <div className="mt-1 flex text-sm">
                              <p className="text-muted-foreground">
                                {size && (
                                  <div className="text-sm">
                                    Size: <span>{size.name}</span>
                                  </div>
                                )}
                                {extras!.length > 0 && (
                                  <div className="text-sm text-gray-500">
                                    {extras?.map((extra) => (
                                      <div key={extra.name}>
                                        {extra.name} ${extra.price}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </p>
                            </div>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              Total:{" "}
                              {formatPrice(cartMenuTotal(menu, size, extras))}
                            </p>
                          </div>
                          <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                            <div className="absolute right-0 top-0">
                              <Button
                                aria-label="remove product"
                                onClick={() => removeItem(index)}
                                variant="ghost"
                              >
                                <X
                                  className="h-5 w-5 text-red-600"
                                  aria-hidden="true"
                                />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />

                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            {isMounted && items.length === 0 ? null : (
              <>
                <h2 className="text-lg font-medium text-gray-900">
                  Order summary
                </h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium text-gray-900">
                      {isMounted ? (
                        formatPrice(total)
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Delivery Fee</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {isMounted ? (
                        formatPrice(DELIVERY_FEE)
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">
                      Order Total
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {isMounted ? (
                        formatPrice(total + DELIVERY_FEE)
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    disabled={items.length === 0 || isLoading}
                    loadingText="Preparing your order"
                    isLoading={isLoading}
                    onClick={() => handleCheckout()}
                    className="w-full"
                    size="lg"
                  >
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
