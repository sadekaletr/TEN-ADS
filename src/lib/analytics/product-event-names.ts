export const PRODUCT_EVENT_NAMES = [
  "dashboard_primary_cta_click",
  "wallet_topup_package_select",
  "wallet_topup_submit",
  "sponsor_roi_primary_cta_click",
  "sponsor_roi_range_change",
  "admin_primary_action_click",
  "redeem_step_change",
  "redeem_success_reveal",
  "marketplace_filter_apply",
  "creator_public_cta_click",
] as const;

export type ProductEventName = (typeof PRODUCT_EVENT_NAMES)[number];
