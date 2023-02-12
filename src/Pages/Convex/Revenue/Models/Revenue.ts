export class ProtocolRevenue {
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
}

export class HistoricalRevenue {
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
  timestamp: number;
}

export class RevenueSource {
  source: string;
  value: number;
}

export class RevenueBreakdown {
  name: string;
  data: number[];
}
