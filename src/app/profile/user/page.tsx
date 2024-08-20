"use client";

import UserForm from "@/components/UserForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, updateUser } from "./actions";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { TUserData } from "@/lib/shared-types";

const UserProfilePage = () => {
  //! Fetch the user profile on mount
  const { data } = useQuery({
    queryKey: ["get-user-profile"],
    queryFn: async () => await getUser(),
    retry: 3,
    retryDelay: 500,
    refetchOnWindowFocus: false,
  });

  const user = data?.user;

  //! Update the user profile
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

  const onSave = (ev: FormEvent<HTMLFormElement>, data: TUserData) => {
    ev.preventDefault();
    // @ts-ignore
    updateProfile(data);
  };

  return (
    <section className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Feast<span className="text-green-600">Dash</span>
          </h1>
          <h1 className="text-2xl font-semibold tracking-tight">
            {user?.name ? user.name : user?.email} Profile
          </h1>

          <Link
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5",
            })}
            href="/"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </div>
        <UserForm user={user!} onSave={onSave} isPending={isPending} />
      </div>
    </section>
  );
};

export default UserProfilePage;
