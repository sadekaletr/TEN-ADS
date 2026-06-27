/** Public landing demo redemption code — must exist in DB (see prisma/seed.ts). */
export const LANDING_DEMO_CODE = "SPARK-DEMO-CODE";

export const LANDING_DEMO_QR_URL = `/api/qr/${LANDING_DEMO_CODE}?format=svg`;
