import ServiceBase from "@/Services/ServiceBase";
import { Gauge } from "@CM/Pages/Platform/Gauges/Models/Gauge";
import { GaugeSnapshots } from "@CM/Pages/Platform/Gauges/Models/GaugeSnapshots";

export default class GaugeSnapshotsService extends ServiceBase {
  public async get(gauge: Gauge): Promise<{ data: GaugeSnapshots }> {
    return this.fetch(`${this.host}/curvepoolsnapshots`, {
      pool: gauge.name,
    });
  }
}
