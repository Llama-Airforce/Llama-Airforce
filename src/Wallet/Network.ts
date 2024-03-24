const networks = ["mainnet", "base"] as const;

export type Network = (typeof networks)[number];
