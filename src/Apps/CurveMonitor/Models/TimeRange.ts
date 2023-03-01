export const timeRanges = ["day", "week", "month"] as const;

export type TimeRange = typeof timeRanges[number];
