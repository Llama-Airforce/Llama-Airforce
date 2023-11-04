import ServiceBase from "@/Services/ServiceBase";
import { type DecimalTimeSeries } from "@PM/Services/Series";

const API_URL = "https://api.prismamonitor.com/v1";

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
}
