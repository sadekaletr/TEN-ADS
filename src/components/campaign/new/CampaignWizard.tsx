"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SparkBadge } from "@/components/ui/SparkBadge";
import { SparkRecommendation } from "@/components/dashboard/SparkRecommendation";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { HERO_CAMPAIGN_TEMPLATES } from "@/lib/campaign-templates";
import { MagneticCore } from "@/components/motion/MagneticCore";
import { createCampaign, getSponsors, saveCampaignDraft, searchCreatorsByHandle } from "@/app/dashboard/actions";
import { suggestCampaignAction } from "@/app/dashboard/copilot-actions";
import { TierPicker } from "@/components/campaign/TierPicker";
import { CampaignLivePreview } from "@/components/campaign/CampaignLivePreview";
import { allowsUniqueCodes, tierCostPerRedemption } from "@/lib/campaign-tiers";
import { formatNumber } from "@/lib/format";
import type { CampaignTier } from "@prisma/client";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Label } from "@/components/ui/Label";
import { useLocale } from "@/lib/i18n";
import Link from "next/link";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CampaignWizardStepper } from "@/components/campaign/new/CampaignWizardStepper";
import { RecommendedSponsorsCard } from "@/components/network/RecommendedSponsorsCard";
import { BestTemplateCard } from "@/components/network/BestTemplateCard";
import type { CampaignTemplate } from "@/lib/network/recommendations";

type Sponsor = { id: string; name: string; city: string | null };

