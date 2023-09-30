export const networks = ["ethereum", "fantom"] as const;

export type Network = typeof networks[number];