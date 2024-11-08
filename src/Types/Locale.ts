export const locales = ["en", "zh", "fr"] as const;

export type Locale = typeof locales[number];
