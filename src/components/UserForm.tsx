"use client";

import {
  TUserInformationValidator,
  UserInformationValidator,
} from "@/lib/validators/user-information-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/app/profile/user/actions";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";

const UserForm = ({ user }: UserDataType) => {
  const [admin, setAdmin] = useState<boolean>(user?.isAdmin || false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUserInformationValidator>({
    resolver: zodResolver(UserInformationValidator),
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationKey: ["update-user-information"],
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("User information updated successfully");
    },
    onError: (err) => {
      toast.error(`Failed to update user information: ${err.message}`);
    },
  });

  const onSubmit = ({
    name,
    email,
    phone,
    streetAddress,
    postalCode,
    city,
    isAdmin,
  }: TUserInformationValidator) => {
    const data = {
      name,
      email,
      phone,
      streetAddress,
      postalCode,
      city,
      isAdmin,
    };
    updateProfile({ data });
  };
  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1 py-2">
            <Label htmlFor="name">Name</Label>
            <Input
              value={user?.name}
              {...register("name")}
              type="text"
              className={cn({
                "focus-visible:ring-red-500": errors.name,
              })}
              placeholder="Enter your name"
            />
            {errors?.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-1 py-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={user?.email}
              {...register(`email`)}
              className={cn({
                "focus-visible:ring-red-500": errors.email,
              })}
              placeholder="you@example.com"
            />
            {errors?.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-1 py-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              {...register(`phone`)}
              value={user?.phone}
              className={cn({
                "focus-visible:ring-red-500": errors.phone,
              })}
              placeholder="Enter your phone number"
            />
            {errors?.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-1 py-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              {...register(`streetAddress`)}
              value={user?.streetAddress}
              className={cn({
                "focus-visible:ring-red-500": errors.streetAddress,
              })}
              placeholder="Enter Street Address"
            />
            {errors?.streetAddress && (
              <p className="text-sm text-red-500">
                {errors.streetAddress.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1 py-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                {...register(`postalCode`)}
                value={user?.postalCode}
                className={cn({
                  "focus-visible:ring-red-500": errors.postalCode,
                })}
                placeholder="Enter postal code"
              />
              {errors?.postalCode && (
                <p className="text-sm text-red-500">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
            <div className="grid gap-1 py-2">
              <Label htmlFor="city">City</Label>
              <Input
                {...register(`city`)}
                value={user?.city}
                className={cn({
                  "focus-visible:ring-red-500": errors.city,
                })}
                placeholder="Enter City Name"
              />
              {errors?.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>
          {user?.isAdmin && (
            <div className="flex gap-1 py-2">
              <Label htmlFor="isAdmin">Is Admin</Label>
              <Checkbox
                value={"1"}
                checked={admin}
                onCheckedChange={() => setAdmin((prev) => !prev)}
              />
            </div>
          )}

          <Button
            disabled={isPending}
            isLoading={isPending}
            loadingText="Saving changes"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
