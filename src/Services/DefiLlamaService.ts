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

  public async getPrices(address: string[]): Promise<Record<string, Price>> {
    const coins = address.map((a) => `ethereum:${a}`);
    const body = {
      coins: coins,
    };

    return this.fetch(
      "https://coins.llama.fi/prices",
      PriceResponse,
      body
    ).then((resp) => resp.coins);
  }
}
