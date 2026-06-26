import * as Sentry from "@sentry/nextjs";

const release =
  process.env.SENTRY_RELEASE ?? process.env.npm_package_version ?? "tenegta-spark@0.1.0";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development",
  release,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
  debug: false,
});
