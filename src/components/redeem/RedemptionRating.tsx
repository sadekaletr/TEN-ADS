"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type RedemptionRatingProps = {
  redemptionId: string;
};

export function RedemptionRating({ redemptionId }: RedemptionRatingProps) {
  const [rating, setRating] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(value: number) {
    setRating(value);
    setLoading(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ redemptionId, rating: value }),
      });
      if (res.ok) setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="mt-4 text-center text-sm text-gold-2">شكراً لتقييمك!</p>
    );
  }

  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-dim">كيف كانت تجربتك؟</p>
      <div className="mt-2 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={loading}
            onClick={() => submit(n)}
            className={`h-10 w-10 rounded-full border text-sm transition ${
              rating >= n
                ? "border-gold-2 bg-gold-4/30 text-gold-1"
                : "border-gold-4/30 text-dim hover:border-gold-3"
            }`}
            aria-label={`${n} نجوم`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
