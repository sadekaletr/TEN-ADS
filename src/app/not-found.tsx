import { SparkIcon } from "@/components/ui/SparkIcon";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-4 text-center">
      <SparkIcon size={64} />
      <h1 className="mt-6 text-4xl font-bold text-text-primary">الصفحة غير موجودة</h1>
      <p className="mt-2 text-text-secondary">
        يبدو أن الرابط الذي تتبعه غير صحيح أو أن الصفحة نُقلت
      </p>
      <Button href="/" className="mt-6">
        العودة للرئيسية
      </Button>
    </div>
  );
}
