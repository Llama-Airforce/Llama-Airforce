import { type Fees } from "@Pounders/Models/Fees";

export type PounderState = {
  priceUnderlying: number | null;
  priceShare: number | null;

  // How much of the underlying can be deposited into the pounder.
  balanceDeposit: bigint | null;

  // How much of the underlying is withdrawable from the pounder.
  balanceWithdraw: bigint | null;

  // How much of the pounder shares can be claimed.
  balanceUnclaimed: bigint | null;

  decimalsDeposit: bigint;
  decimalsWithdraw: bigint;

  symbolDeposit: string;
  symbolWithdraw: string;
  symbolLpPrimary: string;

  oraclePrice: number;
  tvl: bigint | null;
  apy: number | null;
  fees: Fees | null;
};
