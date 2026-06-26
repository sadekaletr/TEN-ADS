"use client";

import { useState } from "react";
import { submitCollabRequest } from "@/app/marketplace/actions";
import { Button } from "@/components/ui/Button";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function CollabRequestForm({
  creatorId,
  creatorName,
}: {
  creatorId: string;
  creatorName: string;
}) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await submitCollabRequest(creatorId, message);
      setSent(true);
    } catch {
      window.location.href = "/sponsor/login";
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <SurfaceCard className="text-center">
        <p className="text-sm text-gold-1">تم إرسال طلب التعاون إلى {creatorName}</p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard>
      <h3 className="mb-2 text-sm font-medium text-warm-white">طلب تعاون</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="صف حملتك المقترحة..."
          rows={3}
          className="w-full rounded-lg border border-gold-4/30 bg-surface-2 px-3 py-2 text-sm"
          required
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "جاري الإرسال..." : "إرسال طلب تعاون"}
        </Button>
      </form>
    </SurfaceCard>
  );
}
