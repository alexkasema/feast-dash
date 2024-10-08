import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={cn("relative h-full antialiased", recursive.className)}>
        <Providers>
          <Navbar />
          <main className="relative grainy-light flex flex-col  min-h-screen">
            <div className="flex-grow flex-1">{children}</div>
            <Footer />
          </main>
        </Providers>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
