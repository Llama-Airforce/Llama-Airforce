import Volume from "@/Pages/Curve/Pools/Models/Volume";
import Pool from "@/Pages/Curve/Models/Pool";
import ServiceBase from "@/Services/ServiceBase";

const ENDPOINT = "https://api-py.llama.airforce/curve/v1/pools/mainnet/volume/";

export class PoolVolumeResponse {
  volume: Volume[];
}

export default class VolumeService extends ServiceBase {
  public async get(pool: Pool): Promise<Volume[]> {
    return this.fetch(ENDPOINT + pool.id, PoolVolumeResponse).then(
      (resp) => resp.volume
    );
  }
}
