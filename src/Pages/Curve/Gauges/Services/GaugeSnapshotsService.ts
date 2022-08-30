import Gauge from "@/Pages/Curve/Gauges/Models/Gauge";
import GaugeSnapshots from "@/Pages/Curve/Gauges/Models/GaugeSnapshots";
import ServiceBase from "@/Services/ServiceBase";

export class GaugeSnapshotsResponse {
  data: GaugeSnapshots;
}

export default class GaugeSnapshotsService extends ServiceBase {
  public async get(gauge: Gauge): Promise<GaugeSnapshotsResponse> {
    return this.fetch(
      `${this.host}/curvepoolsnapshots`,
      GaugeSnapshotsResponse,
      {
        pool: gauge.name,
      }
    );
  }
}
