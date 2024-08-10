import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  const user = undefined;
  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            Feast<span className="text-green-600">Dash</span>
          </Link>

          <div className="h-full flex items-center space-x-4 md:ml-8 md:self-stretch">
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
              })}
            >
              Home
            </Link>
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
              })}
            >
              Menu
            </Link>
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
              })}
            >
              About
            </Link>
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
              })}
            >
              Contact
            </Link>
          </div>

          <div className="ml-auto flex items-center">
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
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
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  User Name
                </Link>
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
              <div className="ml-4 flow-root lg:ml-6">Cart (0)</div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
