import { type Swap } from "@Pounders/Models/Swap";
import { type TransactionReceipt } from "viem";

export type Zap = {
  logo: string;
  label: string;
  zap: (minAmountOut?: bigint) => Promise<TransactionReceipt | undefined>;
  getMinAmountOut?: (
    host: string,
    input: bigint,
    slippage: number
  ) => Promise<bigint>;
};

export type ZapDeposit = Zap & {
  depositSymbol: string;
  depositBalance: () => Promise<bigint | undefined>;
  depositDecimals: () => Promise<bigint | undefined>;
};

export type ZapWithdraw = Zap & {
  withdrawSymbol: string;
  withdrawDecimals: () => Promise<bigint | undefined>;
};

export type ZapClaim = ZapWithdraw & {
  claimBalance: () => Promise<bigint | undefined>;
};

export type ZapsFactories = {
  createZapsDeposit: (
    getInput: () => bigint | undefined
  ) => (ZapDeposit | Swap)[];
  createZapsWithdrawal: (
    getInput: () => bigint | undefined
  ) => (ZapWithdraw | Swap)[];
};
