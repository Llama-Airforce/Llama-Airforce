import { ServiceBase } from "@/Services";
import type * as ApiTypes from "./ApiTypes";
import * as Parsers from "./Parsers";

const API_URL = "https://prices.curve.fi";

export default class DaoService extends ServiceBase {
  public async getVotesOverview() {
    const resp = await this.fetch<ApiTypes.GetVotesOverviewResponse>(
      `${API_URL}/v1/dao/votes/overview`
    );

    return resp.data.map(Parsers.parseVotesOverview);
  }

  public async getLocksDaily(days: number) {
    const resp = await this.fetch<ApiTypes.GetLocksDailyResponse>(
      `${API_URL}/v1/dao/locks/daily/${days}`
    );

    return resp.locks.map(Parsers.parseLocksDaily);
  }

  public async getUserLocks(user: string) {
    const resp = await this.fetch<ApiTypes.GetUserLocksResponse>(
      `${API_URL}/v1/dao/locks/${user}`
    );

    return resp.locks.map(Parsers.parseUserLock);
  }

  public async getLockers(top: number) {
    const resp = await this.fetch<ApiTypes.GetLockersResponse>(
      `${API_URL}/v1/dao/lockers/${top}`
    );

    return resp.users.map(Parsers.parseLockers);
  }

  public async getSupply(days: number) {
    const resp = await this.fetch<ApiTypes.GetSupplyResponse>(
      `${API_URL}/v1/dao/supply/${days}`
    );

    return resp.supply.map(Parsers.parseSupply);
  }
}
