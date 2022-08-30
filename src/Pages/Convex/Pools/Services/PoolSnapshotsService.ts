import Pool from "@/Pages/Convex/Pools/Models/Pool";
import PoolSnapshots from "@/Pages/Convex/Pools/Models/PoolSnapshots";
import ServiceBase from "@/Services/ServiceBase";

export class PoolSnapshotsResponse {
  data: PoolSnapshots;
}

export default class PoolSnapshotsService extends ServiceBase {
  public async get(pool: Pool): Promise<PoolSnapshotsResponse> {
    return this.fetch(`${this.host}/poolsnapshots`, PoolSnapshotsResponse, {
      pool: pool.name
    });
  }
}
