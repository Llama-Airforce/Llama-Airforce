import ServiceBase from "@/Services/ServiceBase";

export class Data {
  price: number;
  mcap: number;
}

export class DataResponse {
  tokenPrice: number;
  mcap: number;
}

export default class DefiLlamaService extends ServiceBase {
  public async getData(): Promise<Data> {
    return this.fetch(
      "https://api.llama.fi/updatedProtocol/curve-finance",
      DataResponse
    ).then((resp) => ({ price: resp.tokenPrice, mcap: resp.mcap }));
  }
}
