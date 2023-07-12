import { Pool } from "@LAF/Pages/Convex/Pools/Models/Pool";
import ServiceBase from "@/Services/ServiceBase";

export default class PoolService extends ServiceBase {
  public async get(): Promise<{ pools: Pool[] }> {
    return this.fetch(`${this.host}/pool`);
  }
}
