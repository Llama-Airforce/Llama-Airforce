import ServiceBase from "@/Services/ServiceBase";

const API_URL = "https://api-py.llama.airforce/curve/v1";

export type Cushion = {
  pool: string;
  address: string;
  coins: string[];
  coinNames: string[];
  balance: number[];
  value: number;
  totalUSD: number;
};

export default class CurveService extends ServiceBase {
  public async getCushions(): Promise<{ cushions: Cushion[] }> {
    return this.fetchType(`${API_URL}/protocol/couch/cushions`);
  }
}
