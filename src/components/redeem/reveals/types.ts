import type { Campaign, Sponsor } from "@prisma/client";

export type RevealDoneProps = {
  campaign: Campaign & { sponsor: Sponsor };
  prizeName: string;
  reference: string;
  qrCode?: string;
  reducedMotion: boolean;
};
