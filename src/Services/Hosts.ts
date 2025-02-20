import type { App } from "@/Types/Apps";

// Default API host endpoints for apps.
export const hosts: Record<App, string | undefined> = {
  laf: "https://api.llama.airforce",
  ha: "https://api.hippo.army",
  cb: undefined,
  cm: "https://api2.curvemonitor.com",
};

// Development server ports.
export const ports: Record<App, number | undefined> = {
  laf: 3000,
  ha: 3002,
  cb: undefined,
  cm: 3001,
};
