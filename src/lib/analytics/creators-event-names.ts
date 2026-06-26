export const CREATORS_EVENT_NAMES = [
  "creators_page_view",
  "creators_filter_change",
  "creators_search",
  "creator_card_click",
  "creator_collab_click",
] as const;

export type CreatorsEventName = (typeof CREATORS_EVENT_NAMES)[number];
