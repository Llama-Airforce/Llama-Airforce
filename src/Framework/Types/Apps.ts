export const apps = ["cb", "laf", "cm", "pm", "pm-lrt"] as const;
export type App = (typeof apps)[number];
