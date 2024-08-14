"use client";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import ImageUpload from "./ImageUpload";
import MenuItemPriceProps from "./MenuItemPriceProps";
import axios from "axios";
import { TCategory } from "@/lib/shared-types";

export type MenuItemData = {
  _id?: string;
  name: string;
  description: string;
  basePrice: string;
  category: string;
  images: string[];
  sizes?: { name: string; price: number }[];
  extraIngredientPrices?: { name: string; price: number }[];
};

interface Props {
  onSubmit: (ev: FormEvent<HTMLFormElement>, data: MenuItemData) => void;
  isPending: boolean;
  menuItem?: MenuItemData;
}

const MenuItemForm = ({ onSubmit, isPending, menuItem }: Props) => {
  const [name, setName] = useState(menuItem?.name || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || "");
  const [images, setImages] = useState<string[]>(menuItem?.images || []);
  const [category, setCategory] = useState(menuItem?.category || "");
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState(
    menuItem?.extraIngredientPrices || []
  );
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name);
      setDescription(menuItem.description);
      setBasePrice(menuItem.basePrice);
      setImages(menuItem.images);
      setCategory(menuItem.category);
      setSizes(menuItem.sizes ?? []);
      setExtraIngredientPrices(menuItem.extraIngredientPrices ?? []);
    }
  }, [menuItem]);

  const uploadImage = (link: string) => {
    setImages((prevUrls) => {
      return [...prevUrls, link];
    });
  };

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    const data: MenuItemData = {
      name,
      description,
      basePrice,
      images,
      sizes,
      category,
      extraIngredientPrices,
    };
    onSubmit(ev, data);
  };

  return (
    <form onSubmit={(ev) => handleSubmit(ev)}>
      <label>Menu name</label>
      <input
        type="text"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
        required
        placeholder="product name"
      />
      <label>Photos</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {!images.length && <div>No photos</div>}

        {!!images?.length &&
          images.map((link) => (
            <div
              key={link}
              className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
            >
              <img src={link} alt="" className="rounded-lg" />
            </div>
          ))}
        <ImageUpload setLink={uploadImage} />
      </div>
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Select Category</option>
        {categories?.length > 0 &&
          categories.map((c: TCategory) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      <label>Description</label>
      <textarea
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
        placeholder="description"
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        value={basePrice}
        onChange={(ev) => setBasePrice(ev.target.value)}
        placeholder="price"
      />
      <MenuItemPriceProps
        name={"Sizes"}
        addLabel={"Add item size"}
        props={sizes}
        setProps={setSizes}
      />
      <MenuItemPriceProps
        name={"Extra ingredients"}
        addLabel={"Add ingredients prices"}
        props={extraIngredientPrices}
        setProps={setExtraIngredientPrices}
      />
      <Button
        disabled={isPending}
        isLoading={isPending}
        loadingText="Saving Menu Item"
        className="w-full"
      >
        Save
      </Button>
    </form>
  );
};

export default MenuItemForm;
