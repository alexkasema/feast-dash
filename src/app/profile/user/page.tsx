"use client";

import UserForm from "@/components/UserForm";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "./actions";
import { useState } from "react";

const UserProfilePage = () => {
  const { data } = useQuery({
    queryKey: ["get-user-profile"],
    queryFn: async () => await getUser(),
    retry: 3,
    retryDelay: 500,
  });

  const user = data?.user;
  console.log(user);

  return (
    <section className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <UserForm user={user!} />
      </div>
    </section>
  );
};

export default UserProfilePage;
