import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    userEmail: { type: String },
    phone: String,
    streetAddress: String,
    postalCode: String,
    city: String,
    items: Object,
    total: Number,
    subTotal: Number,
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order = models?.Order || model("Order", OrderSchema);
