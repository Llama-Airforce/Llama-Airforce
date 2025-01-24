import type { Address } from "..";

type Deposit = {
  amount: number;
  n1: number;
  n2: number;
};

type Withdrawal = {
  amount_borrowed: number;
  amount_collateral: number;
};

export type LlammaEvent = {
  provider: Address;
  deposit?: Deposit | null;
  withdrawal?: Withdrawal | null;
  block_number: number;
  timestamp: number;
  transaction_hash: Address;
};

export type LlammaTrade = {
  sold_id: number;
  bought_id: number;
  token_sold: {
    symbol: string;
    address: Address;
  };
  token_bought: {
    symbol: string;
    address: Address;
  };
  amount_sold: number;
  amount_bought: number;
  price: number;
  buyer: Address;
  fee_x: number;
  fee_y: number;
  block_number: number;
  timestamp: number;
  transaction_hash: Address;
};

export type LlammaOHLC = {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
  base_price: number;
  oracle_price: number;
  volume: number;
};
