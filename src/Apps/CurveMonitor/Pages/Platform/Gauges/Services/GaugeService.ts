import { ServiceBaseHost } from "@/Services";
import { type Gauge } from "@CM/Pages/Platform/Gauges/Models/Gauge";

export default class GaugeService extends ServiceBaseHost {
  public async get(): Promise<{ pools: Gauge[] }> {
    const host = await this.getHost();
    return this.fetch(`${host}/curvepool`);
  }
}
