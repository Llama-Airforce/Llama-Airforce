import ServiceBase from "@/Services/ServiceBase";
import {PoolPerformance} from "@/Pages/Curve/Performance/Models/Performance";


export class PoolPerformanceResponse {
  returns: PoolPerformance[];
}

export default class PerformanceService extends ServiceBase {
  public get(pool: string, startDate: number, endDate: number, lpAmount: number): Promise<PoolPerformanceResponse> {
    const url = `http://localhost:5001/curve/v1/pools/mainnet/returns/${pool}?start_date=${startDate}&end_date=${endDate}&lp_tokens=${lpAmount}`;
    console.log(url);
    return this.fetch(url, PoolPerformanceResponse);
  }
}
