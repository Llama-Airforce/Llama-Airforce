import ServiceBase from "@/Services/ServiceBase";

const API_URL = "https://api-py.llama.airforce/curve/v1";

export type Market = {
  name: string;
  address: string;
  llamma: string;
  rate: number;
  rateAbsDelta: number;
  borrowed: number;
  borrowedDelta: number;
  totalCollateral: number;
  totalCollateralDelta: number;
  collateral: number;
  stableCoin: number;
  loans: number;
  loansDelta: number;
};

export type MarketVolume = {
  timestamp: number;
  swapVolumeUsd: number;
};

export type MarketLoans = {
  timestamp: number;
  nLoans: number;
};

export type MarketRates = {
  timestamp: number;
  rate: number;
};

export type MarketDecile = {
  debt: number;
  collateral: number;
  collateralUsd: number;
  stableCoin: number;
};

export type MarketDeciles = {
  [decile: string]: MarketDecile;
};

export type MarketState = MarketDecile & {
  index: number;
  user: string;
  N: number;
  health: number;
};

export type PoolStats = {
  address: string;
  name: string;
  tvl: number;
  normalizedReserves: [number, number];
  reservesUSD: [number, number];
  volumeUSD: number;
};

export type PoolPrice = {
  timestamp: number;
  [token: string]: number;
};

export type PriceHistogram = {
  x: number[];
  y: number[];
};

export type CrvUsdSupply = {
  timestamp: number;
  name: string;
  totalSupply: number;
};

export type Fees = {
  pending: number;
  collected: number;
};

export type FeesBreakdown = {
  market: string;
  crvUsdAdminFees: number;
  adminBorrowingFees: number;
  collateralAdminFeesUsd: number;
};

export type KeepersDebt = {
  keeper: string;
  pool: string;
  market: string;
  debt: number;
};

export type KeepersProfit = {
  keeper: string;
  pool: string;
  market: string;
  profit: number;
};

export type Yield = {
  platform: string;
  pool: string;
  apy: number;
};

export type HistoricalSoftLiquidations = {
  timestamp: number;
  collateralPrice: number;
  proportion: number;
};

export type HistoricalMedianLoss = {
  timestamp: number;
  lossPct: number;
};

export type HistoricalAverageHealth = {
  timestamp: number;
  quartiles: number[];
};

export type HealthDecile = {
  decile: string;
  collateralUsdValue: number;
  debt: number;
  stablecoin: number;
};

export type HistoricalLosers = {
  timestamp: number;
  losers: number;
};

export type HistoricalLiquidations = {
  timestamp: number;
  selfCount: number;
  hardCount: number;
  selfValue: number;
  hardValue: number;
};

export type Liquidators = {
  address: string;
  count: number;
  value: number;
};

export type MarketHealthState = {
  softLiqUsers: number;
  softLiqRatio: number;
  liqablePositions: number;
  liqableDebt: number;
  liqableCollatUsd: number;
  liqableStable: number;
  medianHealth: number;
  collatRatio: number;
};

export type AvailableCap = {
  timestamp: number;
  borrowable: number;
  ceiling: number;
};

export default class CurveService extends ServiceBase {
  public async getMarkets(): Promise<{ markets: Market[] }> {
    return this.fetch(`${API_URL}/crvusd/markets`);
  }

  public async getMarketVolume(
    marketAddr: string
  ): Promise<{ volumes: MarketVolume[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/volume`);
  }

  public async getMarketLoans(
    marketAddr: string
  ): Promise<{ loans: MarketLoans[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/loans`);
  }

  public async getMarketRates(
    marketAddr: string
  ): Promise<{ rates: MarketRates[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/rate/daily`);
  }

  public async getMarketUserStates(
    marketAddr: string,
    offset: number,
    limit: number
  ): Promise<{ states: MarketState[] }> {
    return this.fetch(
      `${API_URL}/crvusd/markets/${marketAddr}/users/states?offset=${offset}&limit=${limit}`
    );
  }

  public async getMarketUserDeciles(
    marketAddr: string
  ): Promise<{ deciles: MarketDeciles }> {
    return this.fetch(
      `${API_URL}/crvusd/markets/${marketAddr}/users/health/deciles`
    );
  }

  public async getPoolStats(): Promise<{ stats: PoolStats[] }> {
    return this.fetch(`${API_URL}/crvusd/pools/stats`);
  }

  public async getPoolPrices(): Promise<{ prices: PoolPrice[] }> {
    return this.fetch(`${API_URL}/crvusd/prices`);
  }

  public async getCrvUsdPriceHistogram(): Promise<PriceHistogram> {
    return this.fetch(`${API_URL}/crvusd/prices/hist`);
  }

  public async getCrvUsdSupply(): Promise<{ supply: CrvUsdSupply[] }> {
    return this.fetch(`${API_URL}/crvusd/supply`);
  }

  public async getFees(): Promise<{ fees: Fees }> {
    return this.fetch(`${API_URL}/crvusd/fees`);
  }

  public async getFeesBreakdown(): Promise<{
    pending: FeesBreakdown[];
    collected: FeesBreakdown[];
  }> {
    return this.fetch(`${API_URL}/crvusd/fees/breakdown`);
  }

  public async getKeepersDebt(): Promise<{ keepers: KeepersDebt[] }> {
    return this.fetch(`${API_URL}/crvusd/keepers/debt`);
  }

  public async getKeepersProfit(): Promise<{ profit: KeepersProfit[] }> {
    return this.fetch(`${API_URL}/crvusd/keepers/profit`);
  }

  public async getYield(): Promise<{ yields: Yield[] }> {
    return this.fetch(`${API_URL}/crvusd/yield`);
  }

  public async getHistoricalSoftLiquidations(
    marketAddr: string
  ): Promise<{ losses: HistoricalSoftLiquidations[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/liquidations/losses/historical/soft`);
  }

  public async getHistoricalMedianLoss(
    marketAddr: string
  ): Promise<{ losses: HistoricalMedianLoss[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/liquidations/losses/historical/median`);
  }

  public async getHistoricalAverageHealth(
    marketAddr: string
  ): Promise<{ health: HistoricalAverageHealth[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/liquidations/health/historical`);
  }

  public async getHealthDeciles(
    marketAddr: string
  ): Promise<{ health: HealthDecile[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/liquidations/health`);
  }

  public async getProportionLosers(
    marketAddr: string
  ): Promise<{ losses: HistoricalLosers[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/liquidations/losses/historical/proportions`);
  }

  public async getHistoricalLiquidations(
    marketAddr: string
  ): Promise<{ liquidations: HistoricalLiquidations[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/liquidations/historical`);
  }

  public async getTopLiquidators(
    marketAddr: string
  ): Promise<{ liquidations: Liquidators[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/liquidations/liquidators`);
  }

  public async getMarketStateHealth(
    marketAddr: string
  ): Promise<{ health: MarketHealthState }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/liquidations/state`);
  }

  public async getMarketAvailableCap(
    marketAddr: string
  ): Promise<{ available: AvailableCap[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/available`);
  }
}
