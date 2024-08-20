"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProfile } from "@/components/UseProfile";
import { SingleUserType } from "@/lib/shared-types";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const UsersPage = () => {
  const { loading } = useProfile();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  if (loading) {
    return (
      <div className=" flex mx-auto gap-4 sm:gap-4 sm:py-4">
        <p>Loading user info</p>
        <Loader2 className="w-10 h-10 animate-spin text-zinc-500" />
      </div>
    );
  }

  const WEEKLY_GOAL = 20;
  const MONTHLY_GOAL = 2500;
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Number of Users</CardDescription>
                <CardTitle className="text-4xl">{users.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {WEEKLY_GOAL} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={(users.length * 100) / WEEKLY_GOAL} />
              </CardFooter>
            </Card>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Feast<span className="text-green-600">Dash</span> Users
          </h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Is Admin</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: SingleUserType) => (
                <TableRow key={user._id} className="bg-accent">
                  <TableCell>
                    <div className="font-medium">
                      {!!user.name && <span>{user.name}</span>}
                      {!user.name && <span className="italic">No name</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {user.isAdmin ? (
                        <Check className="text-green-600" />
                      ) : (
                        <X className="text-red-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={"/profile/users/" + user._id}
                      className={cn(buttonVariants({ variant: "default" }))}
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
