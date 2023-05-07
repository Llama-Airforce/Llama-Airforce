import ServiceBase from "@/Services/ServiceBase";
import Gauge from "@CM/Pages/Platform/Gauges/Models/Gauge";
import GaugeSnapshots from "@CM/Pages/Platform/Gauges/Models/GaugeSnapshots";

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
