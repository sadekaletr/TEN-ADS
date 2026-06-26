import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptyRedemptionsIllustration } from "@/components/illustrations/EmptyIllustrations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { formatDateTime } from "@/lib/format";

type LeadRow = {
  id: string;
  fullName: string;
  phone: string;
  city: string | null;
  createdAt: Date;
  campaign: { title: string; prizeName: string };
};

export function SponsorLeadsTable({ leads }: { leads: LeadRow[] }) {
  if (leads.length === 0) {
    return (
      <EmptyState
        title="لا يوجد مستفيدون بعد"
        description="ستظهر الاستردادات هنا عند إطلاق الحملات."
        illustration={<EmptyRedemptionsIllustration className="h-full w-full" />}
      />
    );
  }

  return (
    <GlassCard>
      <Table>
        <TableHead>
          <TableHeaderCell>الاسم</TableHeaderCell>
          <TableHeaderCell>الحملة</TableHeaderCell>
          <TableHeaderCell>المدينة</TableHeaderCell>
          <TableHeaderCell>التاريخ</TableHeaderCell>
        </TableHead>
        <TableBody>
          {leads.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="text-warm-white">{l.fullName}</TableCell>
              <TableCell className="text-dim">{l.campaign.title}</TableCell>
              <TableCell className="text-dim">{l.city ?? "—"}</TableCell>
              <TableCell className="font-mono text-xs text-dim">
                {formatDateTime(l.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </GlassCard>
  );
}
