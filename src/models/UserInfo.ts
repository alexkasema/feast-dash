import { model, models, Schema } from "mongoose";

const UserInfoSchema = new Schema({
  email: { type: String, required: true },
  streetAddress: { type: String },
  postalCode: { type: String },
  city: { type: String },
  phone: { type: String },
});

export const UserInfo = models?.UserInfo || model("UserInfo", UserInfoSchema);
