"use client";

import { useSession } from "next-auth/react";

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
  return (
    <ol className="flex mx-auto gap-2 justify-center flex-wrap rounded-md bg-white lg:rounded-none lg:border-l lg:border-r lg:border-gray-200'">
      Steps
    </ol>
  );
};

export default Steps;
