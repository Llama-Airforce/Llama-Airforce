import type { Overview, OverviewId } from "@/Pages/Bribes/Models/Overview";
import ServiceBase from "@/Services/ServiceBase";

export class OverviewResponse {
  success: boolean;
  dashboard?: Overview;
}

export default class DashboardService extends ServiceBase {
  public async getOverview(overviewId: OverviewId): Promise<OverviewResponse> {
    return this.fetch(`${this.host}/dashboard`, OverviewResponse, {
      id: overviewId,
    });
  }
}
