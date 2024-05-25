import { type JsonRpcSigner } from "@ethersproject/providers";
import { type ContractReceipt } from "ethers";

export type Zap = {
  logo: string;
  label: string;
  zap: (minAmountOut?: bigint) => Promise<ContractReceipt | undefined>;
  getMinAmountOut?: (
    host: string,
    signer: JsonRpcSigner,
    input: bigint,
    slippage: number
  ) => Promise<bigint>;
};

export type ZapDeposit = Zap & {
  depositSymbol: string;
  depositBalance: () => Promise<bigint | null>;
  depositDecimals: () => Promise<bigint | null>;
};

export type ZapWithdraw = Zap & {
  withdrawSymbol: string;
  withdrawDecimals: () => Promise<bigint | null>;
};

export type ZapClaim = ZapWithdraw & {
  claimBalance: () => Promise<bigint | null>;
};

export type ZapsFactories = {
  createZapsDeposit: (getInput: () => bigint | null) => ZapDeposit[];
  createZapsWithdrawal: (getInput: () => bigint | null) => ZapWithdraw[];
};
