import { ServiceBase } from "@/Services";
import { type Pool } from "@CM/Pages/Convex/Pools/Models/Pool";

export default class PoolService extends ServiceBase {
  public async get(): Promise<{ pools: Pool[] }> {
    return this.fetch(`${this.host}/pool`);
  }
}
