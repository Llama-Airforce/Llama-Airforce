import ServiceBase from "@/Services/ServiceBase";
import { type Pool } from "@LAF/Pages/Convex/Pools/Models/Pool";

export default class PoolService extends ServiceBase {
  public async get(): Promise<{ pools: Pool[] }> {
    return this.fetch(`${this.host}/pool`);
  }
}
