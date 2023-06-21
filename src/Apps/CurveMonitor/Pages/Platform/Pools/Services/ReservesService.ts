import ServiceBase from "@/Services/ServiceBase";
import type { Reserves, Pool } from "@CM/Pages/Platform/Pools/Models";

const API_URL = "https://api-py.llama.airforce/curve/v1";

export default class ReservesService extends ServiceBase {
  public async get(pool: Pool): Promise<{ reserves: Reserves[] }> {
    return this.fetchType(`${API_URL}/pools/mainnet/reserves/${pool.address}`);
  }
}
