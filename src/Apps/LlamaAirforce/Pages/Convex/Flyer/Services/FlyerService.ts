import { ServiceBase } from "@/Services";
import type { FlyerId } from "@LAF/Pages/Convex/Flyer/Models/FlyerId";
import type { FlyerConvex } from "@LAF/Pages/Convex/Flyer/Models/FlyerConvex";
import type { FlyerAura } from "@LAF/Pages/Convex/Flyer/Models/FlyerAura";

export default class FlyerService extends ServiceBase {
  public async getConvex(): Promise<{
    success: boolean;
    dashboard?: FlyerConvex;
  }> {
    const id: FlyerId = "flyer-convex";

    return this.fetch(`${this.host}/dashboard`, {
      id,
    });
  }

  public async getAura(): Promise<{
    success: boolean;
    dashboard?: FlyerAura;
  }> {
    const id: FlyerId = "flyer-aura";

    return this.fetch(`${this.host}/dashboard`, {
      id,
    });
  }
}
