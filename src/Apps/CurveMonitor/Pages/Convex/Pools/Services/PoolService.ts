import { ServiceBaseHost } from "@/Services";
import { type Pool } from "@CM/Pages/Convex/Pools/Models/Pool";

export default class PoolService extends ServiceBaseHost {
  public async get(): Promise<{ pools: Pool[] }> {
    const host = await this.getHost();
    return this.fetch(`${host}/pool`);
  }
}
