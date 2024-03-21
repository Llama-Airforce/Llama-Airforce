import { ServiceBase } from "@/Services";
import { type DecimalTimeSeries } from "@PM/Services/Series";
import { type Flavor, apiUrl } from "@PM/Models/Flavor";

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

export default class CollateralService extends ServiceBase {
  private readonly API_URL: string;

  constructor(host: string, flavor: Flavor) {
    super(host);
    this.API_URL = apiUrl(flavor);
  }

  public async getCollateralPrices(
    chain: string,
    collateral: string,
    period: string
  ): Promise<{ oracle: DecimalTimeSeries[]; market: DecimalTimeSeries[] }> {
    return this.fetch(
      `${this.API_URL}/collateral/${chain}/${collateral}/prices?period=${period}`
    );
  }

  public async getCollateralPriceImpact(
    chain: string,
    collateral: string
  ): Promise<{ impact: PriceImpact[] }> {
    return this.fetch(
      `${this.API_URL}/collateral/${chain}/${collateral}/impact`
    );
  }

  public async getCollateralInfo(
    chain: string,
    collateral: string
  ): Promise<{ info: CollateralInfo }> {
    return this.fetch(`${this.API_URL}/collateral/${chain}/${collateral}/info`);
  }
}
