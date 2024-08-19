"use client";

import React, { FormEvent, useEffect, useState } from "react";

import { Label } from "./ui/label";
import { Button } from "./ui/button";

import { Checkbox } from "./ui/checkbox";
import { TUserData } from "@/lib/shared-types";
import { useProfile } from "./UseProfile";

interface PageProps {
  user: TUserData;
  onSave: (ev: FormEvent<HTMLFormElement>, data: TUserData) => void;
  isPending: boolean;
}

const UserForm = ({ user, onSave, isPending }: PageProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(user?.isAdmin || false);
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [streetAddress, setStreetAddress] = useState<string>(
    user?.streetAddress || ""
  );
  const [postalCode, setPostalCode] = useState<string>(user?.postalCode || "");
  const [city, setCity] = useState<string>(user?.city || "");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setStreetAddress(user?.streetAddress || "");
    setPostalCode(user?.postalCode || "");
    setCity(user?.city || "");
    setIsAdmin(user?.isAdmin || false);
  }, [user]);

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const data = {
      name,
      email,
      phone,
      streetAddress,
      postalCode,
      city,
      isAdmin,
    };
    onSave(ev, data);
  };
  return (
    <div className="grid gap-6">
      <form onSubmit={(ev) => onSubmit(ev)}>
        <div className="grid gap-2">
          <div className="grid gap-1 py-2">
            <Label htmlFor="name">Name</Label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="grid gap-1 py-2">
            <Label htmlFor="email">Email</Label>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="grid gap-1 py-2">
            <Label htmlFor="phone">Phone</Label>
            <input
              type="text"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              required
              placeholder="Enter your Phone Number"
            />
          </div>

          <div className="grid gap-1 py-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <input
              type="text"
              value={streetAddress}
              onChange={(ev) => setStreetAddress(ev.target.value)}
              required
              placeholder="Enter your Street Address"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1 py-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <input
                type="text"
                value={postalCode}
                onChange={(ev) => setPostalCode(ev.target.value)}
                required
                placeholder="Enter your Postal Code"
              />
            </div>
            <div className="grid gap-1 py-2">
              <Label htmlFor="city">City</Label>
              <input
                type="text"
                value={city}
                onChange={(ev) => setCity(ev.target.value)}
                required
                placeholder="Enter your City"
              />
            </div>
          </div>
          {user?.isAdmin && (
            <div className="flex gap-1 py-2">
              <Label htmlFor="isAdmin">Is Admin</Label>
              <Checkbox
                value={"1"}
                checked={isAdmin}
                onCheckedChange={() => setIsAdmin((prev) => !prev)}
              />
            </div>
          )}

          <Button
            disabled={isPending}
            isLoading={isPending}
            loadingText="Saving user"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
