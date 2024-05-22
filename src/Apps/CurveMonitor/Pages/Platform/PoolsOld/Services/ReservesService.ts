import { ServiceBase } from "@/Services";
import type { Reserves, Pool } from "@CM/Pages/Platform/PoolsOld/Models";

const API_URL = "https://api-py.llama.airforce/curve/v1";

export default class ReservesService extends ServiceBase {
  public async get(pool: Pool): Promise<{ reserves: Reserves[] }> {
    return this.fetch(`${API_URL}/pools/mainnet/reserves/${pool.address}`);
  }
}
