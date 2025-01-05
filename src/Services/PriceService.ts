import { ServiceBaseHost } from "@/Services/ServiceBase";
import type { Result } from "@/Framework/Server/price/routes/[addresses].get";

export type Price = Result[string];

export default class PriceService extends ServiceBaseHost {
  public async getPrice(address: string): Promise<Price | undefined> {
    const host = await this.getHost();

    const key = `ethereum:${address}`;

    return this.fetch<Result>(`${host}/price/${address}`).then(
      (resp) => resp[key]
    );
  }

  public async getPrices(addresses: string[]) {
    const host = await this.getHost();

    const query = addresses.join(",");
    return this.fetch<Result>(`${host}/price/${query}`);
  }
}
