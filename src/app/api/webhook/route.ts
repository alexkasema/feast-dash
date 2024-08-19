import { mongooseConnect } from "@/lib/mongoose";
import { stripe } from "@/lib/stripe";
import { Order } from "@/models/Order";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      const paid = session.payment_status === "paid";

      if (!paid) {
        throw new Error("Payment not completed");
      }

      const subTotal = session.amount_subtotal
        ? session.amount_subtotal / 100
        : 0;
      const total = session.amount_total ? session.amount_total / 100 : 0;

      await Order.updateOne(
        { _id: orderId },
        { isPaid: true, total, subTotal }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
