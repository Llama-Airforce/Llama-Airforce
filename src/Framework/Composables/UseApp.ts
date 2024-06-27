import { type App, apps } from "@/Framework/Apps";

export function useApp() {
  const app = import.meta.env.VITE_APP as App;

  if (!apps.includes(app)) {
    const error = !app
      ? "Missing app for useApp()"
      : `Unknown app for useApp(): ${app}`;

    notify({ text: error, type: "error" });
    throw new Error(error);
  }
}
