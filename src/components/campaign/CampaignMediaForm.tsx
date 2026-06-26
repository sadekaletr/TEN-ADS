"use client";

import { useState } from "react";
import { updateCampaignMedia } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { GlassCard } from "@/components/ui/GlassCard";

type CampaignMediaFormProps = {
  campaignId: string;
  prizeImageUrl: string | null;
  promoVideoUrl: string | null;
  heroTemplate: string | null;
};

export function CampaignMediaForm({
  campaignId,
  prizeImageUrl,
  promoVideoUrl,
  heroTemplate,
}: CampaignMediaFormProps) {
  const [imageUrl, setImageUrl] = useState(prizeImageUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(promoVideoUrl ?? "");
  const [template, setTemplate] = useState(heroTemplate ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setLoading(true);
    setSaved(false);
    await updateCampaignMedia(campaignId, {
      prizeImageUrl: imageUrl || null,
      promoVideoUrl: videoUrl || null,
      heroTemplate: template || null,
    });
    setLoading(false);
    setSaved(true);
  }

  return (
    <GlassCard className="space-y-4">
      <h2 className="text-lg text-gold-1">وسائط الحملة</h2>
      <div>
        <Label>رابط صورة الجائزة</Label>
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} dir="ltr" />
      </div>
      <div>
        <Label>رابط فيديو ترويجي</Label>
        <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} dir="ltr" />
      </div>
      <div>
        <Label>قالب Hero</Label>
        <Input value={template} onChange={(e) => setTemplate(e.target.value)} />
      </div>
      <Button onClick={save} loading={loading}>
        حفظ الوسائط
      </Button>
      {saved && <p className="text-sm text-gold-2">تم الحفظ</p>}
    </GlassCard>
  );
}
