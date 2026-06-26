export const ADMIN_EVENT_NAMES = [
  "admin_creator_save",
  "admin_upload_cover",
  "admin_campaign_status",
  "admin_sponsor_save",
  "admin_wallet_adjust",
] as const;

export type AdminEventName = (typeof ADMIN_EVENT_NAMES)[number];
