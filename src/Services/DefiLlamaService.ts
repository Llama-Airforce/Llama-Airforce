import ServiceBase from "@/Services/ServiceBase";

export class Price {
  symbol: string;
  price: number;
  decimals: number;
  timestamp: number;
}

export class PriceResponse {
  coins: Record<string, Price>;
}

export default class DefiLlamaService extends ServiceBase {
  public async getPrice(address: string): Promise<Price> {
    const key = `ethereum:${address}`;
    const body = {
      coins: [key],
    };

    return this.fetch(
      "https://coins.llama.fi/prices",
      PriceResponse,
      body
    ).then((resp) => resp.coins[key]);
  }
}
