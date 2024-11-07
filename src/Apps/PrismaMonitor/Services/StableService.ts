import { ServiceBase } from "@/Services";
import type {
  DecimalLabelledSeries,
  DecimalTimeSeries,
} from "@PM/Services/Series";
import { type Flavor, apiUrl } from "@PM/Models/Flavor";

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

export default class StableService extends ServiceBase {
  private readonly API_URL: string;

  constructor(flavor: Flavor) {
    super();
    this.API_URL = apiUrl(flavor);
  }

  public async getPriceHistory(
    chain: string,
    period: string
  ): Promise<{ prices: DecimalTimeSeries[] }> {
    return this.fetch(
      `${this.API_URL}/mkusd/${chain}/history?period=${period}`
    );
  }

  public async getSupplyHistory(
    chain: string
  ): Promise<{ supply: DecimalTimeSeries[] }> {
    return this.fetch(`${this.API_URL}/mkusd/${chain}/supply`);
  }

  public async getPriceHistogram(
    chain: string,
    bins: number,
    period: string
  ): Promise<{ histogram: DecimalLabelledSeries[] }> {
    return this.fetch(
      `${this.API_URL}/mkusd/${chain}/histogram?period=${period}&bins=${bins}`
    );
  }

  public async getLargeStableCoinHolders(
    chain: string
  ): Promise<{ holders: DecimalLabelledSeries[] }> {
    return this.fetch(`${this.API_URL}/mkusd/${chain}/holders`);
  }

  public async getStableCoinKPI(chain: string): Promise<{ info: StableKPI }> {
    return this.fetch(`${this.API_URL}/mkusd/${chain}/general`);
  }

  public async getCurvePoolDepth(
    chain: string
  ): Promise<{ depth: PoolDepth[] }> {
    return this.fetch(`${this.API_URL}/mkusd/${chain}/depth`);
  }
}
