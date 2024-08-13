import { ServiceBaseHost } from "@/Services";
import { type Gauge } from "@CM/Pages/Platform/Gauges/Models/Gauge";
import { type GaugeSnapshots } from "@CM/Pages/Platform/Gauges/Models/GaugeSnapshots";

export default class GaugeSnapshotsService extends ServiceBaseHost {
  public async get(
    gauge: Gauge
  ): Promise<{ data: GaugeSnapshots } | undefined> {
    const host = await this.getHost();
    return this.fetch(`${host}/curvepoolsnapshots`, {
      pool: gauge.name,
    });
  }
}
