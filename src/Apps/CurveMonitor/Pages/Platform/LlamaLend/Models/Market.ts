export type Market = {
  name: string;
  controller: string;
  numLoans: number;
  borrowRate: number;
  lendRate: number;
  priceOracle: number;
  totalAssets: number;
  collateralBalance: number;
};
