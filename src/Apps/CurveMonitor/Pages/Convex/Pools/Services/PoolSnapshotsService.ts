import { ServiceBaseHost } from "@/Services";
import { type Pool } from "@CM/Pages/Convex/Pools/Models/Pool";
import { type PoolSnapshots } from "@CM/Pages/Convex/Pools/Models/PoolSnapshots";

export default class PoolSnapshotsService extends ServiceBaseHost {
  public async get(pool: Pool): Promise<{ data: PoolSnapshots }> {
    const host = await this.getHost();
    return this.fetch(`${host}/poolsnapshots`, {
      pool: pool.name,
    });
  }
}
