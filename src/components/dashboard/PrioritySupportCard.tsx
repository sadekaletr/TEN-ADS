import Link from "next/link";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const WHATSAPP = process.env.NEXT_PUBLIC_PRIORITY_SUPPORT_WHATSAPP ?? "https://wa.me/963900000000";
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_PRIORITY_SUPPORT_EMAIL ?? "scale@tenegta.com";

export function PrioritySupportCard() {
  return (
    <CircuitCard className="border-gold-4/30 bg-gold-2/5">
      <div className="flex items-start gap-3">
        <Icon name="bell" size={24} className="shrink-0 text-gold-1" />
        <div>
          <p className="font-brand text-gold-1">دعم Scale — أولوية</p>
          <p className="mt-1 text-xs text-dim">SLA خلال 4 ساعات عمل · قناة مباشرة</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center rounded-lg border border-gold-4/30 px-3 text-sm text-gold-1 hover:bg-gold-2/10"
            >
              واتساب
            </Link>
            <Button href={`mailto:${SUPPORT_EMAIL}`} size="sm" variant="ghost">
              {SUPPORT_EMAIL}
            </Button>
          </div>
        </div>
      </div>
    </CircuitCard>
  );
}
