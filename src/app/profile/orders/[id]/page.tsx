"use client";

import { buttonVariants } from "@/components/ui/button";
import { OrderType } from "@/lib/shared-types";
import axios from "axios";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { cartMenuTotal } = useCart();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    getOrder();
  }, [id]);

  const getOrder = async () => {
    setIsLoading(true);
    await axios.get(`/api/orders/?_id=${id}`).then((response) => {
      setOrder(response.data);
    });
    setIsLoading(false);
  };

  console.log(order);

  return (
    <div className="flex min-h-screen w-full">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Feast<span className="text-green-600">Dash</span>
          </h1>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order Id:{" "}
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              order?._id
            )}
          </h1>

          <Link
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5",
            })}
            href="/profile/orders"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-7">
            <h2 className="sr-only">Order Details</h2>

            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <ul className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {order?.items.map(({ menu, size, extras }) => {
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
                              <h3 className="text-sm">{menu.name}</h3>
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
            )}
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">
              Delivery Summary
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Order Total</p>
                <p className="text-sm font-medium text-gray-900">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    `$ ${order?.total}`
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    order?.userEmail
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-sm font-medium text-gray-900">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    order?.phone
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Street Address</p>
                <p className="text-sm font-medium text-gray-900">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    order?.streetAddress
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Postal Code</p>
                <p className="text-sm font-medium text-gray-900">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    order?.postalCode
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">City</p>
                <p className="text-sm font-medium text-gray-900">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    order?.city
                  )}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
