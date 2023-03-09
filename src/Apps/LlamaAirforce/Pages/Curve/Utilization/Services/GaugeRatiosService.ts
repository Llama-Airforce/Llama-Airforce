import GaugeRatios from "@LAF/Pages/Curve/Utilization/Models/GaugeRatios";
import ServiceBase from "@/Services/ServiceBase";

export class GaugeRatiosResponse {
  ratios: GaugeRatios[];
}

export default class GaugeRatiosService extends ServiceBase {
  public async get(): Promise<GaugeRatiosResponse> {
    return this.fetch(`${this.host}/curvepoolratios`, GaugeRatiosResponse);
  }
}
