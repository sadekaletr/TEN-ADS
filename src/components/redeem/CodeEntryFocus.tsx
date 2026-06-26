"use client";

import { Button } from "@/components/ui/Button";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

interface CodeEntryFocusProps {
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  loading?: boolean;
  error?: string;
}

export function CodeEntryFocus({
  code,
  onCodeChange,
  onVerify,
  loading,
  error,
}: CodeEntryFocusProps) {
  return (
    <div className="w-full">
      <SurfaceCard>
        <p className="mb-4 text-center text-sm text-dim">أدخل أو أكّد كود الجائزة</p>
        <input
          value={code}
          onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
          placeholder="SPARK-XXXX-XXXX"
          autoComplete="off"
          autoFocus
          className="w-full rounded-lg border border-gold-4/30 bg-surface-2 px-4 py-4 text-center font-mono text-base tracking-widest text-gold-1 outline-none transition-colors focus:border-gold-2"
        />
        {error && (
          <p className="mt-3 text-center text-sm text-gold-3">{error}</p>
        )}
        <div className="mt-6">
          <Button fullWidth onClick={onVerify} disabled={loading || !code.trim()}>
            {loading ? "جاري التحقق..." : "تحقق"}
          </Button>
        </div>
      </SurfaceCard>
    </div>
  );
}
