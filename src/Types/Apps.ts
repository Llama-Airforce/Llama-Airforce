export const apps = ["cb", "laf", "ha", "cm", "pm", "pm-lrt"] as const;
export type App = (typeof apps)[number];
