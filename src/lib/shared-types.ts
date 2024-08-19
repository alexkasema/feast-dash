import { MenuItemData } from "@/components/MenuItemForm";

export interface SingleUserType {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface UserDataType {
  user: {
    _id?: string;
    name?: string;
    email?: string;
    isAdmin?: boolean;
    phone?: string;
    streetAddress?: string;
    postalCode?: string;
    city?: string;
  };
}

export interface MenuItemsType {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  images: string[];
}

export interface TUserData {
  _id?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  phone?: string;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
}

export interface TCategory {
  _id: string;
  name: string;
}

export interface OrderType {
  _id: string;
  userEmail: string;
  phone: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  items: {
    menu: MenuItemData;
    size: { name: string; price: number } | null;
    extras: { name: string; price: number }[] | null;
  }[];
  total: number;
  subTotal: number;
  isPaid: boolean;
  createdAt: Date;
}