export function CampaignWizard() {
  const { t } = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [sponsorId, setSponsorId] = useState("");
  const [newSponsor, setNewSponsor] = useState({ name: "", city: "", phone: "" });
  const [useNewSponsor, setUseNewSponsor] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prizeName, setPrizeName] = useState("");
  const [prizeQuantity, setPrizeQuantity] = useState(5);
  const [codeMode, setCodeMode] = useState<"SHARED" | "UNIQUE">("SHARED");
  const [tier, setTier] = useState<CampaignTier>("PRO");

  const [costPerRedemption, setCostPerRedemption] = useState(2);
  const [city, setCity] = useState("");
  const [requireAddress, setRequireAddress] = useState(false);
  const [antiAbuse, setAntiAbuse] = useState(true);
  const [revealStyle, setRevealStyle] = useState<"CLASSIC_GOLD" | "SCRATCH_CARD" | "SPIN_WHEEL">("CLASSIC_GOLD");
  const [collabSearch, setCollabSearch] = useState("");
  const [collabResults, setCollabResults] = useState<
    { id: string; name: string; handle: string }[]
  >([]);
  const [collaborators, setCollaborators] = useState<
    { creatorId: string; name: string; handle: string; sharePercentage: number }[]
  >([]);
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  const totalCost = costPerRedemption * prizeQuantity;
  const collabShareTotal = collaborators.reduce((s, c) => s + c.sharePercentage, 0);

  const sponsorName = useNewSponsor
    ? newSponsor.name
    : sponsors.find((s) => s.id === sponsorId)?.name ?? "";

  function handleTierChange(next: CampaignTier) {
    setTier(next);
    setCostPerRedemption(tierCostPerRedemption(next));
    if (next === "BASIC") setCodeMode("SHARED");
    if (next !== "EMPIRE") setCollaborators([]);
  }

  function buildCampaignPayload() {
    return {
      sponsorId: useNewSponsor ? undefined : sponsorId,
      newSponsor: useNewSponsor
        ? { name: newSponsor.name, city: newSponsor.city || undefined, phone: newSponsor.phone || undefined }
        : undefined,
      title,
      description: description || undefined,
      prizeName,
      prizeQuantity,
      codeMode: tier === "BASIC" ? ("SHARED" as const) : codeMode,
      tier,
      city: city || undefined,
      requirePhone: true,
      requireAddress,
      antiAbuse,
      revealStyle,
      collaborators:
        tier === "EMPIRE"
          ? collaborators.map((c) => ({
              creatorId: c.creatorId,
              sharePercentage: c.sharePercentage,
            }))
          : [],
    };
  }

  function applyBestTemplate(t: CampaignTemplate) {
    setTitle(t.title);
    setPrizeName(t.prizeName);
    setPrizeQuantity(t.prizeQuantity);
    setTier(t.tier as CampaignTier);
    setCostPerRedemption(t.costPerRedemption);
    setCity(t.city ?? "");
    setStep(1);
  }

  function applyTemplate(templateId: string) {
    const t = HERO_CAMPAIGN_TEMPLATES.find((x) => x.id === templateId);
    if (!t) return;
    setTitle(t.title);
    setDescription(t.description);
    setPrizeName(t.prizeName);
    setPrizeQuantity(t.prizeQuantity);
    setCodeMode(t.codeMode);
    setCostPerRedemption(t.costPerRedemption);
    setCity(t.city ?? "");
    setRequireAddress(t.requireAddress);
    setAntiAbuse(t.antiAbuse);
    setStep(1);
  }

  useEffect(() => {
    getSponsors().then(setSponsors);
  }, []);

  useEffect(() => {
    if (collabSearch.length < 2) {
      setCollabResults([]);
      return;
    }
    const t = setTimeout(() => {
      searchCreatorsByHandle(collabSearch).then(setCollabResults).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [collabSearch]);

  async function handleCopilot() {
    if (!session?.user?.id || !copilotInput.trim()) return;
    setCopilotLoading(true);
    try {
      const s = await suggestCampaignAction(copilotInput);
      setTitle(s.title);
      setPrizeName(s.prizeName);
      setPrizeQuantity(s.suggestedQuantity);
      setCodeMode(s.codeMode);
      setCostPerRedemption(s.suggestedCostPerRedemption);
      if (s.city) setCity(s.city);
      setDescription(s.storyText);
      setStep(1);
    } catch {
      setError("تعذّر توليد الاقتراح");
    }
    setCopilotLoading(false);
  }

  async function handleLaunch() {
    setLoading(true);
    setError("");
    setInsufficientBalance(false);
    try {
      const campaign = await createCampaign(buildCampaignPayload());
      router.push(`/dashboard/campaigns/${campaign.id}`);
    } catch (e) {
      if (e instanceof Error && e.message === "INSUFFICIENT_BALANCE") {
        setInsufficientBalance(true);
        setError(`تحتاج ${formatNumber(totalCost)} سبارك لإطلاق هذه الحملة`);
        try {
          await saveCampaignDraft(buildCampaignPayload());
          router.push(`/dashboard/wallet/topup?need=${totalCost}`);
        } catch {
          // keep error visible if draft save fails
        }
      } else {
        setError(t("errors.campaignCreate"));
      }
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-dim">
        <Link href="/dashboard" className="hover:text-gold-1">{t("dashboard.campaigns.breadcrumbDashboard")}</Link>
        <span>/</span>
        <Link href="/dashboard/campaigns" className="hover:text-gold-1">{t("dashboard.campaigns.breadcrumbCampaigns")}</Link>
        <span>/</span>
        <span className="text-gold-1">{t("dashboard.campaigns.breadcrumbNew")}</span>
      </nav>
      <PageHeader
        title={t("dashboard.campaigns.wizard.title")}
        description={t("dashboard.campaigns.wizard.subtitle")}
      />
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <GlassCard className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gold-1">اكتب جملة وخلص</h2>
            <p className="mt-1 text-sm text-dim">
              صف حملتك بجملة واحدة — نملأ التفاصيل عنك
            </p>
          </div>
          <Textarea
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            placeholder="مثال: حملة قهوة مجانية لأول 10 متابعين في دمشق"
            rows={4}
          />
          <Button
            type="button"
            onClick={handleCopilot}
            loading={copilotLoading}
            disabled={!copilotInput.trim()}
            className="w-full py-4 text-lg"
          >
            اكتب جملة وخلص
          </Button>
          {error && step === 0 && <p className="text-sm text-gold-3">{error}</p>}
        </GlassCard>

        {step === 0 && session?.user?.id && (
          <div className="space-y-3">
            <RecommendedSponsorsCard creatorId={session.user.id} />
            <BestTemplateCard creatorId={session.user.id} onApply={applyBestTemplate} />
          </div>
        )}

        {step === 0 && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setTemplatesOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-sm text-dim hover:text-gold-1"
            >
              {templatesOpen ? (
                <>
                  إخفاء القوالب
                  <Icon name="chevronUp" size={14} />
                </>
              ) : (
                <>
                  أو اختر قالباً جاهزاً
                  <Icon name="chevronDown" size={14} />
                </>
              )}
            </button>

            {templatesOpen && (
              <GlassCard className="space-y-4">
                <div className="grid gap-3">
                  {HERO_CAMPAIGN_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => applyTemplate(t.id)}
                      className="rounded border border-gold-4/30 p-4 text-right hover:border-gold-2 hover:bg-gold-2/5"
                    >
                      <p className="font-medium text-gold-1">{t.name}</p>
                      <p className="mt-1 text-sm text-dim">{t.description}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="w-full rounded border border-gold-4/30 py-2 text-dim"
                >
                  إنشاء يدوي بدون قالب
                </button>
              </GlassCard>
            )}
          </div>
        )}

        {step > 0 && (
          <>
            <div>
              <h2 className="mb-3 text-gold-1">مستوى الحملة</h2>
              <TierPicker selected={tier} onSelect={handleTierChange} />
            </div>

            <div className="flex gap-2">
              <CampaignWizardStepper step={step} />
            </div>

            {step === 1 && (
              <GlassCard className="space-y-4">
                <h2 className="text-gold-1">{t("dashboard.campaigns.wizard.stepSponsor")}</h2>
                <Checkbox
                  label="راعٍ جديد"
                  checked={useNewSponsor}
                  onChange={(e) => setUseNewSponsor(e.target.checked)}
                />
                {useNewSponsor ? (
                  <>
                    <Input
                      placeholder="اسم المحل"
                      value={newSponsor.name}
                      onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                    />
                    <Input
                      placeholder="المدينة"
                      value={newSponsor.city}
                      onChange={(e) => setNewSponsor({ ...newSponsor, city: e.target.value })}
                    />
                  </>
                ) : (
                  <Select value={sponsorId} onChange={(e) => setSponsorId(e.target.value)}>
                    <option value="">اختر راعياً</option>
                    {sponsors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                )}
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={useNewSponsor ? !newSponsor.name : !sponsorId}
                  className="w-full"
                >
                  {t("common.next")}
                </Button>
              </GlassCard>
            )}

            {step === 2 && (
              <GlassCard className="space-y-4">
                <h2 className="text-gold-1">الخطوة 2 — الجائزة</h2>
                <Input
                  placeholder="عنوان الحملة"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="min-h-11"
                />
                <Input
                  placeholder="اسم الجائزة"
                  value={prizeName}
                  onChange={(e) => setPrizeName(e.target.value)}
                  className="min-h-11"
                />
                <Input
                  type="number"
                  min={1}
                  value={prizeQuantity}
                  onChange={(e) => setPrizeQuantity(Number(e.target.value))}
                  className="min-h-11 font-mono"
                />
                {allowsUniqueCodes(tier) && (
                  <SegmentedControl
                    options={[
                      { value: "SHARED", label: "كود واحد للجميع" },
                      { value: "UNIQUE", label: "كود فريد لكل فائز" },
                    ]}
                    value={codeMode}
                    onChange={(v) => setCodeMode(v as "SHARED" | "UNIQUE")}
                    className="w-full"
                  />
                )}
                <SegmentedControl
                  options={[
                    { value: "CLASSIC_GOLD", label: "ذهبي كلاسيكي" },
                    { value: "SCRATCH_CARD", label: "خدش" },
                    { value: "SPIN_WHEEL", label: "عجلة" },
                  ]}
                  value={revealStyle}
                  onChange={(v) =>
                    setRevealStyle(v as "CLASSIC_GOLD" | "SCRATCH_CARD" | "SPIN_WHEEL")
                  }
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                    رجوع
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!title || !prizeName}
                    className="flex-1"
                  >
                    التالي
                  </Button>
                </div>
              </GlassCard>
            )}

            {step === 3 && (
              <GlassCard className="space-y-4">
                <h2 className="text-gold-1">الخطوة 3 — القواعد</h2>
                <Input
                  placeholder="تقييد بمدينة (اختياري)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="min-h-11"
                />
                <Checkbox
                  label="طلب العنوان"
                  checked={requireAddress}
                  onChange={(e) => setRequireAddress(e.target.checked)}
                />
                <Checkbox
                  label="منع التكرار (هاتف/IP)"
                  checked={antiAbuse}
                  onChange={(e) => setAntiAbuse(e.target.checked)}
                />
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                    رجوع
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(tier === "EMPIRE" ? 4 : 5)}
                    className="flex-1"
                  >
                    التالي
                  </Button>
                </div>
              </GlassCard>
            )}

            {step === 4 && tier === "EMPIRE" && (
              <GlassCard className="space-y-4">
                <h2 className="text-gold-1">الخطوة 4 — شركاء Co-Campaign</h2>
                <p className="text-sm text-dim">
                  أضف صناع محتوى شركاء مع نسبة توزيع (المجموع ≤ 100%)
                </p>
                <input
                  placeholder="بحث بـ @handle"
                  value={collabSearch}
                  onChange={(e) => setCollabSearch(e.target.value)}
                  className="w-full rounded border border-gold-4/30 bg-surface-2 px-3 py-2"
                />
                {collabResults.length > 0 && (
                  <div className="space-y-1">
                    {collabResults.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          if (collaborators.some((x) => x.creatorId === c.id)) return;
                          setCollaborators([
                            ...collaborators,
                            {
                              creatorId: c.id,
                              name: c.name,
                              handle: c.handle,
                              sharePercentage: 10,
                            },
                          ]);
                          setCollabSearch("");
                          setCollabResults([]);
                        }}
                        className="w-full rounded border border-gold-4/20 px-3 py-2 text-right text-sm hover:border-gold-2"
                      >
                        {c.name} @{c.handle}
                      </button>
                    ))}
                  </div>
                )}
                {collaborators.map((c) => (
                  <div key={c.creatorId} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">@{c.handle}</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={c.sharePercentage}
                      onChange={(e) =>
                        setCollaborators(
                          collaborators.map((x) =>
                            x.creatorId === c.creatorId
                              ? { ...x, sharePercentage: Number(e.target.value) }
                              : x
                          )
                        )
                      }
                      className="w-20 rounded border border-gold-4/30 bg-surface-2 px-2 py-1 font-mono text-sm"
                    />
                    <span className="text-dim">%</span>
                    <button
                      type="button"
                      onClick={() =>
                        setCollaborators(collaborators.filter((x) => x.creatorId !== c.creatorId))
                      }
                      className="text-xs text-dim"
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <p className="text-xs text-dim">
                  نصيب المالك: {formatNumber(Math.max(0, 100 - collabShareTotal))}%
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setStep(3)} className="flex-1">
                    رجوع
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(5)}
                    disabled={collabShareTotal > 100}
                    className="flex-1"
                  >
                    التالي
                  </Button>
                </div>
              </GlassCard>
            )}

            {step === 5 && (
              <GlassCard className="space-y-4">
                <h2 className="text-gold-1">الخطوة 5 — المراجعة والإطلاق</h2>
                {session?.user?.id && <SparkRecommendation creatorId={session.user.id} />}
                <div className="space-y-2 rounded border border-gold-4/20 bg-surface-2 p-4 text-sm">
                  <p>
                    <span className="text-dim">الحملة:</span> {title}
                  </p>
                  <p>
                    <span className="text-dim">الجائزة:</span> {prizeName} — العدد: {formatNumber(prizeQuantity)}
                  </p>
                  <p>
                    <span className="text-dim">المستوى:</span> {tier}
                  </p>
                  <p>
                    <span className="text-dim">نوع الكود:</span>{" "}
                    {codeMode === "SHARED" ? "مشترك" : "فريد"}
                  </p>
                  <div className="pt-2">
                    <p className="text-dim">التكلفة الإجمالية</p>
                    <SparkBadge amount={totalCost} />
                  </div>
                </div>
                {error && (
                  <div className="space-y-2">
                    <p className="text-sm text-gold-3">{error}</p>
                    {insufficientBalance && (
                      <Button
                        href={`/dashboard/wallet/topup?need=${totalCost}`}
                        variant="secondary"
                        fullWidth
                      >
                        شحن المحفظة الآن — تحتاج {formatNumber(totalCost)} سبارك
                      </Button>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setStep(tier === "EMPIRE" ? 4 : 3)}
                    className="flex-1"
                  >
                    رجوع
                  </Button>
                  <MagneticCore className="flex-1">
                    <Button
                      type="button"
                      onClick={handleLaunch}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "جاري الإطلاق..." : "إطلاق الحملة"}
                    </Button>
                  </MagneticCore>
                </div>
              </GlassCard>
            )}
          </>
        )}
      </div>

      <div className="lg:sticky lg:top-8 lg:h-fit">
        <CampaignLivePreview
          title={title}
          prizeName={prizeName}
          tier={tier}
          sponsorName={sponsorName}
        />
      </div>
    </div>
    </div>
  );
}
