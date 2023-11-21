import { ServiceBase } from "@/Services";
import { type Pool } from "@LAF/Pages/Convex/Pools/Models/Pool";
import { type PoolSnapshots } from "@LAF/Pages/Convex/Pools/Models/PoolSnapshots";

export default class PoolSnapshotsService extends ServiceBase {
  public async get(pool: Pool): Promise<{ data: PoolSnapshots }> {
    return this.fetch(`${this.host}/poolsnapshots`, {
      pool: pool.name,
    });
  }
}
