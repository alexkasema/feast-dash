import { MenuItemData } from "@/components/MenuItemForm";
import { authOptions } from "@/lib/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { notFound, useSearchParams } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import ClearCartComponent from "./ClearCartComponent";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

const ThankYouPage = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId;

  const session = await getServerSession(authOptions);
  const order = await Order.findOne({ _id: orderId });

  if (!order || order.userEmail !== session?.user?.email) {
    return notFound();
  }

  const DELIVERY_FEE = 3;

  return (
    <main className="relative lg:min-h-full">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Feast<span className="text-green-600">Dash</span>
          </h1>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium text-blue-600">
              Order successful
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks for ordering
            </h1>
            <ClearCartComponent />
            {order.isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your order has been received and is being processed 😊.
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order, and we&apos;re currently processing
                it. So hang tight and we&apos;ll send you confirmation very
                soon!
              </p>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Order nr.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>

              <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                {/* @ts-ignore */}
                {order.items.map(({ menu, size, extras }) => {
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
                    <li key={menu._id} className="flex space-x-6 py-6">
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

                      <div className="flex-auto flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-gray-900">{menu.name}</h3>
                        </div>
                      </div>

                      <div className="mt-1 flex text-sm">
                        <div className="text-muted-foreground">
                          {size && (
                            <p className="text-sm">
                              Size: <span>{size.name}</span>
                            </p>
                          )}
                          {extras!.length > 0 && (
                            <div className="text-sm text-gray-500">
                              {/* @ts-ignore */}
                              {extras?.map((extra) => (
                                <div key={extra.name}>
                                  {extra.name} ${extra.price}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="flex-none font-medium text-gray-900">
                        {formatPrice(selectedPrice)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <div className="mt-16 text-sm font-medium">
              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="text-gray-900">{formatPrice(order.subTotal)}</p>
                </div>

                <div className="flex justify-between">
                  <p>Transaction Fee</p>
                  <p className="text-gray-900">{formatPrice(DELIVERY_FEE)}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <p className="text-base">Total</p>
                  <p className="text-base">{formatPrice(order.total)}</p>
                </div>
              </div>

              {order.isPaid && (
                <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-900">Delivering To</p>
                    <p>
                      {order.userEmail}, {order.phone}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">Order Status</p>
                    <p>
                      {order.isPaid ? "Payment successful" : "Pending payment"}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <Link
                  href="/menu"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Continue shopping &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
