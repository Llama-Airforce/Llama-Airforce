import { ServiceBase } from "@/Services";
import { type Gauge } from "@CM/Pages/Platform/Gauges/Models/Gauge";
import { type GaugeSnapshots } from "@CM/Pages/Platform/Gauges/Models/GaugeSnapshots";

export default class GaugeSnapshotsService extends ServiceBase {
  public async get(gauge: Gauge): Promise<{ data: GaugeSnapshots }> {
    return this.fetch(`${this.host}/curvepoolsnapshots`, {
      pool: gauge.name,
    });
  }
}
