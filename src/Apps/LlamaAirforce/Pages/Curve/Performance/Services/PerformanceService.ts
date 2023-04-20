import ServiceBase from "@/Services/ServiceBase";
import { PoolPerformance } from "@LAF/Pages/Curve/Performance/Models/Performance";

export class PoolPerformanceResponse {
  returns: PoolPerformance[];
}

export default class PerformanceService extends ServiceBase {
  public get(
    pool: string,
    startDate: number,
    endDate: number,
    lpAmount: number
  ): Promise<PoolPerformanceResponse> {
    const url = `https://api-py.llama.airforce/curve/v1/pools/mainnet/returns/${pool}?start_date=${startDate}&end_date=${endDate}&lp_tokens=${lpAmount}`;
    return this.fetch(url, PoolPerformanceResponse);
  }
}
