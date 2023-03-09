import Gauge from "@LAF/Pages/Curve/Gauges/Models/Gauge";
import ServiceBase from "@/Services/ServiceBase";

export class GaugeResponse {
  pools: Gauge[];
}

export default class GaugeService extends ServiceBase {
  public async get(): Promise<GaugeResponse> {
    return this.fetch(`${this.host}/curvepool`, GaugeResponse);
  }
}
