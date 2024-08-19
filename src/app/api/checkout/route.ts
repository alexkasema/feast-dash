import { authOptions } from "@/lib/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { stripe } from "@/lib/stripe";
import { MenuItem } from "@/models/MenuItem";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const dbConnect = async () => {
  await mongooseConnect();
};

dbConnect();

export async function POST(req: Request) {
  const { address, items } = await req.json();

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const user = await User.findOne({ email: userEmail });

  const orderDoc = await Order.create({
    userEmail,
    ...address,
    items,
    isPaid: false,
  });

  const stripeLineItems = [];
  for (const cartProduct of items) {
    const productInfo = await MenuItem.findById(cartProduct.menu._id);

    let productPrice = productInfo.basePrice;
    if (cartProduct.size) {
      const size = productInfo.sizes.find(
        //@ts-ignore
        (size) => size._id.toString() === cartProduct.size._id.toString()
      );
      productPrice += size.price;
    }
    if (cartProduct.extras?.length > 0) {
      for (const cartProductExtraThing of cartProduct.extras) {
        const productExtras = productInfo.extraIngredientPrices;
        const extraThingInfo = productExtras.find(
          //@ts-ignore
          (extra) =>
            extra._id.toString() === cartProductExtraThing._id.toString()
        );
        productPrice += extraThingInfo.price;
      }
    }

    const productName = cartProduct.menu.name;

    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: productName,
        },
        unit_amount: productPrice * 100,
      },
    });
  }

  try {
    // @ts-ignore
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
      mode: "payment",
      customer_email: userEmail,
      success_url: `${process.env.NEXTAUTH_URL}/thank-you?orderId=${orderDoc.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart?canceled=1`,
      metadata: {
        orderId: orderDoc._id.toString(),
        userId: user._id.toString(),
      },
      payment_intent_data: {
        metadata: { orderId: orderDoc._id.toString() },
      },
      payment_method_types: ["card"],
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Delivery fee",
            type: "fixed_amount",
            fixed_amount: { amount: 300, currency: "USD" },
          },
        },
      ],
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.log("Error creating stripe session", error);
    return NextResponse.error();
  }
}
