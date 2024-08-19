"use client";

import { useCart } from "@/hooks/use-cart";
import { useEffect } from "react";

export default function ClearCartComponent() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return null;
}
