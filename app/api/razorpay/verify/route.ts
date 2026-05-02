import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { razorpayVerifySchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = razorpayVerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

    // Verify signature
    const sigPayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(sigPayload)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    console.log(`[Razorpay] Payment verified — order: ${razorpay_order_id}, payment: ${razorpay_payment_id}`);
    // TODO: Update user status in your database to "pro"

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 }
    );
  }
}
