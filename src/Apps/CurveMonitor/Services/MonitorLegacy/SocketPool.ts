import { io, type Socket } from "socket.io-client";

type ClientToServerEvents = {
  "new combination": (dto: [string, string, string]) => void;

  day: () => void;
  week: () => void;
  month: () => void;
};

type ServerToClientEvents = {
  table_all: (dto: TransactionDto[]) => void;
  "Update Table-ALL": (dto: TransactionDto) => void;

  table_mev: (dto: SandwichDto[]) => void;
  "Update Table-MEV": (dto: SandwichDto) => void;

  price_chart: (dto: PriceDto[]) => void;
  "Update Price-Chart": (dto: PriceDto) => void;

  balances_chart: (dto: BalancesDto[]) => void;
  "Update Balance-Chart": (dto: BalancesDto) => void;

  tvl_chart: (dto: TvlDto[]) => void;
  "Update TVL-Chart": (dto: TvlDto) => void;

  volume_chart: (dto: VolumeDto[]) => void;
  "Update Volume-Chart": (dto: VolumeDto) => void;

  bonding_curve: (dto: BondingDto) => void;

  "token names inside pool": (dto: NamesDto) => void;

  price_chart_combination: (dto: PairDto) => void;
};

export type TransactionDto = {
  type: "swap" | "deposit" | "remove";
  txHash: string;
  blockNumber: number;
  position: number;
  trader: string;
  unixtime: number;
};

export type TransactionDtoSwap = TransactionDto & {
  type: "swap";
  tradeDetails: {
    amountIn: number;
    nameIn: string;
    amountOut: number;
    nameOut: string;
    feeUSD: number;
    valueUSD: number;
  };
};

export type TransactionDtoDeposit = TransactionDto & {
  type: "deposit";
  tradeDetails: {
    amountIn: number;
    nameIn: string;
    valueUSD: number;
  }[];
};

export type TransactionDtoRemove = TransactionDto & {
  type: "remove";
  tradeDetails: {
    amountOut: number;
    nameOut: string;
    valueUSD: number;
  }[];
};

export type SandwichDto = {
  blockNumber: number;
  unixtime: number;
  profit: number;
  profitUnit: string;
  loss: number;
  lossUnit: string;
  tx: TransactionDto[];
};

export type PriceDto = {
  [unixtime: string]: number;
};

export type BalancesDto = {
  [unixtime: string]: number[];
};

export type TvlDto = {
  [unixtime: string]: number;
};

export type VolumeDto = {
  [unixtime: string]: number;
};

export type BondingDto = {
  coin0: string;
  coin1: string;
  x: number[];
  y: number[];
  balance0: number;
  balance1: number;
};

export type NamesDto = string[];

export type PairDto = [string, string];

export type SocketPool = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createSocketPool(url: string, poolAddress: string): SocketPool {
  return io(`${url}/${poolAddress}`, {
    autoConnect: false,
    secure: true,
  });
}
