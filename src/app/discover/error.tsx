"use client";

import { Button } from "@/components/ui/Button";

export default function DiscoverError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-lg text-warm-white">تعذّر تحميل الاكتشاف</h1>
      <Button className="mt-4" onClick={reset}>
        إعادة المحاولة
      </Button>
    </main>
  );
}
