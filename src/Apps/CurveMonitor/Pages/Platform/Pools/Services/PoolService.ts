import ServiceBase from "@/Services/ServiceBase";
import type { Pool } from "@CM/Pages/Platform/Pools/Models";

const API_URL = "https://api-py.llama.airforce/curve/v1";

export default class PoolService extends ServiceBase {
  public async get(): Promise<{ pools: Pool[] }> {
    return this.fetch(`${API_URL}/pools/mainnet/all`);
  }
}
