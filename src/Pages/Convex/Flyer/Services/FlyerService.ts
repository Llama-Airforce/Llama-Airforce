import type { FlyerId } from "@/Pages/Convex/Flyer/Models/FlyerId";
import FlyerConvex from "@/Pages/Convex/Flyer/Models/FlyerConvex";
import FlyerAura from "@/Pages/Convex/Flyer/Models/FlyerAura";
import ServiceBase from "@/Services/ServiceBase";

export class FlyerConvexResponse {
  success: boolean;
  dashboard?: FlyerConvex;
}

export class FlyerAuraResponse {
  success: boolean;
  dashboard?: FlyerAura;
}

export default class FlyerService extends ServiceBase {
  public async getConvex(): Promise<FlyerConvexResponse> {
    const id: FlyerId = "flyer-convex";

    return this.fetch(`${this.host}/dashboard`, FlyerConvexResponse, {
      id,
    });
  }

  public async getAura(): Promise<FlyerAuraResponse> {
    const id: FlyerId = "flyer-aura";

    return this.fetch(`${this.host}/dashboard`, FlyerAuraResponse, {
      id,
    });
  }
}
