"use client";

import { ChevronsDown, ChevronsUp, Plus, Trash2 } from "lucide-react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

interface TOldProps {
  name?: string;
  price?: number;
}

interface PageProps {
  name: string;
  addLabel: string;
  props: TOldProps[];
  setProps: Dispatch<SetStateAction<{ name: string; price: number }[]>>;
}

const MenuItemPriceProps = ({ name, addLabel, props, setProps }: PageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function addProp() {
    //@ts-ignore
    setProps((oldProps) => {
      return [...oldProps, { name: "", price: 0 }];
    });
  }

  function editProp(
    ev: FormEvent<HTMLInputElement>,
    index: number,
    prop: keyof TOldProps
  ) {
    const newValue = (ev.target as HTMLInputElement).value;
    // @ts-ignore
    setProps((prevSizes) => {
      const newSizes = [...prevSizes];
      // @ts-ignore
      newSizes[index][prop] = newValue;
      return newSizes;
    });
  }

  function removeProp(indexToRemove: number) {
    // @ts-ignore
    setProps((prev) => prev.filter((v, index) => index !== indexToRemove));
  }

  return (
    <div className="bg-gray-200 p-2 rounded-md mb-2">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex p-1 border-0 justify-start"
        type="button"
      >
        {isOpen && <ChevronsUp />}
        {!isOpen && <ChevronsDown />}
        <span>{name}</span>
        <span>({props?.length})</span>
      </button>
      <div className={isOpen ? "block" : "hidden"}>
        {props?.length > 0 &&
          props.map((size, index) => (
            <div key={index} className="flex items-end gap-2">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Size name"
                  value={size.name}
                  onChange={(ev) => editProp(ev, index, "name")}
                />
              </div>
              <div>
                <label>Extra price</label>
                <input
                  type="text"
                  placeholder="Extra price"
                  value={size.price}
                  onChange={(ev) => editProp(ev, index, "price")}
                />
              </div>
              <div className="">
                <button
                  type="button"
                  onClick={() => removeProp(index)}
                  className="btn-extras-delete mb-3 px-2"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        <button
          type="button"
          onClick={addProp}
          className="btn-extras flex items-center"
        >
          <Plus className="w-4 h-4" />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItemPriceProps;
