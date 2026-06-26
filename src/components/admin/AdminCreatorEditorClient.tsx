"use client";

import Link from "next/link";
import { useState } from "react";
import {
  grantIntelligenceSubscription,
  revokeIntelligenceSubscription,
  adjustWallet,
  recomputeSparkAdmin,
  updateCreatorAdmin,
  upsertCreatorListingAdmin,
} from "@/app/admin/actions";
import { CreatorSpotlightCard } from "@/components/creators/CreatorSpotlightCard";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminToast } from "@/components/admin/AdminToast";
import { CreatorMediaUploader } from "@/components/admin/CreatorMediaUploader";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { n, spark } from "@/lib/format";
import { generatePartnerDiscountCode } from "@/lib/spark-pricing";

const CATEGORY_OPTIONS = ["food", "fashion", "beauty", "tech", "lifestyle"];
const TABS = ["identity", "listing", "performance", "wallet"] as const;
type Tab = (typeof TABS)[number];

type CreatorDetail = {
  id: string;
  name: string;
  handle: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  verified: boolean;
  isPartner: boolean;
  partnerDiscountCode: string | null;
  walletBalance: number;
  marketplaceBoostUntil: string | null;
  listing: {
    bio: string | null;
    categories: string[];
    isPublic: boolean;
    coverImageUrl: string | null;
    showcaseTagline: string | null;
    spotlightRank: number | null;
  } | null;
  performance: {
    sparkScore: number | null;
    trustScore: number;
    activeCampaigns: number;
    totalRedemptions: number;
    conversionRate?: number;
    campaignsCount: number;
  };
  transactions: { id: string; type: string; amount: number; note: string | null; createdAt: string }[];
  spotlightConflict: string | null;
};

