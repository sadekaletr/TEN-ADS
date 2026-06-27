export const LANDING_EVENT_NAMES = [
  "landing_view",
  "landing_scroll_25",
  "landing_scroll_50",
  "landing_scroll_75",
  "landing_scroll_100",
  "landing_cta_creator_click",
  "landing_cta_sponsor_click",
  "landing_discover_click",
  "landing_demo_click",
  "landing_demo_tab_create",
  "landing_demo_tab_share",
  "landing_demo_tab_reveal",
  "landing_product_film_cta",
  "landing_final_cta_click",
  "landing_faq_expand",
  "landing_nav_login_click",
  "landing_pricing_plan_click",
] as const;

export type LandingEventName = (typeof LANDING_EVENT_NAMES)[number];
