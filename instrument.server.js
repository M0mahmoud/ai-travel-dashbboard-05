import * as Sentry from "@sentry/react-router";

Sentry.init({
  dsn: "https://68734ba84fd84f7c9fbdce0b77fadf0a@o1372052.ingest.us.sentry.io/6676810",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
