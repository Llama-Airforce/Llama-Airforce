import { ServiceBase } from "@/Services";
import type { Volume, Pool } from "@CM/Pages/Platform/PoolsOld/Models";

const API_URL = "https://api-py.llama.airforce/curve/v1";

export default class VolumeService extends ServiceBase {
  public async get(pool: Pool): Promise<{ volume: Volume[] }> {
    return this.fetch(`${API_URL}/pools/mainnet/volume/${pool.address}`);
  }
}
