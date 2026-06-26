interface CampaignWizardStepperProps {
  step: number;
  total?: number;
}

export function CampaignWizardStepper({ step, total = 6 }: CampaignWizardStepperProps) {
  return (
    <div
      className="flex gap-2"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={0}
      aria-valuemax={total - 1}
    >
      {Array.from({ length: total }).map((_, s) => (
        <div
          key={s}
          className={`h-1 flex-1 rounded ${s <= step ? "bg-gold-2" : "bg-surface-2"}`}
        />
      ))}
    </div>
  );
}
