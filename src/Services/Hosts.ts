import { type App } from "@/Framework/Apps";

// Default API host endpoints for apps.
export const hosts: Record<App, string | undefined> = {
  laf: "https://api.llama.airforce",
  cb: undefined,
  cm: "https://api2.curvemonitor.com",
  pm: undefined,
  "pm-lrt": undefined,
};

// Development server ports.
export const ports: Record<App, number | undefined> = {
  laf: 3000,
  cb: undefined,
  cm: 3001,
  pm: undefined,
  "pm-lrt": undefined,
};
