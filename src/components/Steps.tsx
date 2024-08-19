"use client";

import { getUser } from "@/app/profile/user/actions";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const ADMIN_STEPS = [
  { name: "Profile", url: "/profile/user" },
  { name: "Categories", url: "/profile/categories" },
  { name: "Menu Items", url: "/profile/menu-items" },
  { name: "Users", url: "/profile/users" },
  { name: "Orders", url: "/profile/orders" },
];

const USER_STEPS = [
  { name: "Profile", url: "/profile/user" },
  { name: "Orders", url: "/profile/orders" },
];

const Steps = () => {
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ["get-user-profile"],
    queryFn: async () => await getUser(),
    retry: 3,
    retryDelay: 500,
  });

  const isAdmin = data?.user?.isAdmin;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ol className="flex mx-auto gap-2 justify-center flex-wrap rounded-md bg-white lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
        {isAdmin
          ? ADMIN_STEPS.map((step, i) => {
              const isCurrent = pathname.includes(step.url);

              return (
                <li
                  key={step.name}
                  className="relative overflow-hidden lg:flex-1"
                >
                  <Link href={step.url}>
                    <span
                      className={cn(
                        "absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full",
                        {
                          "bg-primary": isCurrent,
                        }
                      )}
                      aria-hidden="true"
                    />

                    <span
                      className={cn(
                        i !== 0 ? "lg:pl-9" : "",
                        "flex items-center px-6 py-4 text-sm font-medium"
                      )}
                    >
                      <span className="ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center">
                        <span
                          className={cn("text-sm font-semibold text-zinc-700", {
                            "text-primary": isCurrent,
                          })}
                        >
                          {step.name}
                        </span>
                      </span>
                    </span>

                    {/* separator */}
                    {i !== 0 ? (
                      <div className="absolute inset-0 hidden w-3 lg:block">
                        <svg
                          className="h-full w-full text-gray-300"
                          viewBox="0 0 12 82"
                          fill="none"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0.5 0V31L10.5 41L0.5 51V82"
                            stroke="currentcolor"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>
                    ) : null}
                  </Link>
                </li>
              );
            })
          : USER_STEPS.map((step, i) => {
              const isCurrent = pathname.includes(step.url);

              return (
                <li
                  key={step.name}
                  className="relative overflow-hidden lg:flex-1"
                >
                  <Link href={step.url}>
                    <span
                      className={cn(
                        "absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full",
                        {
                          "bg-primary": isCurrent,
                        }
                      )}
                      aria-hidden="true"
                    />

                    <span
                      className={cn(
                        i !== 0 ? "lg:pl-9" : "",
                        "flex items-center px-6 py-4 text-sm font-medium"
                      )}
                    >
                      <span className="ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center">
                        <span
                          className={cn("text-sm font-semibold text-zinc-700", {
                            "text-primary": isCurrent,
                          })}
                        >
                          {step.name}
                        </span>
                      </span>
                    </span>

                    {/* separator */}
                    {i !== 0 ? (
                      <div className="absolute inset-0 hidden w-3 lg:block">
                        <svg
                          className="h-full w-full text-gray-300"
                          viewBox="0 0 12 82"
                          fill="none"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0.5 0V31L10.5 41L0.5 51V82"
                            stroke="currentcolor"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>
                    ) : null}
                  </Link>
                </li>
              );
            })}
      </ol>
    </Suspense>
  );
};

export default Steps;
