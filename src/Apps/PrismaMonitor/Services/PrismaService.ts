import ServiceBase from "@/Services/ServiceBase";

const API_URL = "https://api.prismamonitor.com/v1";

export type DecimalTimeSeries = {
  timestamp: number;
  value: number;
};

export type DecimalLabelledSeries = {
  label: string;
  value: number;
};

export type HistoricalTroveManagerData = {
  manager: string;
  data: DecimalTimeSeries[];
};

export type CollateralRatioDecilesData = {
  label: string;
  data: number;
};

export type PoolStableOperation = {
  user: string;
  amount: number;
  timestamp: number;
  hash: string;
};

export type StableFlows = {
  withdrawals: DecimalTimeSeries[];
  deposits: DecimalTimeSeries[];
};

export type StableKPI = {
  price: number;
  supply: number;
  volume: number;
  depth: number;
};

export type DepthNumbers = {
  amounts: number[];
  prices: number[];
};

export type PoolDepth = {
  name: string;
  address: string;
  tokens: string[];
  bid: DepthNumbers;
  ask: DepthNumbers;
};

export type PriceImpact = {
  amount: number;
  impact: number;
};

export type CollateralInfo = {
  price: number;
  supply: number;
  tvl: number;
  share: number;
  risk: string;
};

export default class PrismaService extends ServiceBase {
  // Vault / Trove manager endpoints
  public async getHistoricalOpenTrovesOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/open_troves?period=${period}`
    );
  }

  public async getHistoricalCollateralRatiosOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/collateral_ratios?period=${period}`
    );
  }

  public async getCollateralRatioGrouped(
    chain: string,
    period: string
  ): Promise<HistoricalTroveManagerData> {
    return this.fetch(
      `${API_URL}/managers/${chain}/global_collateral_ratio?period=${period}`
    );
  }

  public async getHistoricalCollateralOverview(
    chain: string,
    period: string
  ): Promise<{ managers: HistoricalTroveManagerData[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/collateral?period=${period}`
    );
  }

  public async getRatioDistributionGrouped(
    chain: string
  ): Promise<{ deciles: CollateralRatioDecilesData[] }> {
    return this.fetch(`${API_URL}/managers/${chain}/ratio_distribution`);
  }

  public async getLargeTrovePositions(
    chain: string,
    manager: string,
    unit: string
  ): Promise<{ positions: DecimalLabelledSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/large_positions?unit=${unit}`
    );
  }

  public async getVaultCollateralRatio(
    chain: string,
    manager: string,
    period: string
  ): Promise<{ ratio: DecimalTimeSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/collateral_ratio?period=${period}`
    );
  }

  public async getVaultTroveCount(
    chain: string,
    manager: string,
    period: string
  ): Promise<{ count: DecimalTimeSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/open_trove_count?period=${period}`
    );
  }

  public async getTroveDistribution(
    chain: string,
    manager: string,
    unit: string
  ): Promise<{ distribution: DecimalLabelledSeries[] }> {
    return this.fetch(
      `${API_URL}/managers/${chain}/${manager}/histograms?unit=${unit}`
    );
  }

  // Collateral endpoints
  public async getCollateralPrices(
    chain: string,
    collateral: string,
    period: string
  ): Promise<{ oracle: DecimalTimeSeries[]; market: DecimalTimeSeries[] }> {
    return this.fetch(
      `${API_URL}/collateral/${chain}/${collateral}/prices?period=${period}`
    );
  }

  public async getCollateralPriceImpact(
    chain: string,
    collateral: string
  ): Promise<{ impact: PriceImpact[] }> {
    return this.fetch(`${API_URL}/collateral/${chain}/${collateral}/impact`);
  }

  public async getCollateralInfo(
    chain: string,
    collateral: string
  ): Promise<{ info: CollateralInfo }> {
    return this.fetch(`${API_URL}/collateral/${chain}/${collateral}/info`);
  }

  // Stability pool endpoints
  public async getPoolTvl(
    chain: string,
    period: string
  ): Promise<{ deposits: DecimalTimeSeries[] }> {
    return this.fetch(`${API_URL}/pool/${chain}/deposits?period=${period}`);
  }

  public async getStableFlow(
    chain: string,
    period: string
  ): Promise<StableFlows> {
    return this.fetch(
      `${API_URL}/pool/${chain}/stable_operations?period=${period}`
    );
  }

  public async getStableDistribution(
    chain: string
  ): Promise<{ distribution: DecimalLabelledSeries[] }> {
    return this.fetch(`${API_URL}/pool/${chain}/histogram/deposits`);
  }

  public async getCumulativeWithdrawals(
    chain: string,
    period: string
  ): Promise<{ withdrawals: DecimalTimeSeries[] }> {
    return this.fetch(
      `${API_URL}/pool/${chain}/cumulative_withdrawals?period=${period}`
    );
  }

  public async getTopStableDeposits(
    chain: string,
    top: number,
    period: string
  ): Promise<{ operations: PoolStableOperation[] }> {
    return this.fetch(
      `${API_URL}/pool/${chain}/top/stable_deposits?top=${top}&period=${period}`
    );
  }

  public async getTopStableWithdrawals(
    chain: string,
    top: number,
    period: string
  ): Promise<{ operations: PoolStableOperation[] }> {
    return this.fetch(
      `${API_URL}/pool/${chain}/top/stable_withdrawals?top=${top}&period=${period}`
    );
  }

  // mkUSD endpoints
  public async getPriceHistory(
    chain: string,
    period: string
  ): Promise<{ prices: DecimalTimeSeries[] }> {
    return this.fetch(`${API_URL}/mkusd/${chain}/history?period=${period}`);
  }

  public async getPriceHistogram(
    chain: string,
    bins: number,
    period: string
  ): Promise<{ histogram: DecimalLabelledSeries[] }> {
    return this.fetch(
      `${API_URL}/mkusd/${chain}/histogram?period=${period}&bins=${bins}`
    );
  }

  public async getLargeStableCoinHolders(
    chain: string
  ): Promise<{ holders: DecimalLabelledSeries[] }> {
    return this.fetch(`${API_URL}/mkusd/${chain}/holders`);
  }

  public async getStableCoinKPI(chain: string): Promise<{ info: StableKPI }> {
    return this.fetch(`${API_URL}/mkusd/${chain}/general`);
  }

  public async getCurvePoolDepth(
    chain: string
  ): Promise<{ depth: PoolDepth[] }> {
    return this.fetch(`${API_URL}/mkusd/${chain}/depth`);
  }
}
