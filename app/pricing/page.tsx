"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { getSession } from "@/lib/auth";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for getting started with one job application.",
    features: [
      "1 Resume",
      "Live Preview Editor",
      "ATS Score Analysis",
      "Basic PDF Export",
      "3 Templates",
    ],
    cta: "Start for Free",
    href: "/builder",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹999",
    period: "per month",
    description: "For active job seekers who need unlimited power.",
    features: [
      "Unlimited Resumes",
      "AI Bullet Point Rewriter",
      "Cover Letter Generator",
      "Premium PDF Rendering",
      "15+ Premium Templates",
      "Priority Support",
      "Dashboard & History",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    setLoading(true);
    setError("");

    try {
      const session = getSession();
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.email ?? "" }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "CareerForge Pro",
        description: "Pro Plan – Monthly Subscription",
        order_id: data.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // Verify payment on server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            window.location.href = "/dashboard?upgraded=true";
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          email: session?.email ?? "",
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-900/20 border border-violet-700/30 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            Pricing
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Start for free. Upgrade when you need unlimited resumes, AI rewrites, and cover letters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border transition-all ${
                plan.highlighted
                  ? "bg-[#111122] border-violet-600/60 shadow-xl shadow-violet-950/40 relative"
                  : "bg-[#111122] border-slate-800/60"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm">/ {plan.period}</span>
              </div>
              <p className="text-slate-400 text-sm mt-2">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${
                        plan.highlighted ? "text-violet-400" : "text-emerald-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plan.highlighted ? (
                  <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-violet-900/50"
                  >
                    {loading ? "Processing..." : plan.cta}
                  </button>
                ) : (
                  <Link
                    href={plan.href!}
                    className="block w-full text-center bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium py-3 rounded-xl border border-slate-700/50 transition-all"
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="max-w-md mx-auto mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 text-center">
            {error}
          </div>
        )}
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  );
}
