"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

interface PageProps {
  user: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
}

const UserAccountNav = ({ user }: PageProps) => {
  const router = useRouter();
  let userName = user?.name || user?.email;

  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }

  const signOutHandler = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success("Logged out successfully, come back soon");
    router.push("/");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button variant="default" size="sm" className="relative">
          My Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white w-60" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm text-black">{userName}</p>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile/user">Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={signOutHandler} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserAccountNav;
