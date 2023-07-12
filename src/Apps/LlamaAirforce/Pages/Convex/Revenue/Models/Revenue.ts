export type ProtocolRevenue = {
  totalCrvRevenueToLpProviders: number;
  totalCvxRevenueToLpProviders: number;
  totalFxsRevenueToLpProviders: number;
  totalCrvRevenueToCvxCrvStakers: number;
  totalCvxRevenueToCvxCrvStakers: number;
  totalThreeCrvRevenueToCvxCrvStakers: number;
  totalFxsRevenueToCvxFxsStakers: number;
  totalCrvRevenueToCvxStakers: number;
  totalFxsRevenueToCvxStakers: number;
  totalCrvRevenueToCallers: number;
  totalFxsRevenueToCallers: number;
  totalCrvRevenueToPlatform: number;
  totalFxsRevenueToPlatform: number;
  totalCrvRevenue: number;
  totalFxsRevenue: number;
  totalBribeRevenue: number;
  totalOtherRevenue: number;
};

export const EmptyProtocolRevenue: ProtocolRevenue = {
  totalCrvRevenueToLpProviders: 0,
  totalCvxRevenueToLpProviders: 0,
  totalFxsRevenueToLpProviders: 0,
  totalCrvRevenueToCvxCrvStakers: 0,
  totalCvxRevenueToCvxCrvStakers: 0,
  totalThreeCrvRevenueToCvxCrvStakers: 0,
  totalFxsRevenueToCvxFxsStakers: 0,
  totalCrvRevenueToCvxStakers: 0,
  totalFxsRevenueToCvxStakers: 0,
  totalCrvRevenueToCallers: 0,
  totalFxsRevenueToCallers: 0,
  totalCrvRevenueToPlatform: 0,
  totalFxsRevenueToPlatform: 0,
  totalCrvRevenue: 0,
  totalFxsRevenue: 0,
  totalBribeRevenue: 0,
  totalOtherRevenue: 0,
};

export type HistoricalRevenue = {
  crvRevenueToLpProvidersAmount: number;
  cvxRevenueToLpProvidersAmount: number;
  crvRevenueToCvxCrvStakersAmount: number;
  cvxRevenueToCvxCrvStakersAmount: number;
  threeCrvRevenueToCvxCrvStakersAmount: number;
  crvRevenueToCvxStakersAmount: number;
  crvRevenueToCallersAmount: number;
  crvRevenueToPlatformAmount: number;
  totalCrvRevenue: number;
  fxsRevenueToCvxStakersAmount: number;
  fxsRevenueToCvxFxsStakersAmount: number;
  fxsRevenueToLpProvidersAmount: number;
  fxsRevenueToCallersAmount: number;
  fxsRevenueToPlatformAmount: number;
  totalFxsRevenue: number;
  bribeRevenue: number;
  otherRevenue: number;
  timestamp: number;
};

export const EmptyHistoricalRevenue: HistoricalRevenue = {
  crvRevenueToLpProvidersAmount: 0,
  cvxRevenueToLpProvidersAmount: 0,
  crvRevenueToCvxCrvStakersAmount: 0,
  cvxRevenueToCvxCrvStakersAmount: 0,
  threeCrvRevenueToCvxCrvStakersAmount: 0,
  crvRevenueToCvxStakersAmount: 0,
  crvRevenueToCallersAmount: 0,
  crvRevenueToPlatformAmount: 0,
  totalCrvRevenue: 0,
  fxsRevenueToCvxStakersAmount: 0,
  fxsRevenueToCvxFxsStakersAmount: 0,
  fxsRevenueToLpProvidersAmount: 0,
  fxsRevenueToCallersAmount: 0,
  fxsRevenueToPlatformAmount: 0,
  totalFxsRevenue: 0,
  bribeRevenue: 0,
  otherRevenue: 0,
  timestamp: 0,
};

export type RevenueSource = {
  source: string;
  value: number;
};

export type RevenueBreakdown = {
  name: string;
  data: number[];
};
