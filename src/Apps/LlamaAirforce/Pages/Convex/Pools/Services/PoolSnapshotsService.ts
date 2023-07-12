import { type Pool } from "@LAF/Pages/Convex/Pools/Models/Pool";
import { type PoolSnapshots } from "@LAF/Pages/Convex/Pools/Models/PoolSnapshots";
import ServiceBase from "@/Services/ServiceBase";

export default class PoolSnapshotsService extends ServiceBase {
  public async get(pool: Pool): Promise<{ data: PoolSnapshots }> {
    return this.fetch(`${this.host}/poolsnapshots`, {
      pool: pool.name,
    });
  }
}
