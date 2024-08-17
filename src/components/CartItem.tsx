import { X } from "lucide-react";
import { MenuItemData } from "./MenuItemForm";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  menu: MenuItemData;
  size: { name: string; price: number } | null;
  extras: { name: string; price: number }[] | null;
  index: number;
}

const CartItem = ({ menu, size, extras, index }: PageProps) => {
  const { removeItem } = useCart();
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
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            <Image
              src={image}
              alt={menu.name}
              fill
              className="absolute object-cover"
            />
          </div>
          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {menu.name}
            </span>

            <span className=" text-xs capitalize text-muted-foreground">
              {size && (
                <div className="text-sm">
                  Size: <span>{size.name}</span>
                </div>
              )}
              {extras!.length > 0 && (
                <div className="text-sm text-gray-500">
                  {extras?.map((extra) => (
                    <div key={extra.name}>
                      {extra.name} ${extra.price}
                    </div>
                  ))}
                </div>
              )}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                onClick={() => removeItem(index)}
                className="flex items-center gap-0.5"
              >
                <X className="w-3 h-4 text-red-600" />
                Remove
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(selectedPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
