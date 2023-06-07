import ServiceBase from "@/Services/ServiceBase";

export type DataResponse = {
  tokenPrice: number;
  mcap: number;
};

export default class DefiLlamaService extends ServiceBase {
  public async getData(): Promise<DataResponse> {
    return this.fetchType<DataResponse>(
      "https://api.llama.fi/updatedProtocol/curve-finance"
    );
  }
}
