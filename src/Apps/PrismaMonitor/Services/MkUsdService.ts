import ServiceBase from "@/Services/ServiceBase";
import {
  type DecimalLabelledSeries,
  type DecimalTimeSeries,
} from "@PM/Services/Series";

const API_URL = "https://api.prismamonitor.com/v1";

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

export default class MkUsdService extends ServiceBase {
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
