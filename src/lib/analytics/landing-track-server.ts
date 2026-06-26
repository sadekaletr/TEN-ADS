import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { LandingExperiment } from "@/lib/landing/experiment";

export interface LandingEventPayload {
  name: string;
  sessionId: string;
  locale: string;
  dir: string;
  section?: string;
  ctaLabel?: string;
  experiment?: LandingExperiment;
  metadata?: Record<string, unknown>;
}

export async function persistLandingEvent(payload: LandingEventPayload) {
  await prisma.landingEvent.create({
    data: {
      name: payload.name,
      sessionId: payload.sessionId,
      locale: payload.locale,
      dir: payload.dir,
      section: payload.section ?? null,
      ctaLabel: payload.ctaLabel ?? null,
      experiment: payload.experiment ?? "control",
      metadata: (payload.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
}
