const networks = ["ethereum", "base"] as const;

export type Network = (typeof networks)[number];
