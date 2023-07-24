import ServiceBase from "@/Services/ServiceBase";
import { type Chain } from "@CM/Models/Chain";

const API_URL = "https://api-py.llama.airforce/curve/v1";

export type Cushion = {
  pool: string;
  address: string;
  chain: Chain;
  coins: string[];
  coinNames: string[];
  balance: number[];
  value: number;
  totalUSD: number;
};

export default class CushionService extends ServiceBase {
  public async getCushions(): Promise<{ cushions: Cushion[] }> {
    return this.fetch(`${API_URL}/protocol/couch/cushions`);
  }
}
