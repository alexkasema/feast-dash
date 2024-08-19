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
import { OrderType } from "@/lib/shared-types";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, []);

  const WEEKLY_GOAL = 20;
  const MONTHLY_GOAL = 2500;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Number of Orders</CardDescription>
                <CardTitle className="text-4xl">{orders.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {WEEKLY_GOAL} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={(orders.length * 100) / WEEKLY_GOAL} />
              </CardFooter>
            </Card>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Feast<span className="text-green-600">Dash</span>: Your Orders
          </h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Id</TableHead>
                <TableHead>Contacts</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created At
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: OrderType) => (
                <TableRow key={order._id} className="bg-accent">
                  <TableCell>
                    <div className="font-medium">
                      {order._id.slice(order._id.length - 5)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.userEmail}</div>
                    <div className="font-medium">{order.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {order.isPaid ? (
                        <Check className="text-green-600" />
                      ) : (
                        <X className="text-red-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={"/profile/orders/" + order._id}
                      className={cn(buttonVariants({ variant: "default" }))}
                    >
                      view order
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

export default OrdersPage;
