"use client";

import { useState } from "react";
import {
  deleteMarketingTestimonial,
  updatePlatformSettings,
  upsertMarketingTestimonial,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { MarketingTestimonial } from "@prisma/client";

export function AdminHomepageClient({
  featuredCampaignId,
  heroCampaignId,
  featuredCreatorId,
  landingVideoUrl,
  testimonials,
  campaigns,
  creators,
}: {
  featuredCampaignId: string | null;
  heroCampaignId: string | null;
  featuredCreatorId: string | null;
  landingVideoUrl: string | null;
  testimonials: MarketingTestimonial[];
  campaigns: { id: string; title: string; prizeClaimed: number }[];
  creators: { id: string; name: string; handle: string }[];
}) {
  const [featured, setFeatured] = useState(featuredCampaignId ?? "");
  const [hero, setHero] = useState(heroCampaignId ?? "");
  const [creator, setCreator] = useState(featuredCreatorId ?? "");
  const [videoUrl, setVideoUrl] = useState(landingVideoUrl ?? "");
  const [loading, setLoading] = useState(false);

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [handle, setHandle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  async function handleSave() {
    setLoading(true);
    await updatePlatformSettings({
      featuredCampaignId: featured || null,
      heroCampaignId: hero || null,
      featuredCreatorId: creator || null,
      landingVideoUrl: videoUrl.trim() || null,
    });
    setLoading(false);
  }

  async function handleAddTestimonial() {
    if (!quote.trim() || !author.trim()) return;
    setLoading(true);
    await upsertMarketingTestimonial({
      quote,
      author,
      handle: handle || null,
      avatarUrl: avatarUrl || null,
      sortOrder: testimonials.length,
    });
    setQuote("");
    setAuthor("");
    setHandle("");
    setAvatarUrl("");
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-warm-white">الصفحة الرئيسية</h1>
      <CircuitCard className="space-y-4">
        <div>
          <Label>قصة النجاح (Case Study)</Label>
          <Select value={featured} onChange={(e) => setFeatured(e.target.value)} className="min-h-11">
            <option value="">تلقائي — أفضل حملة</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.prizeClaimed} استرداد)
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>حملة Hero (اختياري)</Label>
          <Select value={hero} onChange={(e) => setHero(e.target.value)} className="min-h-11">
            <option value="">بدون</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>صانع مميز</Label>
          <Select value={creator} onChange={(e) => setCreator(e.target.value)} className="min-h-11">
            <option value="">بدون</option>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.handle})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>فيديو اللاندينغ (رابط YouTube أو ملف /public)</Label>
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... أو /videos/intro.mp4"
            dir="ltr"
            className="min-h-11"
          />
        </div>
        <Button onClick={handleSave} loading={loading} className="min-h-11">
          حفظ الإعدادات
        </Button>
      </CircuitCard>

      <CircuitCard className="space-y-4">
        <h2 className="font-semibold text-gold-1">شهادات الصناع</h2>
        {testimonials.length === 0 && (
          <p className="text-sm text-dim">لا توجد شهادات — أضف أول شهادة أدناه</p>
        )}
        <ul className="space-y-3">
          {testimonials.map((t) => (
            <li
              key={t.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-gold-4/20 p-3"
            >
              <div>
                <p className="text-sm text-warm-white">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-1 text-xs text-dim">
                  {t.author} {t.handle && <span className="font-mono">{t.handle}</span>}
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={async () => {
                  await deleteMarketingTestimonial(t.id);
                  window.location.reload();
                }}
              >
                حذف
              </Button>
            </li>
          ))}
        </ul>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>الاقتباس</Label>
            <Input value={quote} onChange={(e) => setQuote(e.target.value)} className="min-h-11" />
          </div>
          <div>
            <Label>الاسم</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="min-h-11" />
          </div>
          <div>
            <Label>الحساب (اختياري)</Label>
            <Input value={handle} onChange={(e) => setHandle(e.target.value)} dir="ltr" className="min-h-11" />
          </div>
          <div className="sm:col-span-2">
            <Label>رابط الصورة (اختياري)</Label>
            <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} dir="ltr" className="min-h-11" />
          </div>
        </div>
        <Button onClick={handleAddTestimonial} loading={loading} variant="secondary">
          إضافة شهادة
        </Button>
      </CircuitCard>
    </div>
  );
}
