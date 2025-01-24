import type { Address } from "..";

export type SoftLiqRatio = {
  timestamp: number;
  proportion: number;
};

export type LiquidationDetails = {
  timestamp: number;
  user: Address;
  liquidator: Address;
  self: boolean;
  collateralReceived: number;
  collateralReceivedUsd: number;
  stablecoinReceived: number;
  priceOracle: number;
  debt: number;
  n1: number;
  n2: number;
  tx: Address;
  block: number;
};

export type LiquidationAggregate = {
  timestamp: number;
  selfCount: number;
  hardCount: number;
  selfValue: number;
  hardValue: number;
  price: number;
};

export type LiqOverview = {
  softLiqUsers: number;
  liqablePositions: number;
  liqableDebtUsd: number;
  liqableCollatUsd: number;
  liqableBorrowedUsd: number;
  medianHealth: number;
  avgHealth: number;
  collatRatio: number;
};

export type LiqLosses = {
  timestamp: number;
  pctLossMedian: number;
  pctLossAverage: number;
  absoluteLossMedian: number;
  absoluteLossAverage: number;
  numTotalUsers: number;
  numUsersWithLosses: number;
  ratio: number;
};

export type LiqHealthDecile = {
  decile: string;
  collateralUsdValue: number;
  debt: number;
  stablecoin: number;
};
