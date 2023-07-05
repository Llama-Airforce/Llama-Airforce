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

export type DataResponse = {
  mcap: number;
};

export default class DefiLlamaService extends ServiceBase {
  public async getPrice(address: string): Promise<Price> {
    const query = `ethereum:${address}`;

    return this.fetch(
      `https://coins.llama.fi/prices/current/${query}`,
      PriceResponse
    ).then((resp) => resp.coins[query]);
  }

  public async getPrices(address: string[]): Promise<Record<string, Price>> {
    const query = address.map((a) => `ethereum:${a}`).join(",");

    return this.fetch(
      `https://coins.llama.fi/prices/current/${query}`,
      PriceResponse
    ).then((resp) => resp.coins);
  }

  public async getData(protocol: string): Promise<DataResponse> {
    return this.fetchType<DataResponse>(
      `https://api.llama.fi/updatedProtocol/${protocol}`
    );
  }
}
