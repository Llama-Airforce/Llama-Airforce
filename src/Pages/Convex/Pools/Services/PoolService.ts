import Pool from "@/Pages/Convex/Pools/Models/Pool";
import ServiceBase from "@/Services/ServiceBase";

export class PoolResponse {
  pools: Pool[];
}

export default class PoolService extends ServiceBase {
  public async get(): Promise<PoolResponse> {
    return this.fetch(`${this.host}/pool`, PoolResponse);
  }
}
