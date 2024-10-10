/*
 * Note that collateral can be two tokens due to soft-liquidations.
 * You can have a crvUSD borrow (partially) being collateralized by crvUSD.
 */
export type Market = {
  name: string;
  controller: string;
  vault: string;
  llamma: string;
  policy: string;
  oracle: string;
  rate: number;
  borrow_apy: number;
  lend_apy: number;
  n_loans: number;
  price_oracle: number;
  amm_price: number;
  total_debt: number; // Borrowed
  total_assets: number; // Supplied
  total_debt_usd: number;
  total_assets_usd: number;
  minted: number;
  redeemed: number;
  minted_usd: number;
  redeemed_usd: number;
  collateral_balance: number; // Collateral (like CRV)
  borrowed_balance: number; // Collateral (like crvUSD)
  collateral_balance_usd: number;
  borrowed_balance_usd: number;
  collateral_token: {
    symbol: string;
    address: string;
  };
  borrowed_token: {
    symbol: string;
    address: string;
  };
};

export type MarketPair = { long?: Market; short?: Market };

export type Snapshot = {
  rate: number;
  borrowApy: number;
  lendApy: number;
  numLoans: number;
  priceOracle: number;
  ammPrice: number;
  totalDebt: number;
  totalDebtUsd: number;
  totalAssets: number;
  totalAssetsUsd: number;
  minted: number;
  redeemed: number;
  collateralBalance: number;
  collateralBalanceUsd: number;
  borrowedBalance: number;
  borrowedBalanceUsd: number;
  timestamp: number;
  discountLiquidation: number;
  discountLoan: number;
};

/** More specifically, the markets where a user holds a position */
export type UserMarkets = {
  name: string;
  controller: string;
  snapshotFirst: number;
  snapshotLast: number;
}[];

export type UserMarketStats = {
  health: number;
  healthFull: number;
  n1: number;
  n2: number;
  n: number;
  debt: number;
  collateral: number;
  borrowed: number;
  softLiquidation: boolean;
  totalDeposited: number;
  loss: number;
  lossPct: number;
  collateralUp: number;
  oraclePrice: number;
  blockNumber: number;
  timestamp: number;
};

export type UserMarketSnapshots = UserMarketStats[];

export type UserCollateralEvents = {
  controller: string;
  user: string;
  totalDeposit: number;
  totalDepositUsd: number;
  totalDepositFromUser: number;
  totalDepositFromUserPrecise: string;
  totalDepositPrecise: string;
  totalBorrowed: number;
  totalBorrowedPrecise: string;
  events: {
    timestamp: number;
    txHash: string;
    type: "Borrow" | "Deposit";
    user: string;
    collateralChange: number;
    collateralChangeUsd?: number;
    loanChange: number;
    loanChangeUsd?: number;
    liquidation?: {
      user: string;
      liquidator: string;
      collateralReceived: number;
      collateralReceivedUsd: number;
      stablecoinReceived: number;
      stablecoinReceivedUsd: number;
      debt: number;
      debtUsd: number;
    };
    leverage?: {
      type: string;
      user: string;
      userCollateral: number;
      userCollateralFromBorrowed: number;
      userCollateralUsed: number;
      userBorrowed: number;
      debt: number;
      leverageCollateral: number;
      stateCollateralUsed: number;
      borrowedFromStateCollateral: number;
      borrowedFromUserCollateral: number;
    };
    n1: number;
    n2: number;
    oraclePrice: number;
  }[];
};
