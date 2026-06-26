import type { ReactNode } from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingAnalyticsProvider } from "@/components/landing/LandingAnalyticsProvider";
import { CircuitPageBackground } from "@/components/ui/CircuitPageBackground";
import { ServiceWorkerMigration } from "@/components/pwa/ServiceWorkerMigration";

type PublicShellProps = {
  children: ReactNode;
  showFooter?: boolean;
  analytics?: boolean;
};

export function PublicShell({
  children,
  showFooter = true,
  analytics = true,
}: PublicShellProps) {
  const content = (
    <>
      <LandingNav />
      <main className="min-h-screen overflow-x-hidden">{children}</main>
      {showFooter && <LandingFooter />}
    </>
  );

  return (
    <CircuitPageBackground variant="public">
      <ServiceWorkerMigration />
      {analytics ? (
        <LandingAnalyticsProvider>{content}</LandingAnalyticsProvider>
      ) : (
        content
      )}
    </CircuitPageBackground>
  );
}
