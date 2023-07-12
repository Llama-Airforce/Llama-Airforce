import ServiceBase from "@/Services/ServiceBase";
import { type Gauge } from "@CM/Pages/Platform/Gauges/Models/Gauge";

export default class GaugeService extends ServiceBase {
  public async get(): Promise<{ pools: Gauge[] }> {
    return this.fetch(`${this.host}/curvepool`);
  }
}
