export type SparkFlowEventDetail = {
  id: string;
  path?: "full" | "wallet";
};

const EVENT_NAME = "tenegta:spark-flow";

export function emitSparkFlow(detail: SparkFlowEventDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
}

export function onSparkFlow(handler: (detail: SparkFlowEventDetail) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => {
    handler((e as CustomEvent<SparkFlowEventDetail>).detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
