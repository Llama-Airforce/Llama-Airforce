import type { Address } from "@/Framework/Address";

export type Token = {
  address: Address;
  symbol: string;
};

export type Swapper = {
  address: Address;
  name: string;
};

export type WatchlistType = "token" | "swapper";
export type Watchlist<T extends WatchlistType = WatchlistType> = {
  name: string;
  type: T;
  items: T extends "token" ? Token[] : Swapper[];
};

export function initWatchlists(): Watchlist[] {
  return [initWatchlistTokens(), initWatchlistSwappers()];
}

export function initWatchlistTokens(): Watchlist<"token"> {
  return {
    name: "Stables",
    type: "token",
    items: [
      {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        symbol: "USDT",
      },
      {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        symbol: "USDC",
      },
    ],
  };
}

export function initWatchlistSwappers(): Watchlist<"swapper"> {
  return {
    name: "1inch",
    type: "swapper",
    items: [
      {
        address: "0x111111125421ca6dc452d289314280a0f8842a65" as Address,
        name: "1inch V6",
      },
      {
        address: "0x1111111254eeb25477b68fb85ed929f73a960582" as Address,
        name: "1inch V5",
      },
    ],
  };
}
