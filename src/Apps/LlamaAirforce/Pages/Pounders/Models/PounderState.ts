export type PounderState = {
  priceUnderlying: number | undefined;
  priceShare: number | undefined;

  // How much of the underlying can be deposited into the pounder.
  balanceDeposit: bigint | undefined;

  // How much of the underlying is withdrawable from the pounder.
  balanceWithdraw: bigint | undefined;

  // How much of the pounder shares can be claimed.
  balanceUnclaimed: bigint | undefined;

  decimalsDeposit: bigint;
  decimalsWithdraw: bigint;

  symbolDeposit: string;
  symbolWithdraw: string;
  symbolLpPrimary: string;

  oraclePrice: number;
  tvl: bigint | undefined;
  apy: number | undefined;
};
