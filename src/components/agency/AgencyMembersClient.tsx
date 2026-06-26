"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addMember,
  inviteCreatorByEmail,
  removeMember,
  updateMemberLimit,
} from "@/app/agency/actions";
import { AgencyMemberCard } from "@/components/agency/AgencyMemberCard";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PageHeader } from "@/components/ui/PageHeader";

export type AgencyMemberRow = {
  id: string;
  spendingLimit: number | null;
  spentThisMonth: number;
  isActive: boolean;
  creator: { id: string; name: string; handle: string };
  redemptions: number;
};

export function AgencyMembersClient({ members }: { members: AgencyMemberRow[] }) {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteHandle, setInviteHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitEdits, setLimitEdits] = useState<Record<string, string>>({});

  const activeMembers = members.filter((m) => m.isActive);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim() || !inviteHandle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await inviteCreatorByEmail(inviteEmail, inviteName, inviteHandle);
      setInviteEmail("");
      setInviteName("");
      setInviteHandle("");
      router.refresh();
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "INVALID_INPUT") setError("بيانات الدعوة غير مكتملة");
      else setError("فشل إرسال الدعوة");
    }
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await addMember(handle.trim());
      setHandle("");
      router.refresh();
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "CREATOR_NOT_FOUND") setError("لم يُعثر على صانع بهذا الحساب");
      else if (code === "ALREADY_MEMBER") setError("الصانع عضو بالفعل");
      else if (code === "CREATOR_IN_OTHER_AGENCY") setError("الصانع مرتبط بوكالة أخرى");
      else setError("فشل إضافة العضو");
    }
    setLoading(false);
  }

  async function handleRemove(memberId: string) {
    if (!confirm("إزالة هذا العضو من الوكالة؟")) return;
    setLoading(true);
    try {
      await removeMember(memberId);
      router.refresh();
    } catch {
      setError("فشل إزالة العضو");
    }
    setLoading(false);
  }

  async function handleSaveLimit(memberId: string) {
    const raw = limitEdits[memberId];
    const limit = raw === "" || raw === undefined ? null : Number(raw);
    if (limit !== null && (Number.isNaN(limit) || limit < 0)) {
      setError("حد إنفاق غير صالح");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateMemberLimit(memberId, limit);
      router.refresh();
    } catch {
      setError("فشل تحديث الحد");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="أعضاء الوكالة"
        description="إدارة الصناع المرتبطين بحساب الوكالة"
      />

      <CircuitCard className="space-y-4">
        <h2 className="font-semibold text-gold-1">إضافة عضو</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Label htmlFor="member-handle">حساب الصانع</Label>
            <Input
              id="member-handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@handle"
              required
            />
          </div>
          <Button type="submit" loading={loading}>
            إضافة
          </Button>
        </form>
        {error && <p className="text-sm text-danger">{error}</p>}
      </CircuitCard>

      <CircuitCard className="space-y-4">
        <h2 className="font-semibold text-gold-1">دعوة صانع جديد بالبريد</h2>
        <form onSubmit={handleInvite} className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="invite-email">البريد</Label>
            <Input
              id="invite-email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="creator@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="invite-name">الاسم</Label>
            <Input
              id="invite-name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="invite-handle">الحساب</Label>
            <Input
              id="invite-handle"
              value={inviteHandle}
              onChange={(e) => setInviteHandle(e.target.value)}
              placeholder="@handle"
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" loading={loading}>
              إرسال دعوة
            </Button>
          </div>
        </form>
      </CircuitCard>

      <div className="space-y-3">
        {activeMembers.length === 0 ? (
          <CircuitCard>
            <p className="text-sm text-dim">لا يوجد أعضاء بعد — أضف صانعاً بالحساب.</p>
          </CircuitCard>
        ) : (
          activeMembers.map((m) => (
            <div key={m.id} className="space-y-2">
              <AgencyMemberCard
                name={m.creator.name}
                handle={m.creator.handle}
                spendingLimit={m.spendingLimit}
                spentThisMonth={m.spentThisMonth}
                redemptions={m.redemptions}
              />
              <CircuitCard className="flex flex-wrap items-end gap-3">
                <div className="min-w-[140px]">
                  <Label>حد الإنفاق الشهري (سبارك)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="بلا حد"
                    value={limitEdits[m.id] ?? (m.spendingLimit?.toString() ?? "")}
                    onChange={(e) =>
                      setLimitEdits((prev) => ({ ...prev, [m.id]: e.target.value }))
                    }
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  loading={loading}
                  onClick={() => handleSaveLimit(m.id)}
                >
                  حفظ الحد
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => handleRemove(m.id)}
                >
                  إزالة
                </Button>
              </CircuitCard>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
