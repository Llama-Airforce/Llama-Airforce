export type Event = {
  type: "deposit" | "withdraw";
  sender: string;
  owner: string;
  receiver?: string;
  assets: bigint;
  supply: bigint;
  blockNumber: number;
  timestamp: number;
  txHash: string;
};

export type Yield = {
  timestamp: number;
  assets: number;
  supply: number;
  apyProjected: string;
};

export type Revenue = {
  strategy: string;
  gain: bigint;
  loss: bigint;
  currentDebt: bigint;
  totalRefunds: bigint;
  feesTotal: bigint;
  feesProtocol: bigint;
  txHash: string;
  timestamp: number;
};

export type Statistics = {
  lastUpdated: number;
  lastUpdatedBlock: number;
  aprProjected: number;
  supply: number;
};
