import { z } from "zod";

export const UserInformationValidator = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  email: z.string().email(),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters long.",
  }),
  streetAddress: z.string().min(5, {
    message: "Street address must be at least 5 characters long.",
  }),
  postalCode: z
    .string()
    .min(5, {
      message: "Postal code must be at least 5 characters long.",
    })
    .optional(),
  city: z.string().min(2, {
    message: "City must be at least 2 characters long.",
  }),
  isAdmin: z.boolean().optional(),
});

export type TUserInformationValidator = z.infer<
  typeof UserInformationValidator
>;
