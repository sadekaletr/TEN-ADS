"use client";

export function ValidationState() {
  return (
    <div className="flex w-full flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-8 h-1 w-48 overflow-hidden rounded-full bg-gold-4/20">
        <div className="validation-pulse absolute inset-y-0 w-1/3 rounded-full bg-gold-1" />
      </div>
      <p className="text-base text-warm-white">جاري التحقق من الكود...</p>
      <p className="mt-2 text-sm text-dim">لحظة من فضلك</p>
    </div>
  );
}
