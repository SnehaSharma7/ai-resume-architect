import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const stripe = getStripe();
    const PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || "";
    if (!stripe || !PRICE_ID) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID to .env.local" },
        { status: 503 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/dashboard?upgraded=true`,
      cancel_url: `${req.nextUrl.origin}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
