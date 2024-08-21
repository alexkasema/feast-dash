"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "./ui/button";
import Cart from "./Cart";
import UserAccountNav from "./UserAccountNav";

interface PageProps {
  user: {
    email?: string | null | undefined;
    name?: string | null | undefined;
    image?: string | null | undefined;
  };
}

const MobileNav2 = ({ user }: PageProps) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <div className="flex items-center md:hidden justify-between">
        <button
          type="button"
          onClick={() => setMobileNavOpen((prev) => !prev)}
          className="md:hidden relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-gray-200 rounded-lg my-auto flex flex-col gap-2 text-center"
        >
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
            })}
          >
            Home
          </Link>
          <Link
            href="/menu"
            className={buttonVariants({
              variant: "ghost",
            })}
          >
            Menu
          </Link>

          {user ? null : (
            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: "ghost",
              })}
            >
              Sign in
            </Link>
          )}
          {/* //!Act as a separator */}
          {user ? null : (
            <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
          )}
          {user ? (
            <UserAccountNav user={user} />
          ) : (
            <Link
              href="/sign-up"
              className={buttonVariants({
                variant: "ghost",
              })}
            >
              Create account
            </Link>
          )}
          {/* //!Act as a separator */}
          {user ? (
            <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
          ) : null}
          {/* //!Act as a separator */}
          {user ? null : (
            <div className="flex lg:ml-6">
              <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
            </div>
          )}
          <div className="ml-4 flow-root lg:ml-6">
            <Cart />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav2;
