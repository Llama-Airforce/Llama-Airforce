import { type App } from "@/Framework/Apps";

// Default API host endpoints for apps.
export const hosts: Record<App, string | undefined> = {
  laf: "https://api.llama.airforce",
  cb: undefined,
  cm: "https://api-old.llama.airforce",
  pm: undefined,
  "pm-lrt": undefined,
};
