import { type App, apps } from "@/Types/Apps";

export function useApp() {
  const app = import.meta.env.VITE_APP as App | undefined;

  if (!app) {
    const error = "Missing app for useApp()";
    notify({ text: error, type: "error" });
    throw new Error(error);
  }

  if (!apps.includes(app)) {
    const error = `Unknown app for useApp(): ${app}`;

    notify({ text: error, type: "error" });
    throw new Error(error);
  }

  return app;
}
