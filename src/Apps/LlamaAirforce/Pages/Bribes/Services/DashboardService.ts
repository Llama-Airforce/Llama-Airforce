import { ServiceBase } from "@/Services";
import type { Overview, OverviewId } from "@LAF/Pages/Bribes/Models";

export default class DashboardService extends ServiceBase {
  public async getOverview(overviewId: OverviewId): Promise<{
    success: boolean;
    dashboard?: Overview;
  }> {
    return this.fetch(`${this.host}/dashboard`, {
      id: overviewId,
    });
  }
}
