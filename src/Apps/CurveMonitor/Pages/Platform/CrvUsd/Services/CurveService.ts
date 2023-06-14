import ServiceBase from "@/Services/ServiceBase";

const API_URL = "https://api-py.llama.airforce/curve/v1";

export type Market = {
  name: string;
  address: string;
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
  totalSupply: 0;
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
  debt: 0;
};

export default class CurveService extends ServiceBase {
  public async getMarkets(): Promise<{ markets: Market[] }> {
    return this.fetchType(`${API_URL}/crvusd/markets`);
  }

  public async getMarketVolume(
    marketAddr: string
  ): Promise<{ volumes: MarketVolume[] }> {
    return this.fetchType(`${API_URL}/crvusd/markets/${marketAddr}/volume`);
  }

  public async getMarketLoans(
    marketAddr: string
  ): Promise<{ loans: MarketLoans[] }> {
    return this.fetchType(`${API_URL}/crvusd/markets/${marketAddr}/loans`);
  }

  public async getMarketRates(
    marketAddr: string
  ): Promise<{ rates: MarketRates[] }> {
    return this.fetchType(`${API_URL}/crvusd/markets/${marketAddr}/rate/daily`);
  }

  public async getMarketUserStates(
    marketAddr: string,
    offset: number,
    limit: number
  ): Promise<{ states: MarketState[] }> {
    return this.fetchType(
      `${API_URL}/crvusd/markets/${marketAddr}/users/states?offset=${offset}&limit=${limit}`
    );
  }

  public async getMarketUserDeciles(
    marketAddr: string
  ): Promise<{ deciles: MarketDeciles }> {
    return this.fetchType(
      `${API_URL}/crvusd/markets/${marketAddr}/users/health/deciles`
    );
  }

  public async getPoolStats(): Promise<{ stats: PoolStats[] }> {
    return this.fetchType(`${API_URL}/crvusd/pools/stats`);
  }

  public async getPoolPrices(): Promise<{ prices: PoolPrice[] }> {
    return this.fetchType(`${API_URL}/crvusd/prices`);
  }

  public async getCrvUsdPriceHistogram(): Promise<PriceHistogram> {
    return this.fetchType(`${API_URL}/crvusd/prices/hist`);
  }

  public async getCrvUsdSupply(): Promise<{ supply: CrvUsdSupply[] }> {
    return this.fetchType(`${API_URL}/crvusd/supply`);
  }

  public async getFees(): Promise<{ fees: Fees }> {
    return this.fetchType(`${API_URL}/crvusd/fees`);
  }

  public async getFeesBreakdown(): Promise<{
    pending: FeesBreakdown[];
    collected: FeesBreakdown[];
  }> {
    return this.fetchType(`${API_URL}/crvusd/fees/breakdown`);
  }

  public async getKeepersDebt(): Promise<{ keepers: KeepersDebt[] }> {
    return this.fetchType(`${API_URL}/crvusd/keepers/debt`);
  }
}
