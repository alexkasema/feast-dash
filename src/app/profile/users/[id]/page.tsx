"use client";

import { buttonVariants } from "@/components/ui/button";
import UserForm from "@/components/UserForm";
import { TUserData, UserDataType } from "@/lib/shared-types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { updateUser } from "../../user/actions";
import { toast } from "sonner";

const EditUserPage = () => {
  const { id } = useParams();

  const [user, setUser] = useState<TUserData | null>(null);
  useEffect(() => {
    if (!id) return;
    axios.get(`/api/users/?id=${id}`).then((response) => {
      setUser(response.data);
    });
  }, [id]);

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
    updateProfile({ ...data, _id: id });
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
            href="/profile/users"
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

export default EditUserPage;
