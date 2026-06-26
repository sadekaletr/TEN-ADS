import type { TopUpRequest } from "@prisma/client";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type StepState = "done" | "active" | "pending" | "rejected";

type Step = { key: string; label: string; state: StepState };

function buildSteps(req: TopUpRequest): Step[] {
  const hasProof = Boolean(req.proofImageUrl);
  const rejected = req.status === "REJECTED";
  const approved = req.status === "APPROVED";

  return [
    {
      key: "created",
      label: "طلب الإنشاء",
      state: "done",
    },
    {
      key: "proof",
      label: "إثبات التحويل",
      state: hasProof || approved ? "done" : req.status === "PENDING" ? "active" : "pending",
    },
    {
      key: "review",
      label: rejected ? "مرفوض" : "مراجعة الإدارة",
      state: rejected
        ? "rejected"
        : approved
          ? "done"
          : hasProof && req.status === "PENDING"
            ? "active"
            : "pending",
    },
    {
      key: "credited",
      label: "إضافة الرصيد",
      state: approved ? "done" : "pending",
    },
  ];
}

function StepIcon({ state }: { state: StepState }) {
  if (state === "done") return <Icon name="check" size={16} />;
  if (state === "active") return <span className="text-sm">⏳</span>;
  if (state === "rejected") return <span className="text-sm text-red-300">✕</span>;
  return <span className="text-xs text-dim">○</span>;
}

export function TopUpTimeline({ request }: { request: TopUpRequest }) {
  const steps = buildSteps(request);

  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={step.key} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border",
                step.state === "done" && "border-gold-2 bg-gold-2/20 text-gold-1",
                step.state === "active" && "border-gold-2 bg-gold-2/10 text-gold-1",
                step.state === "rejected" && "border-red-400/50 bg-red-500/10 text-red-300",
                step.state === "pending" && "border-gold-4/30 text-dim"
              )}
            >
              <StepIcon state={step.state} />
            </span>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "mt-1 h-full min-h-6 w-px",
                  step.state === "done" ? "bg-gold-2/50" : "bg-gold-4/30"
                )}
              />
            )}
          </div>
          <div className="pb-4 pt-1.5">
            <p
              className={cn(
                "text-sm",
                step.state !== "pending" ? "text-warm-white" : "text-dim"
              )}
            >
              {step.label}
            </p>
            {step.key === "review" && request.rejectionReason && (
              <p className="mt-1 text-xs text-red-300">{request.rejectionReason}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
