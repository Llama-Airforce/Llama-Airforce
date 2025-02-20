export const apps = ["cb", "laf", "ha", "cm"] as const;
export type App = (typeof apps)[number];
