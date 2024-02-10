import ServiceBase from "@/Services/ServiceBase";

export type Price = {
  symbol: string;
  price: number;
  decimals: number;
  timestamp: number;
};

type PriceResponse = {
  coins: Record<string, Price>;
};

export default class DefiLlamaService extends ServiceBase {
  public async getPrice(address: string): Promise<Price> {
    const query = `ethereum:${address}`;

    return this.fetch<PriceResponse>(
      `https://coins.llama.fi/prices/current/${query}`
    ).then((resp) => resp.coins[query]);
  }

  public async getPrices(address: string[]): Promise<Record<string, Price>> {
    const query = address.map((a) => `ethereum:${a}`).join(",");

    return this.fetch<PriceResponse>(
      `https://coins.llama.fi/prices/current/${query}`
    ).then((resp) => resp.coins);
  }
}
