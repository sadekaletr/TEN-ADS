"use client";

import { useState } from "react";
import { upsertCreatorListing } from "@/app/marketplace/actions";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { GlassCard } from "@/components/ui/GlassCard";

interface CreatorListingFormProps {
  initial?: {
    bio: string | null;
    categories: string[];
    isPublic: boolean;
  } | null;
}

export function CreatorListingForm({ initial }: CreatorListingFormProps) {
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [categories, setCategories] = useState(initial?.categories.join(", ") ?? "");
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await upsertCreatorListing({
      bio: bio || undefined,
      categories: categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      isPublic,
    });
    setSaved(true);
    setLoading(false);
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="bio">نبذة في Marketplace</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="categories">التصنيفات (مفصولة بفاصلة)</Label>
          <Input
            id="categories"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="مطاعم, جمال, تقنية"
          />
        </div>
        <Checkbox
          label="إظهار ملفي للرعاة في Marketplace"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <Button type="submit" loading={loading}>
          حفظ القائمة
        </Button>
        {saved && <p className="text-sm text-gold-2">تم الحفظ.</p>}
      </form>
    </GlassCard>
  );
}
