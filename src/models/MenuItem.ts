import { model, models, Schema } from "mongoose";

const MenuItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    images: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const MenuItem = models?.MenuItem || model("MenuItem", MenuItemSchema);
