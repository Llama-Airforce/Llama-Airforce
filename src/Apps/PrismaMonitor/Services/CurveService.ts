import ServiceBase from "@/Services/ServiceBase";

const API_URL = "https://api.prismamonitor.com/v1";


export type DecimalTimeSeries = {
  timestamp: number;
  value: number;
};

export type HistoricalTroveManagerData = {
  manager: string;
  data: DecimalTimeSeries[];
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

  public async getMarketUserStates(
    marketAddr: string,
    offset: number,
    limit: number
  ): Promise<{ states: MarketState[] }> {
    return this.fetch(
      `${API_URL}/crvusd/markets/${marketAddr}/users/states?offset=${offset}&limit=${limit}`
    );
  }

  public async getHistoricalCollateralRatio(
    marketAddr: string
  ): Promise<{ ratios: CollateralRatios[] }> {
    return this.fetch(`${API_URL}/crvusd/markets/${marketAddr}/collateral_ratio`);
  }
}
