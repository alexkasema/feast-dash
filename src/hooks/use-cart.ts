import { MenuItemData } from "@/components/MenuItemForm";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  menu: MenuItemData;
  size: { name: string; price: number } | null;
  extras: { name: string; price: number }[] | null;
};

export interface SizeAndExtras {}

type CartState = {
  items: CartItem[];
  addItem: (
    menu: MenuItemData,
    size: { name: string; price: number } | null,
    extras: { name: string; price: number }[] | null
  ) => void;
  removeItem: (indexToRemove: number) => void;
  clearCart: () => void;
  cartMenuTotal: (
    menu: MenuItemData,
    size: { name: string; price: number } | null,
    extras: { name: string; price: number }[] | null
  ) => number | string;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (menu, size, extras) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              menu,
              size,
              extras,
            },
          ],
        })),
      removeItem: (indexToRemove) =>
        set((state) => ({
          items: state.items.filter((item, index) => index !== indexToRemove),
        })),
      clearCart: () => set({ items: [] }),
      cartMenuTotal: (menu, size, extras) => {
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
        return selectedPrice;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
