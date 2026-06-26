import type { ReactNode } from "react";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export interface LegalSection {
  title: string;
  content: ReactNode;
}

interface LegalDocumentProps {
  title: string;
  effectiveDate: string;
  sections: LegalSection[];
}

export function LegalDocument({
  title,
  effectiveDate,
  sections,
}: LegalDocumentProps) {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <SurfaceCard>
        <h1 className="font-brand text-2xl font-semibold text-gold-accent">
          {title}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">تاريخ السريان: {effectiveDate}</p>
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-lg font-medium text-text-primary">
                {section.title}
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-text-secondary">
                {section.content}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-10 border-t border-subtle pt-6 text-xs text-text-muted">
          هذه الوثيقة معدّة للإطلاق التجريبي ولا تُعدّ استشارة قانونية. يُنصح
          بمراجعتها مع مستشار قانوني محلي قبل إطلاق عام واسع.
        </p>
      </SurfaceCard>
    </main>
  );
}
