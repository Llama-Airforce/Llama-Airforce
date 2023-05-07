import ServiceBase from "@/Services/ServiceBase";
import Gauge from "@CM/Pages/Platform/Gauges/Models/Gauge";

export class GaugeResponse {
  pools: Gauge[];
}

export default class GaugeService extends ServiceBase {
  public async get(): Promise<GaugeResponse> {
    return this.fetch(`${this.host}/curvepool`, GaugeResponse);
  }
}
