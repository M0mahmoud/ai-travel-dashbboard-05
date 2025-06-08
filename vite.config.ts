import { reactRouter } from "@react-router/dev/vite";
import {
  sentryReactRouter,
  type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "mahmoud-1j",
  project: "ai-travel-dashboard",
  authToken:
    "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",
};

export default defineConfig((config) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    sentryReactRouter(sentryConfig, config),
  ],
  ssr: {
    noExternal: [/@syncfusion/],
  },
}));