export function AdminCreatorEditorClient({ creator }: { creator: CreatorDetail }) {
  const [tab, setTab] = useState<Tab>("identity");
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(creator.name);
  const [handle, setHandle] = useState(creator.handle);
  const [email, setEmail] = useState(creator.email ?? "");
  const [phone, setPhone] = useState(creator.phone);
  const [newPassword, setNewPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(creator.avatarUrl ?? "");
  const [verified, setVerified] = useState(creator.verified);
  const [isPartner, setIsPartner] = useState(creator.isPartner);
  const [partnerDiscountCode, setPartnerDiscountCode] = useState(
    creator.partnerDiscountCode ?? ""
  );
  const [boostUntil, setBoostUntil] = useState(
    creator.marketplaceBoostUntil?.slice(0, 10) ?? ""
  );

  const [bio, setBio] = useState(creator.listing?.bio ?? "");
  const [categories, setCategories] = useState<string[]>(creator.listing?.categories ?? []);
  const [isPublic, setIsPublic] = useState(creator.listing?.isPublic ?? true);
  const [coverImageUrl, setCoverImageUrl] = useState(creator.listing?.coverImageUrl ?? "");
  const [showcaseTagline, setShowcaseTagline] = useState(creator.listing?.showcaseTagline ?? "");
  const [spotlightRank, setSpotlightRank] = useState(
    creator.listing?.spotlightRank?.toString() ?? ""
  );

  const [walletAmount, setWalletAmount] = useState("");
  const [walletNote, setWalletNote] = useState("");

  const cleanHandle = handle.replace(/^@/, "");

  const previewData: CreatorCardData = {
    id: creator.id,
    name,
    handle,
    avatarUrl: avatarUrl || null,
    coverImageUrl: coverImageUrl || null,
    city: null,
    categories,
    verified,
    sparkScore: creator.performance.sparkScore,
    trustScore: creator.performance.trustScore,
    campaignsCount: creator.performance.campaignsCount,
    activeCampaigns: creator.performance.activeCampaigns,
    totalRedemptions: creator.performance.totalRedemptions,
    conversionRate: creator.performance.conversionRate,
    showcaseTagline: showcaseTagline || null,
    spotlightRank: spotlightRank ? Number(spotlightRank) : null,
    bio: bio || null,
    createdAt: creator.performance.sparkScore != null ? new Date().toISOString() : new Date().toISOString(),
    listingCreatedAt: new Date().toISOString(),
  };

  function showSuccess(msg: string) {
    setToast({ msg, variant: "success" });
  }

  function showError(msg: string) {
    setToast({ msg, variant: "error" });
  }

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function saveIdentity() {
    setLoading(true);
    try {
      await updateCreatorAdmin({
        id: creator.id,
        name,
        handle,
        email: email || null,
        phone,
        password: newPassword || null,
        avatarUrl: avatarUrl || null,
        verified,
        marketplaceBoostUntil: boostUntil || null,
        isPartner,
        partnerDiscountCode: isPartner ? partnerDiscountCode || null : null,
      });
      setNewPassword("");
      showSuccess("تم حفظ الهوية");
    } catch {
      showError("فشل الحفظ");
    }
    setLoading(false);
  }

  async function saveListing() {
    setLoading(true);
    try {
      await upsertCreatorListingAdmin({
        creatorId: creator.id,
        bio: bio || undefined,
        categories,
        isPublic,
        coverImageUrl: coverImageUrl || null,
        showcaseTagline: showcaseTagline || null,
        spotlightRank: spotlightRank ? Number(spotlightRank) : null,
      });
      showSuccess("تم حفظ بطاقة العرض");
    } catch {
      showError("فشل الحفظ");
    }
    setLoading(false);
  }

  async function handleAdjustWallet() {
    const amount = Number(walletAmount);
    if (!walletAmount || Number.isNaN(amount) || !walletNote.trim()) {
      showError("أدخل المبلغ والملاحظة");
      return;
    }
    setLoading(true);
    try {
      await adjustWallet(creator.id, amount, walletNote.trim());
      showSuccess("تم تعديل المحفظة");
      setWalletAmount("");
      setWalletNote("");
    } catch {
      showError("فشل تعديل المحفظة");
    }
    setLoading(false);
  }

  async function handleRecomputeSpark() {
    setLoading(true);
    try {
      await recomputeSparkAdmin(creator.id);
      showSuccess("تم إعادة حساب Spark");
    } catch {
      showError("فشل الحساب");
    }
    setLoading(false);
  }

  return (
    <div>
      <AdminPageHeader
        title={creator.name}
        description={creator.handle}
        breadcrumbs={[
          { label: "الإدارة", href: "/admin" },
          { label: "الصناع", href: "/admin/creators" },
          { label: creator.name },
        ]}
        actions={
          <>
            <Button href={`/creator/${cleanHandle}`} variant="secondary" size="sm">
              الملف العام
            </Button>
            <Button href="/creators" variant="ghost" size="sm">
              /creators
            </Button>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-gold-4/20 pb-2">
        {(
          [
            ["identity", "الهوية"],
            ["listing", "بطاقة العرض"],
            ["performance", "الأداء"],
            ["wallet", "المحفظة"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={
              tab === key
                ? "rounded-lg bg-gold-2/15 px-3 py-2 text-sm text-gold-1"
                : "px-3 py-2 text-sm text-dim hover:text-warm-white"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CircuitCard className="space-y-4">
          {tab === "identity" && (
            <>
              <div>
                <Label>الاسم</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>الحساب</Label>
                <Input value={handle} onChange={(e) => setHandle(e.target.value)} dir="ltr" />
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div>
                <Label>الهاتف</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
              </div>
              <div>
                <Label>كلمة مرور جديدة (اختياري)</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="اتركه فارغاً للإبقاء على الحالية"
                />
              </div>
              <CreatorMediaUploader
                creatorId={creator.id}
                label="الأفاتار"
                kind="avatar"
                value={avatarUrl}
                onChange={setAvatarUrl}
                previewAspect="square"
              />
              <div>
                <Label>تعزيز السوق حتى</Label>
                <Input
                  type="date"
                  value={boostUntil}
                  onChange={(e) => setBoostUntil(e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-dim">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                موثّق
              </label>
              <label className="flex items-center gap-2 text-sm text-dim">
                <input
                  type="checkbox"
                  checked={isPartner}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setIsPartner(next);
                    if (next && !partnerDiscountCode) {
                      setPartnerDiscountCode(generatePartnerDiscountCode(handle));
                    }
                  }}
                />
                صانع متعاقد (سعر Spark $3)
              </label>
              {isPartner && (
                <div>
                  <Label>كود حسم الشريك</Label>
                  <Input
                    value={partnerDiscountCode}
                    onChange={(e) => setPartnerDiscountCode(e.target.value.toUpperCase())}
                    dir="ltr"
                    placeholder="SPARK-RAWAN"
                  />
                  <p className="mt-1 text-xs text-dim">
                    يظهر في حساب الصانع — سعر الشريك $3 بدل $7 للوحدة
                  </p>
                </div>
              )}
              <Button onClick={saveIdentity} loading={loading}>
                حفظ الهوية
              </Button>
            </>
          )}

          {tab === "listing" && (
            <>
              {creator.spotlightConflict && (
                <p className="rounded-lg border border-warning/40 bg-warning-muted px-3 py-2 text-xs text-warning">
                  {creator.spotlightConflict}
                </p>
              )}
              <div>
                <Label>السيرة</Label>
                <Input value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div>
                <Label>التصنيفات</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={
                        categories.includes(cat)
                          ? "rounded-full border border-gold-2/50 bg-gold-2/15 px-3 py-1 text-xs text-gold-1"
                          : "rounded-full border border-gold-4/20 px-3 py-1 text-xs text-dim"
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <CreatorMediaUploader
                creatorId={creator.id}
                label="غلاف البطاقة"
                kind="cover"
                value={coverImageUrl}
                onChange={setCoverImageUrl}
              />
              <div>
                <Label>سطر العرض</Label>
                <Input value={showcaseTagline} onChange={(e) => setShowcaseTagline(e.target.value)} />
              </div>
              <div>
                <Label>ترتيب Spotlight</Label>
                <Select value={spotlightRank} onChange={(e) => setSpotlightRank(e.target.value)}>
                  <option value="">بدون</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm text-dim">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                قائمة عامة على /creators
              </label>
              <Button onClick={saveListing} loading={loading}>
                حفظ البطاقة
              </Button>
            </>
          )}

          {tab === "performance" && (
            <div className="space-y-3 text-sm">
              <p>
                Spark:{" "}
                <span className="font-mono text-gold-1">
                  {creator.performance.sparkScore != null
                    ? n(creator.performance.sparkScore)
                    : "—"}
                </span>
              </p>
              <p>
                الثقة:{" "}
                <span className="font-mono text-gold-1">
                  {n(creator.performance.trustScore)}%
                </span>
              </p>
              <p>حملات نشطة: {n(creator.performance.activeCampaigns)}</p>
              <p>استردادات: {n(creator.performance.totalRedemptions)}</p>
              {creator.performance.conversionRate != null && (
                <p>
                  تحويل: {n(Math.round(creator.performance.conversionRate * 100))}%
                </p>
              )}
              <Button onClick={handleRecomputeSpark} loading={loading} variant="secondary">
                إعادة حساب Spark
              </Button>
              <div className="flex flex-wrap gap-2 border-t border-gold-4/20 pt-4">
                <Button
                  variant="secondary"
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await grantIntelligenceSubscription(creator.id, 30);
                      setToast({ msg: "تم منح Intelligence لـ 30 يوماً", variant: "success" });
                    } catch {
                      setToast({ msg: "فشل المنح", variant: "error" });
                    }
                    setLoading(false);
                  }}
                >
                  منح Intelligence (30 يوم)
                </Button>
                <Button
                  variant="secondary"
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await revokeIntelligenceSubscription(creator.id);
                      setToast({ msg: "تم إلغاء الاشتراك", variant: "success" });
                    } catch {
                      setToast({ msg: "فشل الإلغاء", variant: "error" });
                    }
                    setLoading(false);
                  }}
                >
                  إلغاء Intelligence
                </Button>
              </div>
            </div>
          )}

          {tab === "wallet" && (
            <>
              <p className="text-lg font-mono text-gold-1">
                الرصيد: {spark(creator.walletBalance)}
              </p>
              <div>
                <Label>تعديل المبلغ (+/-)</Label>
                <Input
                  type="number"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                />
              </div>
              <div>
                <Label>ملاحظة</Label>
                <Input value={walletNote} onChange={(e) => setWalletNote(e.target.value)} />
              </div>
              <Button onClick={handleAdjustWallet} loading={loading}>
                تطبيق التعديل
              </Button>
              <div className="mt-4 space-y-2 border-t border-gold-4/20 pt-4">
                <p className="text-xs text-dim">آخر المعاملات</p>
                {creator.transactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between text-xs text-dim">
                    <span>{tx.note ?? tx.type}</span>
                    <span className="font-mono text-gold-2">{spark(tx.amount)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CircuitCard>

        {(tab === "listing" || tab === "identity") && (
          <div className="space-y-4">
            <p className="text-sm text-dim">معاينة Spotlight</p>
            <CreatorSpotlightCard creator={previewData} preview size="spotlight" />
            <p className="text-sm text-dim">معاينة Grid</p>
            <CreatorSpotlightCard creator={previewData} preview size="default" />
          </div>
        )}
      </div>

      {toast && (
        <AdminToast
          message={toast.msg}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
