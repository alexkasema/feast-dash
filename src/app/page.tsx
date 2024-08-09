import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-50 grainy-light">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-15 xl:pt-25 lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-4xl lg:text-5xl">
                Welcome to FeastDash where gourmet flavors meet the comfort of
                your home
              </h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Discover our{" "}
                <span className="font-semibold">mouth-watering dishes</span>,
                crafted with love and delivered{" "}
                <span className="font-semibold">fresh</span> to your door.{" "}
                <span className="font-semibold">Order online today</span> and
                savor the FeastDash experience!
              </p>
              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Exclusive FeastDash Creations
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Convenient Online Ordering
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Fast, Fresh Delivery
                  </li>
                </div>
              </ul>
            </div>
          </div>

          <div className="col-span-full lg:col-span-1 w-full flex justify-center md:flex-col px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
            <div className="relative md:max-w-xl">
              <img
                src="/deliciousMeals.png"
                className=" object-cover min-w-full min-h-full"
                alt="Delicious Meals Image"
              />
            </div>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Link
                href="/"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full bg-primary",
                })}
              >
                {" "}
                Order Now
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
