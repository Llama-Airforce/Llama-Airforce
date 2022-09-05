import ServiceBase from "@/Services/ServiceBase";

const CHAIN_ENDPOINT =
  "http://localhost:5001/curve/v1/protocol/chains";


export class ChainResponse {
  chains: string[];
}

export default class ChainService extends ServiceBase {
  public async get(): Promise<string[]> {
    return this.fetch(CHAIN_ENDPOINT, ChainResponse).then((resp) =>
      resp.chains);
  }
}
