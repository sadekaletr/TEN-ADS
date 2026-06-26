"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCampaignForMember } from "@/app/agency/actions";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { StatusPillPro } from "@/components/ui/StatusPillPro";
import { n } from "@/lib/format";

function campaignPillStatus(status: string): "live" | "pending" | "rejected" {
  if (status === "ACTIVE") return "live";
  if (status === "ENDED") return "rejected";
  return "pending";
}

export type AgencyCampaignRow = {
  id: string;
  title: string;
  status: string;
  prizeClaimed: number;
  prizeQuantity: number;
  creator: { name: string; handle: string };
  sponsor: { name: string } | null;
};

export type AgencyMemberOption = {
  id: string;
  label: string;
};

export function AgencyCampaignsClient({
  campaigns,
  members,
}: {
  campaigns: AgencyCampaignRow[];
  members: AgencyMemberOption[];
}) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [memberId, setMemberId] = useState(members[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [prizeName, setPrizeName] = useState("");
  const [prizeQuantity, setPrizeQuantity] = useState("10");
  const [sponsorName, setSponsorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!memberId || !title.trim() || !prizeName.trim() || !sponsorName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createCampaignForMember(memberId, {
        title: title.trim(),
        prizeName: prizeName.trim(),
        prizeQuantity: Number(prizeQuantity),
        codeMode: "SHARED",
        tier: "PRO",
        newSponsor: { name: sponsorName.trim() },
        requirePhone: false,
        requireAddress: false,
        antiAbuse: true,
        revealStyle: "CLASSIC_GOLD",
      });
      setShowCreate(false);
      setTitle("");
      setPrizeName("");
      setSponsorName("");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "INSUFFICIENT_BALANCE") setError("رصيد الوكالة أو حد العضو غير كافٍ");
      else setError("فشل إنشاء الحملة");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="حملات الأعضاء"
        description="جميع الحملات التي أطلقتها الوكالة أو أعضاؤها"
        action={
          members.length > 0 ? (
            <Button size="sm" onClick={() => setShowCreate((v) => !v)}>
              {showCreate ? "إلغاء" : "+ حملة جديدة"}
            </Button>
          ) : undefined
        }
      />

      {showCreate && members.length > 0 && (
        <CircuitCard className="space-y-4">
          <h2 className="font-semibold text-gold-1">إطلاق حملة لعضو</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label>العضو</Label>
              <Select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>عنوان الحملة</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label>اسم الجائزة</Label>
              <Input value={prizeName} onChange={(e) => setPrizeName(e.target.value)} required />
            </div>
            <div>
              <Label>الكمية</Label>
              <Input
                type="number"
                min={1}
                value={prizeQuantity}
                onChange={(e) => setPrizeQuantity(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>اسم الراعي</Label>
              <Input value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" loading={loading}>
              إطلاق الحملة
            </Button>
          </form>
        </CircuitCard>
      )}

      {campaigns.length === 0 ? (
        <CircuitCard>
          <p className="text-sm text-dim">لا توجد حملات لأعضاء الوكالة بعد.</p>
        </CircuitCard>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <CircuitCard key={c.id} className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-warm-white">{c.title}</p>
                <p className="text-xs text-dim">
                  {c.creator.name} · @{c.creator.handle.replace(/^@/, "")}
                </p>
                {c.sponsor && (
                  <p className="text-xs text-dim">راعي: {c.sponsor.name}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusPillPro
                  status={campaignPillStatus(c.status)}
                  label={c.status}
                />
                <p className="text-xs text-dim">
                  {n(c.prizeClaimed)} / {n(c.prizeQuantity)} استرداد
                </p>
              </div>
            </CircuitCard>
          ))}
        </div>
      )}
    </div>
  );
}
