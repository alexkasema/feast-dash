"use client";
import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import ImageUpload from "./ImageUpload";

export type MenuItemData = {
  _id?: string;
  name: string;
  description: string;
  basePrice: string;
  images: string[];
};

interface Props {
  onSubmit: (ev: FormEvent<HTMLFormElement>, data: MenuItemData) => void;
  isPending: boolean;
}

const MenuItemForm = ({ onSubmit, isPending }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [images, setImages] = useState<string[]>([]);

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
