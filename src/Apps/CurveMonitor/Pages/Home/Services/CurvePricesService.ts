import ServiceBase from "@/Services/ServiceBase";

const API_URL = "https://prices.curve.fi/v1";

type Chain = {
  chain: string;
  total: {
    total_tvl: number;
    trading_volume_24h: number;
  };
};

export default class CurvePricesService extends ServiceBase {
  public async getChain(): Promise<Chain> {
    return this.fetch(`${API_URL}/chains/ethereum?page=1&per_page=0`);
  }
}
