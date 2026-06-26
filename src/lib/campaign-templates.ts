export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  title: string;
  prizeName: string;
  prizeQuantity: number;
  codeMode: "SHARED" | "UNIQUE";
  costPerRedemption: number;
  city?: string;
  requireAddress: boolean;
  antiAbuse: boolean;
  durationDays?: number;
}

export const HERO_CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: "H1",
    name: "Viral Burst",
    description: "حملة قصيرة بجوائز كثيرة وكود مشترك — مثالية لاختبار Live feed",
    title: "انفجار سبارك — جوائز فورية",
    prizeName: "قسيمة خصم 50%",
    prizeQuantity: 50,
    codeMode: "SHARED",
    costPerRedemption: 1,
    requireAddress: false,
    antiAbuse: true,
    durationDays: 7,
  },
  {
    id: "H2",
    name: "Steady Local",
    description: "حملة محلية بمدينة واحدة وanti-abuse قوي",
    title: "حملة دمشق المحلية",
    prizeName: "وجبة مجانية",
    prizeQuantity: 20,
    codeMode: "SHARED",
    costPerRedemption: 2,
    city: "دمشق",
    requireAddress: true,
    antiAbuse: true,
    durationDays: 14,
  },
  {
    id: "H3",
    name: "Premium Creator",
    description: "حملة حصرية لصانع محتوى verified — جائزة محدودة",
    title: "تجربة بريميوم — حصرية للمتابعين",
    prizeName: "باقة VIP حصرية",
    prizeQuantity: 10,
    codeMode: "UNIQUE",
    costPerRedemption: 5,
    requireAddress: false,
    antiAbuse: true,
    durationDays: 30,
  },
];

export function getTemplateById(id: string) {
  return HERO_CAMPAIGN_TEMPLATES.find((t) => t.id === id);
}
